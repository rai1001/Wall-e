# 10_CODEX_PROMPTS

> Prompts listos para copiar y pegar en Antigravity para generar código base.

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
