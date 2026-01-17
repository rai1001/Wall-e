# Sprint 0 Storyteller

## Contexto
- Restauramos el sprint base siguiendo `AGENT.md` y `07_IMPLEMENTATION_RULES.md`: multi-tenant, DB-first, RLS siempre activa y lógica crítica en SQL/Edge.
- Las vistas `/calendar`, `/organize`, etc. se reemplazan temporalmente por un shell que solo muestra el estado del sprint y los placeholders Now/Week (sin lógica TDAH).
- El objetivo es tener un baseline limpio (migraciones nuevas) y una UI warm friendly que exhiba esa base sin tomar decisiones de negocio.

## Qué hicimos
1. Migraciones `supabase/migrations/20260120_000000_multitenant_baseline.sql`:
   - Tabla `organizations` + `organization_members` con roles (`owner`, `admin`, `manager`, `staff`).
   - Tablas calendar_* (connections, calendars, events, mappings, sync_state, change_queue) y `tasks`/`focus_sessions`/`parking`.
   - Helper `current_org_id()` y `is_org_member()` + `set_updated_at_column()` + RLS por tabla.
2. UI Spring shell (`src/App.tsx` + `src/components/sprint0/*`):
   - `OnboardingPanel`, `NowPreview`, `WeekPreview` y `StoryPanel` con la paleta terracotta/sage, placeholders de Now y Week, y recordatorios de que la lógica está en la DB.
3. Tests & QA:
   - Nuevo script `npm run test` que ejecuta `tsc --noEmit` para verificar tipos y evitar roturas antes del commit.
   - Documentamos el progreso en este storyteller y enlazamos el UI con los requisitos visuales de `docs_full/05_UI_STITCH`.

## Validaciones
- `npm run test` debe pasar antes de cerrar (corre `tsc --noEmit`).
- Checklist QA de Sprint 0: `docs_full/07_QA_Y_SEGURIDAD/04_checklist_fin_sprint` (pendiente de actualizar).
- UI: la vista principal es el shell Warm Friendly; se comparará con los tokens de `03_DESIGN_TOKENS.md`.
