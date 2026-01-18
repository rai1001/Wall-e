import { useState } from 'react';
import {
  confirmSuggestion,
  requestSuggestion,
  type SuggestionResponse,
} from '../../lib/assistantActions';

export default function AssistantPanel() {
  const [suggestion, setSuggestion] = useState<SuggestionResponse | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'confirming'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const askAssistant = async () => {
    setStatus('loading');
    setError(null);
    setMessage(null);
    try {
      const result = await requestSuggestion({
        plan_id: 'plan-1',
        prompt: 'Resume el plan actual y sugiere el siguiente paso.',
      });
      setSuggestion(result);
      setStatus('idle');
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Error desconocido al contactar con el asistente';
      console.error('Assistant request failed', err);
      setError(msg);
      setStatus('idle');
    }
  };

  const confirm = async (approved: boolean) => {
    if (!suggestion?.id) return;
    setStatus('confirming');
    setError(null);
    try {
      const result = await confirmSuggestion({
        suggestion_id: suggestion.id,
        approved,
      });
      setMessage(approved ? 'Sugerencia aceptada.' : 'Sugerencia rechazada.');
      setStatus('idle');
      setSuggestion(result);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Error desconocido al confirmar la sugerencia';
      console.error('Assistant confirm failed', err);
      setError(msg);
      setStatus('idle');
    }
  };

  return (
    <section className="rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-soft">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-500">IA Asistente</p>
          <h3 className="text-2xl font-semibold text-main">Sugerencias calmadas</h3>
        </div>
        <span className="rounded-full border border-slate-200 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-400">
          Modo story
        </span>
      </header>

      <p className="mt-4 text-sm text-slate-600">
        Pide una sugerencia y la IA solo te muestra un texto; las confirmaciones o rechazos se graban en Supabase/Edge con `plan_assistant_suggestions`.
      </p>

      <div className="mt-4 space-y-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
        {suggestion ? (
          <div>
            <p className="text-sm font-semibold text-main">{suggestion.suggestion}</p>
            <p className="text-xs text-slate-500">Prompt: {suggestion.prompt ?? 'contexto general'}</p>
          </div>
        ) : (
          <p className="text-xs text-slate-400">La IA aún no ha sugerido nada.</p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={askAssistant}
          disabled={status === 'loading'}
          className="flex-1 rounded-2xl bg-sage py-3 text-xs font-semibold uppercase tracking-[0.3em] text-main transition hover:bg-sage/90 disabled:opacity-60"
        >
          {status === 'loading' ? 'Consultando...' : 'Consultar IA'}
        </button>
        <button
          type="button"
          onClick={() => confirm(true)}
          disabled={!suggestion || status === 'loading' || status === 'confirming'}
          className="flex-1 rounded-2xl border border-slate-900/10 bg-white py-3 text-xs font-semibold uppercase tracking-[0.3em] text-main transition hover:border-slate-900/30 disabled:opacity-60"
        >
          Confirmar
        </button>
        <button
          type="button"
          onClick={() => confirm(false)}
          disabled={!suggestion || status === 'loading' || status === 'confirming'}
          className="flex-1 rounded-2xl border border-slate-900/10 bg-white py-3 text-xs font-semibold uppercase tracking-[0.3em] text-main transition hover:border-slate-900/30 disabled:opacity-60"
        >
          Rechazar
        </button>
      </div>

      {message && <p className="mt-3 text-xs text-emerald-500">{message}</p>}
      {error && <p className="mt-3 text-xs text-rose-500">Error: {error}</p>}
    </section>
  );
}
