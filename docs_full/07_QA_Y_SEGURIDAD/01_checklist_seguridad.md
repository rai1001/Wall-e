# Checklist Seguridad
- RLS activa en todas las tablas operativas (`organizations`, `calendar_*`, `tasks`, `plan_assistant_suggestions`, etc.).
- Cada tabla multitenant usa `organization_id` y solo permite la org del claim actual (ver `public.current_org_id()`).
- Las funciones del asistente (`assistant_suggest`, `assistant_confirm`) y `plan_assistant_suggestions` solo pueden ser ejecutadas por miembros autenticados de la organización.
- Los Edge functions usan service role cuando escriben en la base; el frontend solo utiliza anon key + RLS (sin lógica crítica).
- Toda auditoría se documenta en `docs_full/04_SPRINTS/SPRINT_3_IA/storyteller.md` y se valida con `npm run test` antes de cerrar el sprint.
