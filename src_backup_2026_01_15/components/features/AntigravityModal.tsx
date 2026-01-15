import { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { aiService, type TaskInput } from '../../services/ai';

interface AntigravityModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Step = 'INPUT' | 'PROCESSING' | 'ACTION' | 'FOCUS' | 'DONE';

export const AntigravityModal = ({ isOpen, onClose }: AntigravityModalProps) => {
    const [step, setStep] = useState<Step>('INPUT');
    const [taskTitle, setTaskTitle] = useState('');
    const [energy, setEnergy] = useState<'low' | 'medium' | 'high'>('medium');
    const [suggestion, setSuggestion] = useState<{ text: string; minutes: number } | null>(null);
    const [timer, setTimer] = useState(0);

    // Reset on open
    useEffect(() => {
        if (isOpen) {
            setStep('INPUT');
            setTaskTitle('');
            setSuggestion(null);
            setTimer(0);
        }
    }, [isOpen]);

    const handleGetUnstuck = async () => {
        if (!taskTitle.trim()) return;

        setStep('PROCESSING');
        try {
            const input: TaskInput = {
                task_title: taskTitle,
                task_type: 'work', // default for MVP
                energy: energy
            };
            const result = await aiService.generateNextStep(input);
            setSuggestion({
                text: result.next_step,
                minutes: result.step_minutes
            });
            setStep('ACTION');
        } catch (error) {
            console.error("Failed to get suggestion", error);
            // Fallback
            setStep('INPUT');
        }
    };

    const startFocus = () => {
        if (suggestion) {
            setTimer(suggestion.minutes * 60);
            setStep('FOCUS');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className={`w-full max-w-lg transition-all transform duration-300 ${step === 'FOCUS' ? 'scale-105' : 'scale-100'}`}>

                {/* STEP 1: INPUT */}
                {step === 'INPUT' && (
                    <Card title="¿En qué te atascaste?" className="bg-white shadow-2xl border-none">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">La Tarea</label>
                                <input
                                    type="text"
                                    value={taskTitle}
                                    onChange={(e) => setTaskTitle(e.target.value)}
                                    placeholder="Ej: Escribir informe..."
                                    className="w-full text-lg border-b-2 border-blue-500 focus:border-blue-700 outline-none px-2 py-2 bg-gray-50 rounded-t"
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tu Energía Ahora</label>
                                <div className="flex gap-2">
                                    {(['low', 'medium', 'high'] as const).map((e) => (
                                        <button
                                            key={e}
                                            onClick={() => setEnergy(e)}
                                            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${energy === e
                                                ? 'bg-blue-100 text-blue-700 border-2 border-blue-200'
                                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                                }`}
                                        >
                                            {e === 'low' ? '🐢 Baja' : e === 'medium' ? '🚶 Media' : '⚡ Alta'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 flex justify-between items-center">
                                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">Cancelar</button>
                                <Button onClick={handleGetUnstuck} disabled={!taskTitle.trim()} variant="primary">
                                    🚀 Dame el Primer Paso
                                </Button>
                            </div>
                        </div>
                    </Card>
                )}

                {/* STEP 2: PROCESSING */}
                {step === 'PROCESSING' && (
                    <Card title="" className="bg-white shadow-xl flex flex-col items-center justify-center p-8 min-h-[300px]">
                        <div className="animate-spin text-4xl mb-4">🌀</div>
                        <p className="text-lg font-medium text-gray-600">Analizando el camino más corto...</p>
                    </Card>
                )}

                {/* STEP 3: ACTION PROPOSAL */}
                {step === 'ACTION' && suggestion && (
                    <Card title="Tu Misión Inmediata" className="bg-white shadow-2xl border-l-4 border-l-green-400">
                        <div className="space-y-6">
                            <div className="bg-green-50 p-6 rounded-xl border border-green-100 text-center">
                                <h3 className="text-2xl font-bold text-gray-800 mb-2 leading-tight">
                                    {suggestion.text}
                                </h3>
                                <p className="text-green-700 font-medium">⏱ {suggestion.minutes} minutos</p>
                            </div>

                            <div className="text-center text-sm text-gray-500">
                                Sin pensar. Solo haz esto. El resto vendrá después.
                            </div>

                            <div className="flex flex-col gap-3">
                                <Button onClick={startFocus} variant="primary" className="w-full py-4 text-lg shadow-lg shadow-blue-500/30">
                                    ⏱ Comenzar Temporizador
                                </Button>
                                <button
                                    onClick={() => setStep('INPUT')}
                                    className="text-sm text-gray-400 hover:text-gray-600 py-2"
                                >
                                    No, dame otra opción
                                </button>
                            </div>
                        </div>
                    </Card>
                )}

                {/* STEP 4: FOCUS LOCK */}
                {step === 'FOCUS' && (
                    <div className="relative text-white text-center">
                        <div className="absolute inset-0 bg-blue-900 absolute rounded-2xl opacity-90 blur-xl"></div>
                        <Card title="MODO HIPERFOCO" className="relative bg-gray-900 border-gray-800 text-white shadow-2xl overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 animate-pulse"></div>

                            <div className="py-8">
                                <h2 className="text-xl text-gray-300 mb-6">{suggestion?.text}</h2>
                                <div className="text-7xl font-mono font-bold tracking-widest mb-8 text-white">
                                    {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                                </div>

                                <p className="text-sm text-gray-500 mb-8 animate-pulse">
                                    No rompas el ciclo. Solo esta tarea.
                                </p>

                                <div className="flex justify-center gap-4">
                                    <Button onClick={onClose} variant="secondary">
                                        Terminé 🎉
                                    </Button>
                                    <button onClick={() => setTimer(t => t + 60)} className="text-gray-500 hover:text-white px-4">
                                        +1 min
                                    </button>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

            </div>
        </div>
    );
};
