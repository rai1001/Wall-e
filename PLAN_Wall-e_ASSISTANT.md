# ChefOS Assistant — Plan Maestro (Arquitectura + Diseño + Fases)

> **Objetivo**: construir un **asistente personal con calendario** (look “normal”) que aplica reglas TDAH **solo en modo ejecución**.  
> **Stack obligado**: React + Tailwind (UI) · Supabase/Postgres (fuente de verdad) · RLS ON · Edge Functions para integraciones.

---

## Índice
1. [Visión del producto](#visión-del-producto)
2. [Principios no negociables](#principios-no-negociables)
3. [Arquitectura objetivo](#arquitectura-objetivo)
4. [Modelo de datos (resumen)](#modelo-de-datos-resumen)
5. [Fases del proyecto (paso a paso)](#fases-del-proyecto-paso-a-paso)
6. [Diseño UI — Warm Friendly + Kal-el](#diseño-ui--warm-friendly--kal-el)
7. [Prompts Antigravity IA (copiar/pegar)](#prompts-antigravity-ia-copiargar)
8. [Checklist QA por fase](#checklist-qa-por-fase)

---

## Visión del producto

ChefOS Assistant se presenta como **un calendario moderno** para coordinar trabajo y vida personal.  
Las “reglas TDAH” (Focus Lock, Stuck Mode, Parking, Now/Execute) **no aparecen** en las vistas normales del calendario; solo se activan cuando el usuario pulsa **“Ahora toca / Ejecutar”**.

---

## Principios no negociables

- **La UI miente, la DB manda**: el cliente no calcula prioridades ni estados críticos.
- **Multitenancy sagrado**: toda tabla operativa lleva `organization_id`.
- **RLS activo por defecto**: nunca se desactiva para “arreglar”.
- **Operaciones transaccionales**: cambios críticos con RPC/PLpgSQL.
- **Idempotencia**: toda acción sensible admite doble click (idempotency_key).
- **Conservadurismo**: Postgres primero, Edge Functions solo cuando toque (OAuth/sync/IA).

---

## Arquitectura objetivo

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

---

## Modelo de datos (resumen)

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

---

## Fases del proyecto (paso a paso)

> **Regla**: no se avanza de fase sin checklist QA completado.

### Fase 0 — Setup de repo y base
**Objetivo**: cimientos de seguridad y estructura.
- Supabase: crear proyecto, activar RLS por defecto, migraciones.
- Tablas base: organizations, memberships, profiles.
- Entorno frontend: React (Vite/Next) + Tailwind, routing, layout base.

**Entregables**
- Migrations core + RLS.
- AppShell vacío (sidebar/topbar) con rutas: `/calendar`, `/organize`, `/connections`, `/now`.

---

### Fase 1 — UI Warm Friendly (pixel-perfect) sin lógica real
**Objetivo**: clonar diseño exacto y componentes, sin backend real.
- Week view
- Month view
- Organizer (Work vs Casa + Pugs)
- Connections
- No Connections / Empty Calendar
- Event Editor (panel derecho)
- Now/Execute (Focus Mode) con Kal-el

**Entregables**
- Design System y componentes.
- Páginas con datos mock y estados.

---

### Fase 2 — Calendario interno (sin proveedor) + CRUD seguro
**Objetivo**: que el calendario funcione *solo con DB*.
- `calendar_events` como fuente de verdad interna.
- RPCs idempotentes: list_range, upsert_event, delete_event.
- UI conectada a Supabase para leer/escribir eventos internos.

**Entregables**
- CRUD eventos 100% funcional (sin sync externo).
- Badges sync: “synced/pending/error” (por ahora “synced” siempre).

---

### Fase 3 — Google Calendar (multi-cuenta) — 1 calendario primary por cuenta
**Objetivo**: sincronización real con Google, manteniendo UI “normal”.
- OAuth Google:
  - start + callback
  - guardar tokens cifrados
  - crear `calendar_connections`
- Descubrir y activar calendar primary (`calendar_calendars`)
- Pull incremental (primary)
- Push cola (create/update/delete)

**Entregables**
- Conectar 2 cuentas Google y ver eventos combinados.
- Crear/editar en tu app y verlo en Google.
- Editar en Google y verlo en tu app (por pull).

---

### Fase 4 — Motor TDAH (Now/Execute) con Focus Lock real
**Objetivo**: ejecutar sin ensuciar el calendario.
- `get_now_suggestion(p_org, available_minutes)` en DB.
- `start_task`, `complete_task` idempotentes y transaccionales.
- UI /now consume la tarjeta “Now”.

**Entregables**
- Focus Lock (WIP=1) enforced en DB.
- Parking real (tabla).
- Stuck Mode: micro-step determinista + (opcional IA controlada).

---

### Fase 5 — Microsoft/Outlook
**Objetivo**: replicar patrón Google con Graph.
- OAuth Microsoft
- Pull delta
- Push cola

**Entregables**
- Misma UX que Google, con múltiples cuentas.

---

### Fase 6 — Múltiples calendarios por cuenta (selección)
**Objetivo**: que el usuario elija qué calendars se sincronizan.
- Listar calendarios en cada conexión (Google/Microsoft).
- UI toggles `is_enabled`
- Pull/push por calendar enabled.

---

### Fase 7 — Escalabilidad/robustez
**Objetivo**: producción.
- Backoff y deadletter en cola.
- Observabilidad (logs, métricas, alertas).
- Resolución de conflictos (etag mismatch → needs_review).
- Pruebas de integración (dinero/stock no aplica aquí, pero sync sí).

---

## Diseño UI — Warm Friendly + Kal-el

### Tokens (obligatorios)
- `bg-cream`: `#FFFBF2`
- `work-terracotta`: `#D2691E`
- `home-sage`: `#87A96B`
- `text-main`: `#3C3C3C`
- `accent-orange`: `#FF8C42`
- `radius-xl`: `24px`
- `shadow-soft`: `0 8px 30px rgba(0,0,0,0.04)`

### Tipografías
- Headings: **Fraunces**
- UI/body: **Inter**

### Reglas UX clave
- Calendario = “normal”. Nada de gamificación ni mensajes motivacionales.
- TDAH solo en **/now** (Execution Mode) + empty states de casa.
- Work vs Casa: separación clara por color + filtros.

### Kal-el (pug) — comportamiento
- Solo aparece en:
  - /now (execution)
  - Empty states de “Casa”
  - Detalle en Event Editor cuando el evento es de Casa/Pugs
- Estados visuales:
  1) Neutral (Now)
  2) Curioso (Editor casa)
  3) Guardián (Parking)
  4) Celebración (task complete)

---

## Vínculos a imágenes de referencia (stitch_wall_e)

> Estas imágenes son la “verdad visual” para replicar pixel-perfect.

- Calendar Week  
  - `sandbox:/mnt/data/stitch_wall_e/warm_friendly:_calendar_week/screen.png`
- Monthly Overview  
  - `sandbox:/mnt/data/stitch_wall_e/warm_friendly:_monthly_overview/screen.png`  
  - `sandbox:/mnt/data/stitch_wall_e/warm_friendly:_monthly_overview/code.html`
- Weekly Task Organizer (Work vs Casa + Pugs)  
  - `sandbox:/mnt/data/stitch_wall_e/warm_friendly:_weekly_task_organizer/screen.png`  
  - `sandbox:/mnt/data/stitch_wall_e/warm_friendly:_weekly_task_organizer/code.html`
- Connections  
  - `sandbox:/mnt/data/stitch_wall_e/warm_friendly:_connections/screen.png`
- No Connections  
  - `sandbox:/mnt/data/stitch_wall_e/warm_friendly:_no_connections/screen.png`  
  - `sandbox:/mnt/data/stitch_wall_e/warm_friendly:_no_connections/code.html`
- Empty Calendar  
  - `sandbox:/mnt/data/stitch_wall_e/warm_friendly:_empty_calendar_1/screen.png`  
  - `sandbox:/mnt/data/stitch_wall_e/warm_friendly:_empty_calendar_2/screen.png`
- Event Editor  
  - `sandbox:/mnt/data/stitch_wall_e/warm_friendly:_event_editor_1/screen.png`  
  - `sandbox:/mnt/data/stitch_wall_e/warm_friendly:_event_editor_1/code.html`  
  - `sandbox:/mnt/data/stitch_wall_e/warm_friendly:_event_editor_2/screen.png`  
  - `sandbox:/mnt/data/stitch_wall_e/warm_friendly:_event_editor_3/screen.png`

---

## Prompts Antigravity IA (copiar/pegar)

> **Orden exacto recomendado** (no saltar):
1) Fuente de verdad visual → Design System → AppShell/Routes  
2) Calendar Week → Month → Organizer → Connections → Event Editor → Empty States  
3) Integración Supabase (CRUD interno)  
4) Sync Google multi-cuenta  
5) Motor TDAH (/now) real

