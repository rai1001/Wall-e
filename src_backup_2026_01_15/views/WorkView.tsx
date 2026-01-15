import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { TaskRow } from '../components/ui/TaskRow';
import { TabSelector } from '../components/ui/TabSelector';
import { TASKS } from '../data/mockData';

export const WorkView: React.FC = () => {
    const [activeTab, setActiveTab] = useState('Hoy');

    // Filter tasks (Mock logic: in a real app, strict filtering would be backend)
    const importantTasks = TASKS.filter(t => t.section === 'work_important');
    const advanceTasks = TASKS.filter(t => t.section === 'work_advance');
    const extraTasks = TASKS.filter(t => t.section === 'work_extra');
    const totalTasks = TASKS.filter(t => t.section?.startsWith('work')).length;

    return (
        <div className="p-6 pt-8 pb-24 space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Trabajo</h1>
                <p className="text-gray-500 mt-1">Día cargado · {totalTasks} tareas · 3h estimadas</p>
            </div>

            {/* Day Selector */}
            <TabSelector
                tabs={['Hoy', 'Mañana', 'Jue', 'Vie']}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            {/* Important Section */}
            <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Lo importante hoy</h2>
                <Card className="border-l-4 border-l-action">
                    <div className="space-y-1">
                        {importantTasks.map(task => (
                            <TaskRow
                                key={task.id}
                                title={task.title}
                                meta={task.duration || (task as any).time}
                                tag={task.tags[0]}
                                isDone={task.status === 'done'}
                                onToggle={() => { }}
                            />
                        ))}
                    </div>
                </Card>
            </section>

            {/* Advance Section */}
            <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Para avanzar</h2>
                <Card>
                    <div className="space-y-1">
                        {advanceTasks.map(task => (
                            <TaskRow
                                key={task.id}
                                title={task.title}
                                meta={task.duration}
                                tag={task.tags[0]}
                                isDone={task.status === 'done'}
                                onToggle={() => { }}
                            />
                        ))}
                    </div>
                </Card>
            </section>

            {/* Extra Section */}
            <section>
                <div className="mb-3">
                    <h2 className="text-lg font-semibold text-gray-900">Extra</h2>
                    <p className="text-sm text-gray-500">Solo si te queda energía</p>
                </div>
                <Card className="bg-gray-50 border border-gray-100 shadow-none">
                    {extraTasks.map(task => (
                        <TaskRow
                            key={task.id}
                            title={task.title}
                            meta={task.duration}
                            isDone={task.status === 'done'}
                            onToggle={() => { }}
                        />
                    ))}
                </Card>
            </section>

            {/* Accordion / Next Days (Simple version) */}
            <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between py-3 text-gray-600">
                    <span>Mañana · 4 tareas</span>
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
                <div className="flex justify-between py-3 text-gray-600 border-t border-gray-100">
                    <span>Jueves · 3 tareas (1 crítica)</span>
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
            </div>
        </div>
    );
};
