const weekDays = [
  { day: 'LUN', focus: 'Work' },
  { day: 'MAR', focus: 'Work' },
  { day: 'MIÉ', focus: 'Home' },
  { day: 'JUE', focus: 'Personal' },
  { day: 'VIE', focus: 'Work' },
  { day: 'SAB', focus: 'Off' },
  { day: 'DOM', focus: 'Reset' },
];

export default function WeekPreview() {
  return (
    <section className="rounded-[32px] border border-slate-200 bg-white/70 p-6 shadow-soft">
      <header className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-main">Week view</h3>
        <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Work vs Casa</span>
      </header>

      <div className="mt-4 grid grid-cols-4 gap-4 text-center text-xs font-semibold">
        {weekDays.map((day) => (
          <article key={day.day} className="rounded-2xl border border-slate-100/80 bg-slate-50/60 p-3">
            <p className="text-sm text-main">{day.day}</p>
            <p className={`mt-2 text-[11px] font-bold ${day.focus === 'Off' ? 'text-slate-400' : 'text-terracotta'}`}>
              {day.focus}
            </p>
          </article>
        ))}
      </div>

      <p className="mt-4 text-xs text-slate-500">
        Work (terracotta) y Casa (sage) mantienen su paleta, mientras el frontend sólo representa los datos que la DB honestamente entrega.
      </p>
    </section>
  );
}
