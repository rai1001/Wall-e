# UI Stitch Storyteller

## Principios
- La UI sigue representando la experiencia “Warm Friendly” y solo muestra datos que vienen de Supabase/Edge.
- Los componentes de Sprint 0/1 exhiben la progresión del plan sin ejecutar lógica de negocio: Onboarding, Now, Week, Organizer, Connections y personalización.
- Esta página ahora incorpora una sección del asistente IA que consume los endpoints `assistant_suggest`/`assistant_confirm`.

## Componentes redescritos
1. `OnboardingPanel` + `StoryPanel`: explican el sprint base y los guardarraíles multitenant.
2. `AssistantPanel` (nuevo): muestra sugerencias generadas por la IA, botones para confirmar/rechazar y los estados de feedback; se alimenta vía `src/lib/assistantActions.ts` con endpoints Edge seguros.
3. `PersonalizationControls` y `EventList`: mantienen la paleta terracotta/sage, disparan `calendar.create_event` y ahora informan al usuario del título + hora que devolvió la base.

## Conexiones con el backend
- Las acciones de IA se exponen a través de `supabase/edge-functions/assistant_suggest.js` y `assistant_confirm.js`, que usan la lógica de `assistant-service.js`.
- Cada botón de la UI lanza la RPC/Edge function y mantiene la regla “IA sugiere, el backend decide”.
- Cualquier cambio visual debe documentarse aquí y atarse al queue/assistant en `docs_full/04_SPRINTS/SPRINT_2_PERSONALIZACION/storyteller.md` y `docs_full/04_SPRINTS/SPRINT_3_IA/storyteller.md`.
