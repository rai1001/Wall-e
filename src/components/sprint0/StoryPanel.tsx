export default function StoryPanel() {
  return (
    <section className="rounded-[32px] border border-slate-200 bg-slate-950/80 p-6 text-slate-100 shadow-soft backdrop-blur">
      <header className="flex items-center justify-between">
        <h3 className="text-base uppercase tracking-[0.3em] text-slate-400">Sprint 0 Story</h3>
        <span className="text-xs text-sage">DOCS_FULL/04_SPRINTS/SPRINT_0_BASE</span>
      </header>
      <p className="mt-3 text-sm text-slate-300">
        Definimos la base limpia: organizaciones, miembros y tablas calendar_* + tasks con `organization_id`.
        La UI representa el Now/Week Shell sin lógicas críticas; toda decisión se documenta y se cubre con tests (tsc).
      </p>
      <ul className="mt-4 space-y-2 text-xs text-slate-400">
        <li>- Schema supabase renovado con RLS por tenant y helpers `current_org_id() + is_org_member()`.</li>
        <li>- UI shell React/Tailwind solo consume placeholders; la lógica TDAH se deja para Sprint 4.</li>
        <li>- Tests: `npm run test` ejecuta `tsc --noEmit` y valida el ajuste de App y migraciones.</li>
      </ul>
    </section>
  );
}
