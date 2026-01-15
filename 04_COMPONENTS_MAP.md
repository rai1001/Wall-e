# 04_COMPONENTS_MAP

## Estructura Base
- `AppShell`: Layout principal con Sidebar (Desktop) y BottomBar (Mobile).
- `Sidebar`: Navegación principal.
- `PanelRight`: Panel lateral colapsable para detalles y edición.

## Calendar Components
- `Tabs`: Selector de vistas (Day, Week, Month, Agenda).
- `CalendarGrid`: Rejilla del calendario (Week/Month).
- `EventChip`: Representación visual de un evento (variants: work, home).
- `NowLine`: Indicador de hora actual.

## Organizer Components
- `OrganizerColumn`: Columna de tareas (Work vs Home).
- `ParkingArea`: Área de "Brain Dump".

## Connections Components
- `ConnectionCard`: Tarjeta de estado de cuenta (Google/Microsoft).
- `BadgeSync`: Indicador de estado de sincronización (synced, pending, error).

## Focus / Now Components
- `NowCard`: Tarjeta principal de ejecución.
- `KalElMascot`: Componente visual del personaje.
- `FocusLockPill`: Indicador de modo enfoque.

## UI Primitives (Atoms)
- `Button` (Primary, Secondary, Ghost, Icon)
- `Modal`
- `Toast`
- `Input` / `Select`
- `Toggle` / `Switch`
- `EmptyState`
