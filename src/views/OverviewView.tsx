import { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { TimelineItem } from '../components/ui/TimelineItem';
import { TASK_DATA, EVENT_DATA } from '../data/mockData';
import { getNowSuggestion } from '../logic/suggestionEngine';
import type { Suggestion } from '../types/schema_house';
import { ConnectionTester } from '../components/debug/ConnectionTester';

export const OverviewView = () => {
    const [suggestion, setSuggestion] = useState<Suggestion | null>(null);

    useEffect(() => {
        // Simulating "Engine Context" - In a real app this comes from live sensors/state
        const ctx = {
            workLoad: 'medium' as const, // explicitly cast to match 'high'|'medium'|'low'
            minutesFree: 50,
            timeOfDay: '19:00'
        };
        setSuggestion(getNowSuggestion(ctx));
    }, []);

    return (
        <div className="flex flex-col gap-6 pb-24">
            {/* Header Date */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Lunes, 14 Ene</h1>
                <p className="text-gray-500">Vamos a por el día, Alex.</p>
            </div>

            {/* Focus Card (Dynamic) */}
            {suggestion && (
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 text-white shadow-lg shadow-blue-200 transform transition-all active:scale-[0.98]">
                    <div className="flex justify-between items-start mb-2">
                        <span className="bg-blue-500/30 px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wide backdrop-blur-sm">
                            Ahora toca
                        </span>
                        <span className="opacity-80 text-xs">{suggestion.minutes} min</span>
                    </div>

                    <h2 className="text-2xl font-bold mb-1 leading-tight">{suggestion.title}</h2>
                    <p className="text-blue-100 text-sm mb-4">{suggestion.reason}</p>

                    <button className="w-full bg-white text-blue-600 font-semibold py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-sm">
                        {suggestion.action_label}
                    </button>
                </div>
            )}

            {/* Timeline */}
            <Card title="Agenda">
                <div className="relative pl-4 space-y-0 before:absolute before:left-[19px] before:top-2 before:bottom-4 before:w-[2px] before:bg-gray-100">
                    {EVENT_DATA.map((event) => (
                        <TimelineItem key={event.id} event={event} />
                    ))}
                </div>
            </Card>

            {/* Pending Tasks (Quick Glance) */}
            <div>
                <h3 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">Para hoy</h3>
                <div className="space-y-2">
                    {TASK_DATA.filter(t => t.section.startsWith('work') && t.status === 'pending').slice(0, 2).map(task => (
                        <div key={task.id} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-orange-400" />
                            <span className="text-sm text-gray-700 truncate">{task.title}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Temporary Integration Test */}
            <div className="mb-24">
                <ConnectionTester />
            </div>

        </div>
    );
}
