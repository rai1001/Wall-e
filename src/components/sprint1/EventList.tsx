import { useCalendarPreview } from '../../hooks/useCalendarPreview';

export default function EventList() {
  const { week, loading } = useCalendarPreview();

  return (
    <section className="rounded-[32px] border border-slate-200 bg-white/80 p-6 shadow-soft">
      <header className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-main">Eventos destacados</h3>
        <span className="text-xs uppercase tracking-[0.3em] text-slate-400">personalización</span>
      </header>

      <div className="mt-4 space-y-3">
        {(loading ? week : week).map((slot) => (
          <article
            key={`${slot.day}-${slot.events?.[0] ?? Math.random()}`}
            className="flex items-start justify-between rounded-2xl border border-slate-100/80 bg-slate-50/60 p-4"
          >
            <div>
              <p className="text-sm font-semibold text-main">{slot.day}</p>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{slot.focus}</p>
              <p className="mt-1 text-sm text-slate-600">{slot.events?.[0]}</p>
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400">
              Work vs Casa
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}
