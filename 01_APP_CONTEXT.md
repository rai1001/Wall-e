# 01_APP_CONTEXT

## Arquitectura Objetivo

### Componentes
- **Frontend (React + Tailwind)**
  - Renderiza calendario (Day/Week/Month/Agenda), Connections, Organizer, Now.
  - Envía intenciones a RPC/Edge (crear/editar/mover eventos, activar Now).
- **Supabase Postgres (única fuente de verdad interna)**
  - Espejo de eventos de calendarios externos.
  - Cola de cambios (push) y estados de sync.
  - Motor TDAH determinista (Now card) + Focus Lock.
- **Supabase Edge Functions**
  - OAuth Google/Microsoft
  - Sync Pull (traer eventos)
  - Sync Push (aplicar cola a proveedor)
  - IA controlada solo para “micro-step” (Stuck Mode), con validación server-side.
- **Scheduler**
  - Pull incremental cada X minutos + push near real-time desde cola.

### Patrón de sincronización (mirror + queue)
- **Pull**: proveedor → DB (espejo).
- **Push**: DB (cola) → proveedor.
- Con conflictos: registrar error / `needs_review` (no pisar silenciosamente).

## Modelo de Datos (Resumen)

### Calendario
- `calendar_connections` (OAuth, multi-cuenta)
- `calendar_calendars` (calendarios dentro de cada conexión, `is_enabled`)
- `calendar_events` (espejo interno para UI)
- `calendar_event_mappings` (mapeo evento interno ↔ proveedor)
- `calendar_sync_state` (sync token/delta link)
- `calendar_change_queue` (cola idempotente de create/update/delete)

### Motor TDAH
- `tasks` (work/house/pugs, estados, focus lock por índice único)
- `focus_sessions`
- `parking_items`
- `day_status` (intensity: low/normal/intense)
- `pet_care_events`

## Fases del Proyecto

1. **Fase 0**: Setup de repo y base (RSL, Migrations, AppShell).
2. **Fase 1**: UI Warm Friendly (Pixel-perfect, sin lógica backend).
3. **Fase 2**: Calendario interno (CRUD seguro solo DB).
4. **Fase 3**: Google Calendar (Multi-cuenta, Pull/Push).
5. **Fase 4**: Motor TDAH (Focus Lock, Now, Parking).
6. **Fase 5**: Microsoft/Outlook.
7. **Fase 6**: Múltiples calendarios por cuenta.
8. **Fase 7**: Escalabilidad y Robustez.
