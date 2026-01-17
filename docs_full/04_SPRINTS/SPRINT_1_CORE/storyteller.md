# Sprint 1 Storyteller

## Contexto
- Construimos encima del shell de Sprint 0 para mostrar las vistas Week/Month/Organizer/Connections sin lógica crítica en el frontend (`AGENT.md`, `07_IMPLEMENTATION_RULES.md`).
- El objetivo es dar visibilidad “Warm Friendly” al calendario usando datos reales desde Supabase cuando estén disponibles, respetando `organization_id` + RLS.
- El plan incluye placeholders (Week + Month + Organizer + Connections) y un data layer (`useCalendarPreview`) que aún cae en fallbacks si la base no está lista.

## Qué hicimos
1. UI placeholders:
   - `WeekPreview`, `MonthPreview`, `OrganizerPreview`, `ConnectionsPreview` (`src/components/sprint0/*`, `src/components/sprint1/*`) muestran Work vs Casa, agendas y sincronización con la estética terracotta/sage.
   - `App.tsx` une el shell de Sprint 0 con los componentes Sprint 1 y mantiene la estructura responsive.
2. Data layer:
   - `src/lib/supabaseClient.ts` configura el cliente Supabase con `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY`.
   - `src/hooks/useCalendarPreview.ts` intenta consultar las tablas `calendar_events`, `calendar_connections` y `tasks`, cae en datos de fallback si no hay conexión y respeta la promesa de la RLS (filtra por `organization_id` gracias a la configuración de JWT).
3. Deploy interno:
   - `supabase/migrations/20260120_000000_multitenant_baseline.sql` y la documentación `docs_full/04_SPRINTS/SPRINT_0_BASE/deployment.md` dejan claro cómo subir el esquema y propagar el claim `organization_id`.

## Validaciones
- `npm run test` (tsc --noEmit) garantiza que TypeScript no se rompe tras añadir los nuevos componentes y hooks.
- QA visual: la página principal es un shell que se compara con los tokens de `03_DESIGN_TOKENS.md` y revisa que Work vs Casa se diferencien por color.
- Checklists actualizadas en `docs_full/07_QA_Y_SEGURIDAD`.

## Próximos pasos
1. En Sprint 2 conectaremos los componentes con datos reales de `calendar_events` y afianzaremos los RPC/Edge para crear/editar.
2. Mantener el storyteller al día cada vez que la data layer gana una nueva tabla o policy; registrar tests adicionales en `docs_full/07_QA_Y_SEGURIDAD/02_checklist_datos.md`.
