# Checklist Datos
- Confirmar que las tablas `calendar_events`, `calendar_connections`, `tasks` tienen `organization_id` y RLS (mirar `supabase/migrations/...`).
- Validar que `useCalendarPreview` sólo consume datos si el JWT incluye `organization_id` y que los fallbacks pueden actuar mientras se completa el deploy.
- Registrar cualquier inconsistencia de sincronización en `calendar_change_queue` y documentar el hallazgo en `docs_full/04_SPRINTS/SPRINT_1_CORE/storyteller.md`.
