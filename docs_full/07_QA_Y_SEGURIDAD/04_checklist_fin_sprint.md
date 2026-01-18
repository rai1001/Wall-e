# Checklist Fin Sprint
- `npm run test` (tsc --noEmit, tests de assistant y validación de migraciones) pasa antes del cierre.
- RLS + organization_id confirmados en `supabase/migrations/20260120_000000_multitenant_baseline.sql` y `plan_assistant_suggestions`.
- QA documentado: lista de seguimiento `docs_full/04_SPRINTS/SPRINT_2_PERSONALIZACION/storyteller.md` y `docs_full/04_SPRINTS/SPRINT_3_IA/storyteller.md`.
- Commit + Push ok.
- Release documentada en `docs_full/04_SPRINTS/SPRINT_5_EXTENSIONS/RELEASE.md` y enlazada desde este checklist.
- Validar que los tests de middleware/autenticación (vitest/Playwright) corrieron con `PLAYWRIGHT_SUPABASE_KEY` desde variables de entorno y que la suite falla si la clave falta.
- Confirmar que las respuestas E2E incluyen los headers de seguridad (CSP, X-Frame-Options, X-Content-Type-Options) para las rutas probadas y registrar la lista de rutas verificadas.
- Sprint 6: registrar cobertura alcanzada (>70% objetivo) y evidencias de tests de integración (assistant/cola/toggles) con headers y claims correctos.
