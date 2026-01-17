export default function OnboardingPanel() {
  const steps = [
    { title: 'Conectar organización', detail: 'Usa Supabase Auth y organiza usuarios por org_id.' },
    { title: 'Encender RLS', detail: 'Todas las tablas operativas reciben owner_id + organization_id.' },
    { title: 'Idempotencia', detail: 'Cada acción crítica requiere idempotency_key (cola / sync).' },
  ];

  return (
    <section className="rounded-[32px] border border-slate-200 bg-white/80 p-6 shadow-soft backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-terracotta">WALL·E</p>
          <h1 className="text-3xl font-semibold text-main">ChefOS Assistant</h1>
        </div>
        <span className="rounded-full bg-terracotta/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-terracotta">
          Sprint 0
        </span>
      </div>

      <p className="mt-4 text-sm text-main/60">
        La app arranca limpio: supabase + Auth + RLS en cada tabla. Los usuarios sólo ven
        datos de su organización y el frontend solo muestra eventos resetados.
      </p>

      <div className="mt-6 space-y-3">
        {steps.map((step) => (
          <div key={step.title} className="rounded-2xl border border-slate-100/80 bg-slate-50/60 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{step.title}</p>
            <p className="text-sm text-main/75">{step.detail}</p>
          </div>
        ))}
      </div>

      <button className="mt-6 w-full rounded-2xl bg-sage py-3 font-semibold uppercase tracking-[0.3em] text-main transition hover:bg-sage/90">
        Ver estado del Sprint 0
      </button>
    </section>
  );
}
