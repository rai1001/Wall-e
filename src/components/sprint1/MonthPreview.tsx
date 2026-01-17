import { useCalendarPreview } from '../../hooks/useCalendarPreview';

export default function MonthPreview() {
  const { month, loading } = useCalendarPreview();

  return (
    <section className="rounded-[32px] border border-slate-200 bg-white/80 p-6 shadow-soft">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Month</p>
          <h3 className="text-2xl font-semibold text-main">Month overview</h3>
        </div>
        <span className="rounded-full border border-slate-200 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-400">
          Warm friendly
        </span>
      </header>

      <div className="mt-4 grid grid-cols-2 gap-4">
        {(loading ? month : month).map((week) => (
          <article key={week.label} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
            <p className="text-sm font-semibold text-main">{week.label}</p>
            <p className="text-xs text-slate-500">{week.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
