# Sprint 6 Storyteller - Hardening QA multitenant + Integraciones

## Contexto
- Tras habilitar toggles y worker `provider-sync` en Sprint 5, este sprint se centra en robustecer la capa multitenant (RLS/headers), extender la cobertura de tests (>70%) y asegurar que la cola + IA siguen aisladas por organización.
- Se atacan los gaps de cobertura en servicios, hooks y componentes clave (Now/Assistant/Calendario), y se documenta QA cross-org (headers, claims, `SET LOCAL`).

## Qué entregamos
1. **Integraciones y aislamiento**
   - Pruebas de `provider-sync` + RPC `calendar.toggle_calendar_enabled` con cabecera `x-organization-id`, verificando `pending → synced` y `processed_at`.
   - Evidencias de aislamiento: `SET LOCAL request.jwt.claims.organization_id = '<otra-org>'` sin filas, y org válida con sus jobs.
2. **Cobertura y testing**
   - Suites nuevas para servicios (`calendarService`, `reportService`, `kalElService`, `geminiService`) y hooks (`useEvents`, `useFocusMode`, `useVoiceInput`) con escenarios de éxito/error.
   - Tests de componentes clave: `AssistantPanel`, `NowEnginePanel`, calendario (Grid/Week/Month), vistas principales.
   - Objetivo: cobertura mínima 70% (ideal >80%) reportada en storyteller.
3. **Seguridad y headers**
   - `assistantActions` y Edge functions usan `Authorization: Bearer` + `x-organization-id` donde aplica; documentado en checklists.
   - Validaciones RLS/claims registradas en QA.

## Validaciones
- `npm run test` (tsc + Vitest con coverage + CJS). Registrar % de cobertura alcanzada.
- Pruebas cross-org de cola/toggles con `SET LOCAL request.jwt.claims.organization_id`.
- Tests de integración que invocan `provider-sync` con headers y RPC `calendar.toggle_calendar_enabled` para la org actual.
- Checklist de seguridad/datos actualizadas con rutas/headers probados y resultados.

## Próximos pasos
1. Implementar suites de servicios y hooks faltantes y extender UI tests (Calendar/Views).
2. Ejecutar pruebas cross-org y adjuntar logs en `docs_full/07_QA_Y_SEGURIDAD/02_checklist_datos.md` y release de Sprint 5/6.
3. Documentar cobertura lograda y cerrar con commit + push (`chore(sprint6): harden multi-tenant QA + coverage`).
