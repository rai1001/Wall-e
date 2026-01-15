# 09_QA_VISUAL

> Checklist específico para asegurar la calidad visual "Warm Friendly".

## General
- [ ] Fondo de aplicación es `#FFFBF2`.
- [ ] Sombras son suaves (`shadow-soft`) y no duras.
- [ ] Radios de borde son consistentes (`24px` para contenedores grandes).
- [ ] Tipografía `Fraunces` en títulos, `Inter` en cuerpo.

## Componentes
- [ ] **Botones**: Tienen estados hover/active claros.
- [ ] **Event Chips**: Colores correctos (Terracotta para Work, Sage para Home). Texto legible.
- [ ] **Grid**: Alineación perfecta de las líneas de hora.
- [ ] **Inputs**: Focus ring visible y armonioso con la paleta.

## Kal-el
- [ ] Se muestra la variante correcta según el estado (Neutral vs Curioso vs Guardián).
- [ ] No se deforma ni se pixela (SVG o alta res).

## Responsividad
- [ ] Sidebar desaparece en móvil -> Bottom Bar aparece.
- [ ] Grid de calendario se adapta al ancho disponible.
