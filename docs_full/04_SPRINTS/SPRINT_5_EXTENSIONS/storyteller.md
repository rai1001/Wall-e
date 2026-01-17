# Sprint 5 Storyteller

## Contexto
- Después de estabilizar el motor TDAH (Sprint 4), Sprint 5 se enfoca en las extensiones que conectan la cola `calendar_change_queue` con proveedores externos (Google/Microsoft/Outlook) y en aumentar la robustez de los toggles `is_enabled`.
- El AGENT sigue mandando: lógica crítica en Postgres/Edge, `organization_id` en cada tabla y RLS activa; las integraciones usan `calendar.change_queue` y no exponen datos de otras organizaciones.

## Qué vamos a construir
1. **Integraciones externas**
   - Edge Function `calendar_sync_handler` que consume `calendar_change_queue` (reutilizando el placeholder `queue_processor`) y dispara push/pull a los proveedores simulados, registrando status/errores.
   - RPC/Edge para activar/desactivar `calendar_calendars.is_enabled` respetando `organization_id` y desencadenando jobs en la cola (todo se documenta).
2. **Robustez y pruebas**
   - Pruebas SQL en `public.calendar_change_queue` donde se inserta un job con `status = 'pending'` y se valida que solo la org con el claim puede verlo; los reintentos usan `idempotency_key`.
   - Monitoreo del foco/parking en `focus_sessions` (max una sesión por user) y `parking` (no leak cross-org) con scripts de verificación.
3. **Documentación/QA**
   - Crear `docs_full/04_SPRINTS/SPRINT_5_EXTENSIONS/RELEASE.md` con la guía de la demo (comandos, pruebas, logs).
   - Actualizar checklists y storytellers conforme se agregan las integraciones.

## Validaciones
- `npm run test` (incluyendo tests del assistant y validaciones de migraciones) debe pasar en cada iteración.
- Simular fallos del proveedor (respuestas de error) y confirmar que la cola retiene `status = 'pending'` y se reintenta.
- QA debe verificar que los toggles `is_enabled` se guardan con `organization_id` y no se ven en otras cuentas.

## Próximos pasos
1. Implementar Edge/RPC que lean la cola y emulen un push/pull contra Google/Microsoft (console log + dummy response).
2. Añadir endpoints para toggles `is_enabled`.
3. Documentar los resultados en las checklist y preparar la evidencia de release/demo.
4. Registrar la Release final en `docs_full/04_SPRINTS/SPRINT_5_EXTENSIONS/RELEASE.md` y enlazarla en las checklists de seguridad/datos/fin de sprint.
