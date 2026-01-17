# Sprint 2 Storyteller

## Contexto
- Con Sprint 0 desplegamos la base multitenant y Sprint 1 mostró el shell Warm Friendly. Ahora Sprint 2 toma la base para entregar el CRUD seguro de calendario/cola y prepara la personalización (events, connections, perfiles).
- El AGENT nos recuerda que la lógica crítica siempre debe residir en SQL/Edge con `organization_id` + RLS activo; aquí definimos las funciones/RPC que el UI invocará para crear/editar calendarios y sincronizar eventos.

## Qué vamos a entregar
1. **CRUD de calendarios y eventos**
   - RPC `calendar.create_event`, `calendar.update_event`, `calendar.delete_event` (registro activo en `calendar_change_queue`) que validan `organization_id`, aplican RLS y registran la operación en la cola con `idempotency_key`.
   - Cada función es `security definer` y retorna el evento afectado, permitiendo que la UI muestre la respuesta final mientras la base maneja la lógica crítica.
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

# RPC guardrails
- Cada RPC usa `public.current_org_id()` para fijar la organización y lanza excepciones cuando la entidad no pertenece al tenant.
- La cola `calendar_change_queue` se llena con `payload` JSON y `status = 'pending'` para que futuras Edge Functions leyendola respeten los filtros del tenant.
- Solo el rol `authenticated` tiene `GRANT EXECUTE` en estas funciones, y la UI todavía usa `useCalendarPreview`/personalización para evitar ejecutar lógica sin backend.

## Consumo de la cola
- `supabase/migrations/20260122_000000_queue_consumers.sql` introduce `calendar_job.process_queue()` como base para un lector de `calendar_change_queue`.
- Developers ya pueden usar la Edge Function `supabase/edge-functions/queue_processor.js`, que busca un job `pending` en la org actual, marca `processing`, simula push/pull y actualiza a `synced`.  
- El contrato es que el token manda `organization_id` y la función solo toca jobs de esa org —el siguiente paso es reemplazar el placeholder por llamadas a Google/Microsoft y documentar ese circuito.

## Próximos pasos
1. Diseñar las funciones SQL/Edge listadas arriba y subirlas como nuevas migraciones (`supabase/migrations/2026012X_*`).
2. Ampliar `useCalendarPreview` para mostrar el estado de `calendar_change_queue` y permitir que el toggle de personalización modifique flags `is_enabled` o filtros en la base.
3. Registrar los tests manuales/automáticos y actualizar los storytellers a medida que se cierran las funcionalidades; solo cerramos el sprint cuando “Tests + Commit + Push” y QA están completos.

## Hook frontal → RPC
- El helper `src/lib/calendarActions.ts` llama a `calendar.create_event` con `idempotency_key` generado por cada toggle de personalización, de modo que la UI sigue siendo solo eventos y toda la lógica queda en SQL/Edge.
- `PersonalizationControls` usa ese hook para disparar la RPC cuando el usuario elige un modo (Work Blend, Casa Calm, Focus Lock) y muestra mensajes de estado/error junto a los botones.
- Esto cierra el gap: una pulsación en la UI ahora envía un job al queue y la base lo procesará preservando las reglas `organization_id`, y el próximo paso será mostrar el resultado en los componentes de Sprint 1 y registrar pruebas en QA.

## Feedback visual RPC
- `PersonalizationControls` ahora muestra el título y hora del evento que devolvió `calendar.create_event`, exhibiendo en pantalla el feedback del RPC para que el usuario vea “qué se creó” sin mover lógica al cliente.
- Esto permite validar también en QA que la respuesta del RPC contiene `organization_id` correcto (el hook `calendarActions` la reportará en cualquier error) antes de mostrar el `queue_processor` en vivo.
