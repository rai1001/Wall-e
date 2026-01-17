# Sprint 5 Release Notes

## Objetivo
Sprint 5 cierra el ciclo de integraciones externas: los toggles `calendar_calendars.is_enabled` disparan jobs idempotentes en la cola y el worker (`supabase/edge-functions/provider-sync.js`) atiende esos jobs respetando `organization_id`, simulando push/pull contra los proveedores configurados.

## Cambios clave
1. **Migraciones**
   - `supabase/migrations/20260124_000000_toggle_queue.sql` amplía el constraint de `calendar_change_queue` para permitir la acción `toggle`, agrega la columna `processed_at` para auditoría y crea la RPC `calendar.toggle_calendar_enabled`.
   - `calendar.toggle_calendar_enabled` actualiza `is_enabled`, encola el job y es idempotente vía `idempotency_key`.
2. **Worker Edge**
   - `supabase/edge-functions/provider-sync.js` ahora requiere la cabecera `x-organization-id`, procesa únicamente jobs de esa org, actualiza `processed_at`, simula los push/pull (incluyendo toggles) y devuelve qué se procesó para trazabilidad.
3. **QA y seguridad**
   - Todos los flujos pasan por la nueva RPC y por el worker para evitar data leakage cross-org.
   - Los toggles se testean desde el cliente via `supabase.rpc('calendar.toggle_calendar_enabled', ...)` y se valida que el job resultante aparece en `calendar_change_queue` con el mismo `organization_id`.

## Checklist QA
- `npm run test` completo (tsc + schema + assistant tests).
- Ejecutar `SELECT * FROM public.calendar_change_queue WHERE organization_id = current_setting('request.jwt.claims.organization_id', true)::uuid` y confirmar que los toggles aparecen con `status = 'pending'`.
- Invocar `supabase/edge-functions/provider-sync` con `x-organization-id` apuntando a la org que inserta el job y verificar que el job pasa a `status = 'synced'` y `processed_at` se actualiza.
- Validar que `calendar.toggle_calendar_enabled` no deja que un usuario de otra organización altere `is_enabled` (RLS + policy).

## Evidencias QA adicionales
- Registrar en el repositorio los resultados de `SET LOCAL request.jwt.claims.organization_id = '<otra-org>'; SELECT * FROM public.calendar_change_queue WHERE status = 'pending';` y su contraparte para la org actual, confirmando que los datos solo aparecen para la org correcta.
- Documentar en el release cómo se probaron los toggles: ejecutar la RPC desde el cliente con `idempotency_key`, ejecutar el worker (o simularlo) y asegurar que el job de la misma org pasa de `pending` a `synced`.
- Capturar resultados de tests de integración (Playwright/Supertest) que cubran el `provider-sync` y la RPC `calendar.toggle_calendar_enabled`, incluidos los headers `x-organization-id` y la ausencia de acceso cross-org.

## Deployment
- Ejecutar `supabase db push` contra el proyecto nuevo para aplicar las migraciones.
- Configurar el scheduler/Edge Job que llame a `provider-sync` por cada organización (pasando `x-organization-id`) o usar un worker generalizado que rote headers.
- Actualizar la UI para llamar a la RPC desde los toggles y refrescar el estado tras cada confirmación.