### Prompt A — Fuente de verdad visual
```text
Usa como referencia VISUAL EXACTA las imágenes PNG y los code.html ubicados en:
- /mnt/data/stitch_wall_e/**

Objetivo: replicar pixel-perfect el estilo Warm Friendly (fondos crema, radios grandes, sombras suaves),
y generar componentes React + Tailwind reutilizables que reproduzcan los layouts de esas pantallas.

Regla: si el layout del diseño y lo que generas difiere, prioriza la referencia visual (screen.png).
```

### Prompt B — Design System + componentes base
```text
Crea un Design System en React + Tailwind para “ChefOS Assistant – Warm Friendly”.

TOKENS:
- bg-cream: #FFFBF2
- work-terracotta: #D2691E
- home-sage: #87A96B
- text-main: #3C3C3C
- accent-orange: #FF8C42
- radius-xl: 24px
- shadow-soft: 0 8px 30px rgba(0,0,0,0.04)

Tipografías:
- Headings: Fraunces
- Body/UI: Inter

Componentes:
AppShell, Tabs (Day/Week/Month/Agenda), CalendarGrid, EventChip, BadgeSync, PanelRight,
Modal, Toast, Buttons, Toggles, EmptyState.

Salida: estructura de carpetas + props + ejemplo de uso.
```

