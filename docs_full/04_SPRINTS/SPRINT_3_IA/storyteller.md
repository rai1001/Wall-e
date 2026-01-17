# Sprint 3 Storyteller

## Contexto
- Sprint 3 trae el asistente IA (`docs_full/06_IA/*` y `docs_full/05_UI_STITCH/storyteller.md:1`) capaz de sugerir el siguiente paso sin ejecutar decisiones críticas en el frontend.
- Trabajamos sobre la base segura de los Sprints anteriores: RPCs idempotentes (`calendar.*`), cola `calendar_change_queue` y el panel de personalización que ya llama a backend seguro.
- Esta historia documenta cómo los Edge Functions de IA escriben en `plan_assistant_suggestions`, cómo la UI representa las sugerencias con un panel dedicado y qué QA hay que hacer antes del cierre.

## Qué entregamos
1. **Tablas y RLS**
   - `plan_assistant_suggestions` ya existe en Sprint 0; ahora confirmamos que tiene campos `prompt`, `metadata`, `status` y `organization_id` y que el RLS obliga a la org del claim.
2. **Edge Functions**
   - `assistant_suggest` genera una recomendación (llama a `assistant-service.js`) y la guarda en memoria/migración con `organization_id` + `user_id + prompt`.
   - `assistant_confirm` actualiza `status` a `accepted`/`declined` y registra `answered_at`.
3. **UI**
   - `AssistantPanel` muestra la sugerencia, el prompt y ofrece botones para confirmar o rechazar, enlazado al helper `src/lib/assistantActions.ts`.
4. **QA**
   - Los tests `tests/assistant.test.cjs` validan que el servicio respeta `organization_id` e impide confirmaciones cross-org.
   - La checklist de seguridad/datos verifica que `plan_assistant_suggestions` solo devuelve filas de la org (prueba con `SET LOCAL request.jwt.claims.organization_id`).

## Validaciones
- Ejecutar `npm run test` (tsc + assistant test + schema check).
- Confirmar en Supabase Studio que `plan_assistant_suggestions` tiene RLS y no expone datos de otras organizaciones.
- Documentar resultados en `docs_full/07_QA_Y_SEGURIDAD/01_checklist_seguridad.md` y `docs_full/07_QA_Y_SEGURIDAD/02_checklist_datos.md`.

## Próximos pasos
1. Registrar QA/QA release/CI logs en las checklist y preparar la entrada del sprint para `docs_full/07_QA_Y_SEGURIDAD/04_checklist_fin_sprint.md`.
2. Alinear la UI con la historia final y preparar la demo del asistente IA para el sprint review.
3. Prioridad alta: fijar tests de middleware/autenticación que invoquen los middlewares (vitest/Playwright) validando tokens con y sin `organization_id`, documentar el flujo y resultados en `docs_full/07_QA_Y_SEGURIDAD/01_checklist_seguridad.md`.
4. Documentar que `PLAYWRIGHT_SUPABASE_KEY` se obtiene de `PLAYWRIGHT_SUPABASE_KEY` (obligatoria) y que el entorno lanza un error si no está disponible antes de ejecutar los escenarios de QA.
5. Ir cerrando Sprint 4 (RPCs + cola) y Sprint 5 (toggles/personalización) con evidencias en `docs_full/07_QA_Y_SEGURIDAD/02_checklist_datos.md` y `docs_full/07_QA_Y_SEGURIDAD/04_checklist_fin_sprint.md`.
