# Sprint 0 – Despliegue de la base multitenant

## Objetivo
Llevar el esquema limpio `supabase/migrations/20260120_000000_multitenant_baseline.sql` a la instancia Supabase y asegurar que el claim `organization_id` esté presente en los JWT para que la UI pueda filtrar por organización.

## Pasos
1. Conecta la CLI de Supabase al proyecto (usa `supabase login` + `supabase link --project-ref <ref>`).
2. Ejecuta `supabase db push --skip-generate` o `supabase migration run` para aplicar la migración `supabase/migrations/20260120_000000_multitenant_baseline.sql`.
3. Valida en SQL Editor que las tablas `organizations`, `calendar_events`, `tasks` y `plan_assistant_suggestions` existen con RLS (`pg_policy`).
4. Configura el claim `organization_id` en Supabase:
   - Define una Edge Function u onboarding que, después de validar el usuario, ejecute:
     ```sql
     select set_config('request.jwt.claims.organization_id', organization_id::text, true);
     ```
     y devuelva el JWT al cliente.
   - En Supabase, confirma en Authentication → Settings que `organization_id` se puede propagar en los claims (lean los docs de `JWT claims`).
5. Revisa que `public.current_org_id()` y `public.is_org_member(org_id)` devuelven valores válidos en la sesión de prueba desde Supabase Studio.

## Verificación
- Ejecuta `select * from public.organizations limit 1;` con un usuario de prueba; RLS debe permitir solo al miembro de esa org.
- Usa la consola de Supabase para simular `auth.uid()` + `organization_id` y comprueba que `calendar_events` devuelve solo filas de esa organización.
- Documenta cualquier ajuste en este directorio (`docs_full/04_SPRINTS/SPRINT_0_BASE/storyteller.md` y `docs_full/07_QA_Y_SEGURIDAD/04_checklist_fin_sprint.md`).
