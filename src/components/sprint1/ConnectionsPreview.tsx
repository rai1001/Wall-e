import { useCalendarPreview } from '../../hooks/useCalendarPreview';

export default function ConnectionsPreview() {
  const { connections } = useCalendarPreview();

  return (
    <section className="rounded-[32px] border border-slate-200 bg-white/80 p-6 shadow-soft">
      <header className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-main">Connections</h3>
        <span className="text-xs uppercase tracking-[0.3em] text-slate-400">OAuth + sync</span>
      </header>
      <div className="mt-4 space-y-3">
        {connections.map((connection) => (
          <article key={connection.provider} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
            <div>
              <p className="text-sm font-semibold text-main">{connection.provider}</p>
              <p className="text-xs text-slate-400">Sincronización {connection.status}</p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] ${
                connection.status === 'active' ? 'bg-sage/20 text-sage' : 'bg-terracotta/20 text-terracotta'
              }`}
            >
              {connection.status}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}
