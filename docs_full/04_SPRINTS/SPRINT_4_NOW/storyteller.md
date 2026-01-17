# Sprint 4 Storyteller

## Contexto
- Sprint 4 entrega el motor TDAH / “Now” operando totalmente en SQL/Edge según `docs_full/01_APP_CONTEXT`. Las tablas `tasks`, `focus_sessions`, `parking` ya existen; ahora implementamos funciones que proveen la sesión actual, el bloqueo de focus y el guardado de parking sin lógica en el frontend.
- Todo el sprint respeta `organization_id` + RLS (AGENT). Las funciones devuelven solo datos de la org del claim y escriben en `public.focus_sessions`/`parking` a través de RPCs con `security definer`.

## Qué entregamos
1. **Funciones internas**
   - `public.tasks_get_next_now_task(user_id)`: devuelve la próxima tarea a ejecutar según status y duración estimada.
   - `public.focus_start_session(user_id, task_id)`: arranca una sesión focus garantizando que no haya otra en curso para el mismo usuario.
   - `public.focus_end_session(session_id, outcome)`: cierra la sesión y registra el resultado.
   - `public.parking_add_item(user_id, note)`: guarda notas de Parking sin que el cliente ejecute lógica crítica.
2. **UI & flujo**
   - Expandir el Now panel a través de `src/components/sprint4/NowEnginePanel.tsx`, mostrando la tarea `Now`, los botones Focus Lock/Parking y el feedback de cada acción.
   - Mantener la paleta Warm Friendly y los tokens de `docs_full/05_UI_STITCH`.
3. **QA**
   - Tests automatizados verifican que `focus_start_session` falla si ya hay sesión activa y que `parking_add_item` devuelve la nota guardada; `tests/validate-schema.cjs` asegura presencia de funciones.
   - Documentar en `docs_full/07_QA_Y_SEGURIDAD/02_checklist_datos.md` y `04_checklist_fin_sprint.md` que la cola + now respeta `organization_id`.

## Validaciones
- Ejecutar `npm run test` (tsc + assistant + schema) después de cada cambio.
- Probar en Supabase Studio `select * from public.focus_sessions where user_id = current_user` y verificar que solo hay una sesión abierta.
- Registrar en este storyteller los resultados QA y los logs de operación.

## Próximos pasos
1. Incorporar los controladores del frontend (botones Now/Focus/Parking) y watchers para actualizar los estados desde la base.
2. Parametrizar la lógica TDAH en las funciones (por ejemplo, qué tareas priorizar) y dejar decisiones de negocio en SQL/Edge.
3. Preparar la checklist `docs_full/07_QA_Y_SEGURIDAD/04_checklist_fin_sprint.md` para cerrar Sprint 4.
