import { useState } from 'react';

const options = [
  { name: 'Work Blend', description: 'Destaca tareas laborales mientras elijo ahora toca.' },
  { name: 'Casa Calm', description: 'Suaviza notificaciones y destaca eventos de casa.' },
  { name: 'Focus Lock', description: 'Resalta tareas con prioridad y bloquea distracciones.' },
];

export default function PersonalizationControls() {
  const [active, setActive] = useState('Work Blend');

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
            onClick={() => setActive(option.name)}
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
        Elige qué mitiga tu modo TDAH. Nada se ejecuta aquí: la selección notifica a Supabase/Edge y el backend decide cómo aplicar los filtros.
      </p>
    </section>
  );
}
