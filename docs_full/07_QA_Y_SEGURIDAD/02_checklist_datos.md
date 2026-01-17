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
