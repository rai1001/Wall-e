import { useState } from 'react';
import { createEvent } from '../../lib/calendarActions';

const options = [
  { name: 'Work Blend', description: 'Destaca tareas laborales mientras elijo ahora toca.' },
  { name: 'Casa Calm', description: 'Suaviza notificaciones y destaca eventos de casa.' },
  { name: 'Focus Lock', description: 'Resalta tareas con prioridad y bloquea distracciones.' },
];

export default function PersonalizationControls() {
  const [active, setActive] = useState('Work Blend');
  const [status, setStatus] = useState<'idle' | 'saving'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [lastEvent, setLastEvent] = useState<{ title: string; start_time: string } | null>(null);

  return (
    <section className="rounded-[32px] border border-slate-200 bg-white/80 p-6 shadow-soft">
      <header className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-main">Personaliza tu semana</h3>
        <span className="text-xs uppercase tracking-[0.3em] text-slate-400">TDAH safe</span>
      </header>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {options.map((option) => (
          <button
            key={option.name}
            type="button"
            onClick={async () => {
              setError(null);
              setStatus('saving');
              setActive(option.name);
              try {
                const data = await createEvent({
                  calendar_id: '00000000-0000-0000-0000-000000000000',
                  title: `Modo ${option.name}`,
                  start_time: new Date().toISOString(),
                  end_time: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
                });
                if (data?.[0]) {
                  setLastEvent({
                    title: data[0].title,
                    start_time: data[0].start_time,
                  });
                }
              } catch (err) {
                setError((err as Error).message);
              } finally {
                setStatus('idle');
              }
            }}
            disabled={status === 'saving'}
            className={`rounded-2xl border p-4 text-left transition ${
              active === option.name
                ? 'border-terracotta bg-terracotta/10 text-main'
                : 'border-slate-100 bg-white text-slate-600'
            }`}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.3em]">{option.name}</p>
            <p className="text-xs text-slate-400">{option.description}</p>
          </button>
        ))}
      </div>

      <p className="mt-6 text-xs text-slate-500">
        Elige qué mitiga tu modo TDAH. La selección llama directamente a `calendar.create_event` y la base decide cómo aplicar los filtros.
      </p>
      {error && <p className="mt-2 text-xs text-rose-500">Error: {error}</p>}
      {status === 'saving' && <p className="mt-2 text-xs text-slate-500">Guardando...</p>}
      {lastEvent && (
        <div className="mt-4 rounded-2xl border border-slate-100 bg-sage/10 p-4 text-sm text-slate-700">
          <p className="font-semibold text-terracotta">Evento creado: {lastEvent.title}</p>
          <p className="text-xs text-slate-500">
            Inicio: {new Date(lastEvent.start_time).toLocaleString()}
          </p>
        </div>
      )}
    </section>
  );
}
