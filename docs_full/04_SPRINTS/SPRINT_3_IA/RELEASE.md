# Sprint 3 Release + Demo

## Objetivo de la demo
- Validar que el asistente IA puede sugerir el siguiente paso sin ejecutar lógica crítica en el frontend.
- Mostrar que la cola multitenant está lista y que la personalización usa RPCs seguros.
- Confirmar QA (tests + checklist + SQL) antes del cierre del sprint.

## Pasos sugeridos
1. En el repo:
   - Ejecutar `npm run test` (ejecuta `tsc --noEmit`, `tests/assistant.test.cjs` y `tests/validate-schema.cjs`).
   - Resaltar las migraciones `supabase/migrations/20260121_000000_calendar_rpc.sql` y `20260122_000000_queue_consumers.sql` delante de stakeholders.
2. En Supabase Studio:
   - Revisar `plan_assistant_suggestions` y comprobar sus políticas RLS/organization_id.
   - Ejecutar:
     ```sql
     SET LOCAL request.jwt.claims.organization_id = '<otra-org>';
     SELECT * FROM public.calendar_change_queue WHERE status = 'pending';
     ```
     Confirmar que devuelve 0 rows; repetir sin el setter para mostrar los jobs propios.
3. En la app:
   - Mostrar el panel de personalización (modos Work Blend, Casa Calm, Focus Lock) y pulsar uno de los botones; explicar que `calendar.create_event` gestiona el request y que el panel resume el titulo + hora del evento creado.
   - Abrir el AssistantPanel, pedir una sugerencia, y confirmar/ rechazarla para mostrar los mensajes y que `assistant_confirm` actualiza el estado en la tabla.
4. QA + documentación:
   - Apuntar las evidencias en `docs_full/07_QA_Y_SEGURIDAD/01_checklist_seguridad.md`, `02_checklist_datos.md` y `04_checklist_fin_sprint.md`.
   - Compilar este reporte y guardarlo junto a los resultados de `supabase db push` y los tests (`npm run test` output).

## Cierre
- Confirmar que `git status` está limpio, que todo está commiteado y pushado.
- De ser necesario, dejar notas de seguimiento en `docs_full/04_SPRINTS/SPRINT_3_IA/storyteller.md` (línea de QA) y el release note del sprint.
