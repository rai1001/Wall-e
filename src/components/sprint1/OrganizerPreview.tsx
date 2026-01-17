import { useCalendarPreview } from '../../hooks/useCalendarPreview';

export default function OrganizerPreview() {
  const { organizer } = useCalendarPreview();

  return (
    <section className="rounded-[32px] border border-slate-200 bg-white/80 p-6 shadow-soft">
      <header className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-main">Organizer</h3>
        <span className="text-xs uppercase tracking-[0.3em] text-slate-400">timeline</span>
      </header>

      <ul className="mt-4 space-y-3">
        {organizer.map((item) => (
          <li key={item.title} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
            <p className="text-sm font-semibold text-main">{item.title}</p>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Owner {item.owner}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
