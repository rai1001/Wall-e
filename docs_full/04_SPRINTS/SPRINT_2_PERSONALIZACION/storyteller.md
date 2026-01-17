# Sprint 2 Storyteller

## Contexto
- Con Sprint 0 desplegamos la base multitenant y Sprint 1 mostró el shell Warm Friendly. Ahora Sprint 2 toma la base para entregar el CRUD seguro de calendario/cola y prepara la personalización (events, connections, perfiles).
- El AGENT nos recuerda que la lógica crítica siempre debe residir en SQL/Edge con `organization_id` + RLS activo; aquí definimos las funciones/RPC que el UI invocará para crear/editar calendarios y sincronizar eventos.

## Qué vamos a entregar
1. **CRUD de calendarios y eventos**
   - RPC `calendar.create_event`, `calendar.update_event`, `calendar.delete_event` que validan `organization_id`, aplican RLS y registran la operación en `calendar_sync_state`/`calendar_change_queue`.
   - Tablas `calendar_events`, `calendar_event_mappings`, `calendar_change_queue` ya existen en la migración Sprint 0; ahora definimos las funciones PL/pgSQL necesarias para ejecutar operaciones idempotentes (uso de `idempotency_key`).
2. **Sincronización y conexiones**
   - Edge Function/RPC para listar `calendar_connections` y habilitar toggles `is_enabled`.
   - Cola `calendar_change_queue` con políticas que evitan leaks cross-org y `status` en ('pending','processing','synced').
   - Documentar en este storyteller cómo la cola se valida antes de push externo y qué pruebas la cubren.
3. **Hooks + UI para personalización**
   - Componentes o vistas placeholder en `src` que muestran eventos creados por la RPC y permiten alternar `Work vs Casa`.
   - `useCalendarPreview` extenderlo para mostrar el estado de `calendar_change_queue` y los connections (dejamos flujos fallback para cuando el backend no devuelva datos).
4. **Tests + QA**
   - Test de validación de RPC: llama `calendar.create_event` con `idempotency_key` duplicada y confirma que no duplica filas.
   - Integración que asegura que el queue solo puede ser leído por la org activa (`public.current_org_id()`).
   - Checklist de QA/seguridad (`docs_full/07_QA_Y_SEGURIDAD/02_checklist_datos.md` y `04_checklist_fin_sprint.md`) actualizados con los resultados.

## Validaciones necesarias
- Correr `npm run test` (tsc + migration check) tras cada cambio; agregaremos pruebas SQL/Edge para el queue y los RPCs.
- Verificar en Supabase Studio que `calendar_change_queue` no expone filas cross-org (usar `SET LOCAL request.jwt.claims.organization_id` para simular).
- Documentar en `docs_full/04_SPRINTS/SPRINT_2_PERSONALIZACION/storyteller.md` cuándo se crearon los RPC/Edge y qué guardarraíles se probaron.

## Qué acabamos de construir
- `PersonalizationControls` (solo UI) y `EventList` muestran cómo el usuario puede seleccionar un modo (Work Blend, Casa Calm, Focus Lock) y visualizar eventos destacados sin ejecutar lógica en el cliente.
- `useCalendarPreview` sigue alimentando los componentes Sprint 1, pero ahora la UI incluye una fila dedicada a “personalización”, mostrando que las decisiones terminan en Supabase/Edge.
- Esto prepara el camino para conectar la cola `calendar_change_queue` y los RPC `calendar.create_event` en Sprint 2 sin romper la experiencia warm friendly.

## Próximos pasos
1. Diseñar las funciones SQL/Edge listadas arriba y subirlas como nuevas migraciones (`supabase/migrations/2026012X_*`).
2. Ampliar `useCalendarPreview` para mostrar el estado de `calendar_change_queue` y permitir que el toggle de personalización modifique flags `is_enabled` o filtros en la base.
3. Registrar los tests manuales/automáticos y actualizar los storytellers a medida que se cierran las funcionalidades; solo cerramos el sprint cuando “Tests + Commit + Push” y QA están completos.
