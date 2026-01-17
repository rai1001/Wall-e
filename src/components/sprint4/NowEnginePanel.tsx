import { useEffect, useState } from 'react';
import {
  addParking,
  endFocus,
  getNextNowTask,
  startFocus,
} from '../../lib/nowActions';

type NowTask = {
  id: string;
  title: string;
  due: string;
  status: string;
};

export default function NowEnginePanel() {
  const [task, setTask] = useState<NowTask | null>(null);
  const [loadingTask, setLoadingTask] = useState(true);
  const [focusProcessing, setFocusProcessing] = useState(false);
  const [parkingText, setParkingText] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [session, setSession] = useState<{ id: string } | null>(null);

  const loadTask = async () => {
    setLoadingTask(true);
    try {
      const next = await getNextNowTask();
      setTask(next?.[0] ?? null);
    } catch (err) {
      setMessage((err as Error).message);
    } finally {
      setLoadingTask(false);
    }
  };

  useEffect(() => {
    loadTask();
  }, []);

  const handleStartFocus = async () => {
    if (!task) return;
    setFocusProcessing(true);
    setMessage(null);
    try {
      const result = await startFocus(task.id);
      setSession(result?.[0] ?? null);
      setMessage('Sesión Focus iniciada.');
    } catch (err) {
      setMessage((err as Error).message);
    } finally {
      setFocusProcessing(false);
    }
  };

  const handleEndFocus = async () => {
    if (!session) return;
    setFocusProcessing(true);
    setMessage(null);
    try {
      await endFocus(session.id);
      setSession(null);
      setMessage('Sesión Focus terminada.');
    } catch (err) {
      setMessage((err as Error).message);
    } finally {
      setFocusProcessing(false);
    }
  };

  const handleParking = async () => {
    if (!parkingText.trim()) return;
    setMessage(null);
    try {
      await addParking(parkingText.trim());
      setParkingText('');
      setMessage('Nota guardada en Parking.');
    } catch (err) {
      setMessage((err as Error).message);
    }
  };

  return (
    <section className="rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-soft">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Now Engine</p>
          <h3 className="text-2xl font-semibold text-main">Motor TDAH</h3>
        </div>
      </header>

      <div className="mt-4">
        {loadingTask ? (
          <p className="text-sm text-slate-500">Cargando tarea...</p>
        ) : task ? (
          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
            <p className="text-xl font-semibold text-main">{task.title}</p>
            <p className="text-xs text-slate-500">Due: {new Date(task.due).toLocaleString()}</p>
            <p className="text-xs uppercase tracking-[0.2em] text-terracotta">{task.status}</p>
          </div>
        ) : (
          <p className="text-sm text-slate-500">No hay tareas pendientes.</p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleStartFocus}
          disabled={focusProcessing || !task}
          className="flex-1 rounded-2xl bg-terracotta/20 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-terracotta"
        >
          {focusProcessing ? 'Procesando...' : 'Iniciar Focus'}
        </button>
        <button
          type="button"
          onClick={handleEndFocus}
          disabled={focusProcessing || !session}
          className="flex-1 rounded-2xl border border-sage py-3 text-xs font-semibold uppercase tracking-[0.3em] text-sage"
        >
          Finalizar Focus
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        <textarea
          className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3 text-sm text-main"
          placeholder="Anota algo para parking..."
          value={parkingText}
          onChange={(event) => setParkingText(event.target.value)}
        />
        <button
          type="button"
          onClick={handleParking}
          className="rounded-2xl bg-sage/30 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-sage transition hover:bg-sage/40"
        >
          Guardar en Parking
        </button>
      </div>

      {message && <p className="mt-3 text-xs text-slate-600">{message}</p>}
    </section>
  );
}
