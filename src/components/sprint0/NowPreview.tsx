const nowTasks = [
  { title: 'Revisar cola de sincronización', owner: 'DB Lead', status: 'in-progress' },
  { title: 'Preparar onboarding org', owner: 'SysOps', status: 'scheduled' },
];

const statusBadge: Record<string, string> = {
  'in-progress': 'bg-terracotta/10 text-terracotta',
  scheduled: 'bg-sage/10 text-sage',
};

export default function NowPreview() {
  return (
    <section className="rounded-[32px] border border-slate-200 bg-white/80 p-6 shadow-soft">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Now / Ejecutar</p>
          <h2 className="text-2xl font-semibold text-main">Sintoniza el motor TDAH</h2>
        </div>
        <span className="rounded-full bg-slate-800/10 px-3 py-1 text-xs font-semibold text-slate-600">Modo calmado</span>
      </header>

      <div className="mt-4 space-y-4">
        {nowTasks.map((task) => (
          <div key={task.title} className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-main">{task.title}</p>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Responsable {task.owner}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${statusBadge[task.status]}`}>
              {task.status.replace('-', ' ')}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
