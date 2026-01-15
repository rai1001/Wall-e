import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Chip } from '../components/ui/Chip';
import { HOUSE_AREAS, ROTATION_STATE } from '../data/mockHouseData';

// Mocking the Week State for the UI Visualization
const WEEK_DAYS = [
    { day: 'L', label: 'Lun', load: 'high', status: 'green', tasks: ['bucket', 'paw'] },
    { day: 'M', label: 'Mar', load: 'medium', status: 'yellow', tasks: ['laundry'] },
    { day: 'X', label: 'Mié', load: 'low', status: 'green', tasks: ['deep', 'bucket'] },
    { day: 'J', label: 'Jue', load: 'high', status: 'green', tasks: [] },
    { day: 'V', label: 'Vie', load: 'medium', status: 'yellow', tasks: ['trash', 'kitchen'] },
    { day: 'S', label: 'Sáb', load: 'low', status: 'gray', tasks: ['deep_optional'] },
    { day: 'D', label: 'Dom', load: 'low', status: 'gray', tasks: ['planning'] },
];

export const HomeView = () => {
    const [selectedDay, setSelectedDay] = useState(2); // Wednesday selected by default
    const currentArea = HOUSE_AREAS.find(a => a.id === ROTATION_STATE.next_area_id);
    const nextArea = HOUSE_AREAS.find(a => a.sort_order === (currentArea?.sort_order || 0) + 1) || HOUSE_AREAS[0];

    return (
        <div className="flex flex-col gap-6 pb-24 md:max-w-4xl md:mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Semana Casa</h1>
                    <p className="text-sm text-gray-500">Todo bajo control 🟢</p>
                </div>
                <div className="flex gap-2">
                    <Chip label="1 Deep/sem" variant="blue" />
                </div>
            </div>

            {/* Week Strip - Scrollable on mobile, Grid on Tablet */}
            <div className="overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:pb-0 scrollbar-hide">
                <div className="grid grid-cols-7 gap-1 min-w-[320px]">
                    {WEEK_DAYS.map((d, i) => (
                        <button
                            key={i}
                            onClick={() => setSelectedDay(i)}
                            className={`flex flex-col items-center p-2 rounded-xl transition-all ${selectedDay === i ? 'bg-white shadow-md ring-2 ring-blue-100' : 'bg-transparent opacity-70'
                                }`}
                        >
                            <span className="text-xs font-medium text-gray-400 mb-1">{d.day}</span>
                            <div className={`w-3 h-3 rounded-full mb-1 ${d.status === 'green' ? 'bg-green-400' :
                                d.status === 'yellow' ? 'bg-yellow-400' : 'bg-gray-200'
                                }`} />

                            {/* Tiny Icons */}
                            <div className="flex flex-col gap-0.5">
                                {d.tasks.includes('deep') && <span className="text-[10px]">🧽</span>}
                                {d.tasks.includes('laundry') && <span className="text-[10px]">🧺</span>}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Tablet Grid Layout */}
            <div className="md:grid md:grid-cols-[1.5fr,1fr] md:gap-6 md:items-start">

                {/* Main Column: Day Details */}
                <Card title={WEEK_DAYS[selectedDay].label} className="animate-in fade-in slide-in-from-bottom-2 duration-300 md:h-full">
                    <div className="space-y-4">
                        {WEEK_DAYS[selectedDay].load === 'high' && (
                            <div className="bg-orange-50 text-orange-700 text-xs px-3 py-2 rounded-lg flex items-center gap-2">
                                <span>⚡</span> Día intenso de trabajo detectado. Tareas reducidas.
                            </div>
                        )}

                        {/* Tasks List */}
                        <div className="space-y-3">
                            {WEEK_DAYS[selectedDay].tasks.includes('deep') ? (
                                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                                    <div className="text-xl mt-1">🧽</div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Limpieza Profunda: {currentArea?.name}</h4>
                                        <p className="text-sm text-gray-600">45 min · Prioridad Media</p>
                                        <div className="mt-2 flex gap-2">
                                            <button className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg font-medium">Hacer ahora</button>
                                            <button className="text-xs text-gray-500 hover:bg-white px-3 py-1.5 rounded-lg">Mover</button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400 italic py-2">No hay tareas grandes hoy.</p>
                            )}

                            {/* Micro Tasks */}
                            <div className="border-t border-gray-100 pt-3">
                                <h5 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Mantenimiento</h5>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-3">
                                        <input type="checkbox" className="rounded text-blue-500 focus:ring-blue-500" />
                                        <span className="text-sm text-gray-700">Orden rápido (5 min)</span>
                                    </div>
                                    {WEEK_DAYS[selectedDay].tasks.includes('bucket') && (
                                        <div className="flex items-center gap-3">
                                            <input type="checkbox" className="rounded text-blue-500 focus:ring-blue-500" />
                                            <span className="text-sm text-gray-700">Sacar basura</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Side Column: Rotation Status (On Tablet) / Below (On Mobile) */}
                <Card title="Rotación Limpieza" className="bg-gray-50 border-none md:mt-0">
                    <div className="flex items-center justify-between md:flex-col md:items-start md:gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-lg">
                                ⏭
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase">Toca esta semana</p>
                                <p className="font-medium text-gray-900">{currentArea?.name}</p>
                            </div>
                        </div>
                        <div className="text-right opacity-50 md:text-left md:w-full md:border-t md:border-gray-200 md:pt-4">
                            <p className="text-xs text-gray-500 uppercase">Siguiente</p>
                            <p className="font-medium text-gray-900">{nextArea?.name}</p>
                        </div>
                    </div>
                </Card>
            </div>

        </div>
    );
}
