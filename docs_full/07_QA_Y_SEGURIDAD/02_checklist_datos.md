# Checklist Datos
- Confirmar que las tablas `calendar_events`, `calendar_connections`, `tasks` tienen `organization_id` y RLS (mirar `supabase/migrations/...`).
- Validar que `useCalendarPreview` sólo consume datos si el JWT incluye `organization_id` y que los fallbacks pueden actuar mientras se completa el deploy.
- Ejecutar la query de seguimiento:
  ```sql
  SET LOCAL request.jwt.claims.organization_id = '<otra-org>';
  SELECT * FROM public.calendar_change_queue WHERE status = 'pending';
  ```
  y confirmar que no retorna jobs para esa organización; repetir para la org actual asegurando que aparecen los pendientes propios.
- Registrar cualquier inconsistencia de sincronización en `calendar_change_queue` y documentarla en `docs_full/04_SPRINTS/SPRINT_2_PERSONALIZACION/storyteller.md`.
- Añadir verificaciones de Sprint 4:
  ```sql
  SELECT * FROM public.focus_sessions WHERE user_id = auth.uid() AND ended_at IS NULL;
  ```
  debe devolver máximo 1 sesión activa; `parking` no debe filtrar por otra organización cuando se inserta con claim.
- Sprint 5: validar toggles `is_enabled` y provider sync:
  - Desactivar un calendario (`is_enabled = false`) y confirmar que `calendar_change_queue` recibe el job correspondiente con la org correcta.
  - Ejecutar la Edge Function `provider-sync` simulada y verificar que el job pasa a `synced` solo para la org del claim (usar `SET LOCAL request.jwt.claims.organization_id`).
- Tests unitarios adicionales:
  - `useActiveOrg` debe derivar la org del claim y no permitir cambio manual; los hooks deben cubrir los escenarios válidos y los errores cuando falta `organization_id`.
  - Los helpers de cookies que almacenan claims (`auth`, `org`) tienen pruebas que validan la serialización/deserialización y que respetan la org del claim actual.
- Escenarios E2E extra para Sprint 4/5:
  - Validar que los toggles de personalización activan/desactivan `calendar_change_queue` de la misma org al pulsar el switch y que el job resultante se puede procesar sin cross-org leakage.
  - Registrar en la QA la comprobación de la cola con `SET LOCAL request.jwt.claims.organization_id` (mismos pasos que antes) y documentar los values/metadata observados.
- Confirmar que `calendar.toggle_calendar_enabled` crea el job `action = 'toggle'` con `organization_id` y que la función no deja desactivar/activar calendarios de otra organización.
- Verificar que el worker `provider-sync` (o el scheduler que lo invoca) procesa el job de la misma org y actualiza `status = 'synced'` + `processed_at`; documentar la evidencia del run en `docs_full/04_SPRINTS/SPRINT_5_EXTENSIONS/RELEASE.md`.
- Registrar las ejecuciones de:
  ```sql
  SET LOCAL request.jwt.claims.organization_id = '<otra-org>';
  SELECT * FROM public.calendar_change_queue WHERE status = 'pending';
  ```
  y su equivalente para la org actual, y adjuntar en el release/QA los resultados que muestran la política `organization_id`.
- Documentar qué pruebas de integración (Playwright/Supertest) cubren `provider-sync` y la RPC `calendar.toggle_calendar_enabled`, incluyendo los headers `x-organization-id` y la confirmación de que el worker no procesa jobs de otras organizaciones.
- Registrar en Sprint 6 la cobertura de tests (objetivo >70%) y las suites añadidas (hooks, servicios, componentes) con sus resultados.
