# 03_DESIGN_TOKENS

## Paleta de Colores (Warm Friendly)
- `bg-cream`: `#FFFBF2` (Fondo principal)
- `work-terracotta`: `#D2691E` (Identificador Work)
- `home-sage`: `#87A96B` (Identificador Home/Pugs)
- `text-main`: `#3C3C3C` (Texto principal)
- `accent-orange`: `#FF8C42` (Acentos UI)

## Sombras y Bordes
- `radius-xl`: `24px`
- `shadow-soft`: `0 8px 30px rgba(0,0,0,0.04)`

## Tipografía
- **Headings**: `Fraunces`
- **Body/UI**: `Inter`

## Reglas UX
1. **Calendario Normal**: Nada de gamificación en las vistas de calendario.
2. **Separación de Contextos**: Work vs Casa siempre diferenciados por color (`terracotta` vs `sage`).
3. **Kal-el (Pug)**:
   - Solo aparece en: `/now` (Execution Mode), Empty States de Casa, y detalles de eventos de Casa.
   - Estados: Neutral (Now), Curioso (Editor), Guardián (Parking), Celebración.