### Prompt C — Páginas y navegación
```text
Genera rutas/páginas:
- /calendar: Day | Week | Month | Agenda, filtros Work/Home, + Evento, Ahora toca (no altera calendario)
- /organize: Work vs Casa + Pugs, Brain Dump/Parking
- /connections: multi-cuenta Google, Microsoft disabled “próximamente”, toggles de calendars (fase 3)
- /now: Execution Mode (Focus Lock visual), Kal-el, Stuck Mode, Parking

Desktop: sidebar + contenido + panel derecho opcional.
Mobile: bottom nav (Calendar, Organize, Now, Connections).
```

### Prompt D — Week pixel-perfect
```text
Implementa Calendar Week replicando:
- /mnt/data/stitch_wall_e/warm_friendly:_calendar_week/screen.png

Requisitos: 7 columnas, chips por color Work/Home, now-line, seleccionar evento abre PanelRight.
```

### Prompt E — Month pixel-perfect
```text
Implementa Monthly Overview replicando:
- /mnt/data/stitch_wall_e/warm_friendly:_monthly_overview/screen.png
y layout guía:
- /mnt/data/stitch_wall_e/warm_friendly:_monthly_overview/code.html

Reglas: dots Work/Home, glow sutil para carga, click día abre panel lateral.
```

### Prompt F — Organizer Work vs Casa + Pugs
```text
Implementa Weekly Task Organizer replicando:
- /mnt/data/stitch_wall_e/warm_friendly:_weekly_task_organizer/screen.png
y guía:
- /mnt/data/stitch_wall_e/warm_friendly:_weekly_task_organizer/code.html

Requisitos: 2 columnas (Trabajo vs Casa+Pugs), Brain Dump/Parking abajo, filtro Balance de vida.
```

### Prompt G — Connections multi-cuenta
```text
Implementa Connections replicando:
- /mnt/data/stitch_wall_e/warm_friendly:_connections/screen.png

Requisitos: cards por cuenta Google, last sync/errores/reintentar,
Microsoft visible pero disabled (próximamente).
```

### Prompt H — Event Editor con cuenta/calendario
```text
Implementa Event Editor replicando:
- /mnt/data/stitch_wall_e/warm_friendly:_event_editor_1/screen.png
y guía:
- /mnt/data/stitch_wall_e/warm_friendly:_event_editor_1/code.html

Campos: título, descripción, ubicación, inicio/fin, all-day, recordatorio.
Selector Cuenta (connection) y Calendario (calendar).
Badges sync dentro del editor.
Kal-el “Curioso” solo si contexto Casa/Pugs.
```

### Prompt I — Execution Mode /now (Kal-el)
```text
Crea /now (Execution Mode):
- Oculta sidebar/topbar
- Card central: título, “Kal-el sugiere:” + 1 micro-step (<30s, sin listas)
- Botones: Continuar 7 min (primary), Pausar, Atascado, Parking
- Parking abre modal con input 3–6 palabras y CTA Guardar
Kal-el solo aparece aquí y en empty states de Casa.
```

### Prompt J — Empty states
```text
Genera Empty States replicando:
- /mnt/data/stitch_wall_e/warm_friendly:_empty_calendar_1/screen.png
- /mnt/data/stitch_wall_e/warm_friendly:_no_connections/screen.png

Sin presión, CTA claro (Conectar Google / Crear evento).
Kal-el descansando en Casa.
```

---

## Checklist QA por fase

### Fase 1 (UI)
- [ ] Week/Month/Organizer/Connections/Editor/Now se parecen a screen.png.
- [ ] Work vs Casa separados por color + filtro.
- [ ] Kal-el NO aparece en vistas normales (solo /now y empty casa).

### Fase 2 (CRUD interno)
- [ ] Crear/editar/borrar eventos funciona con RPC idempotentes.
- [ ] RLS impide acceso a otros usuarios/orgs.
- [ ] Badges sync renderizan estados.

### Fase 3 (Google multi-cuenta)
- [ ] Conectar 2 cuentas y ver eventos combinados.
- [ ] Crear en app → aparece en Google correcto (account+calendar).
- [ ] Cambiar en Google → aparece en app por pull.
- [ ] Cola push con retries y sin duplicados.

### Fase 4 (TDAH)
- [ ] /now usa Now card del backend.
- [ ] Focus Lock enforced en DB (WIP=1).
- [ ] Parking guarda items en DB.
- [ ] Stuck Mode devuelve 1 micro-step (sin listas).

### Fase 5+ (Microsoft / multi-calendars)
- [ ] Mismo patrón que Google.
- [ ] Toggles is_enabled controlan sync y visibilidad.

---

## Notas finales
- Este documento define el **orden exacto** de implementación y la referencia visual.
- Si algo entra en conflicto (UI vs DB), siempre gana **DB** y las reglas de seguridad.
