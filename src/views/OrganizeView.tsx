import { ContextColumn } from "../components/organize/ContextColumn";
import { TaskCard, type Task } from "../components/organize/TaskCard";
import { BrainDumpTray } from "../components/organize/BrainDumpTray";
import { Briefcase, Home } from "lucide-react";
// Removed KalElAvatar from headerIcon to match the clean 'reference' look which uses simple gray icons.
// Can put KalEl elsewhere if needed (maybe in the 'Edit' button or top right?)

// Mock Data
const workTasks: Task[] = [
    { id: '1', title: 'Review Q1 Goals', isDone: false, context: 'work', duration: '1h' },
    { id: '2', title: 'Client Meeting Prep', isDone: true, context: 'work', duration: '45m' },
    { id: '3', title: 'Email Catch-up', isDone: false, context: 'work', duration: '30m' },
];

const homeTasks: Task[] = [
    { id: '4', title: 'Buy Dog Food', isDone: false, context: 'home', duration: '20m' },
    { id: '5', title: 'Vet Appointment', isDone: false, context: 'home', duration: '15m' },
    { id: '6', title: 'Water Plants', isDone: false, context: 'home', duration: '10m' },
];

export function OrganizeView() {
    return (
        <div className="h-full flex flex-col relative bg-cream -m-4 md:-m-8 p-4 md:p-8 overflow-hidden">
            {/* Header Section */}
            <header className="flex justify-between items-start mb-6 px-2">
                <div className="flex flex-col">
                    <h2 className="text-3xl font-serif font-black italic text-main tracking-tight">Organize</h2>
                    <span className="text-xs font-bold text-main/40 uppercase tracking-widest mt-1">Plan your week</span>
                </div>
                {/* Weekly Balance Section */}
                <div className="flex flex-col gap-1 w-40 p-3 bg-white rounded-xl shadow-sm border border-main/5">
                    <div className="flex justify-between items-end">
                        <p className="text-xs font-bold text-main/60 uppercase">Balance</p>
                        <p className="text-terracotta text-sm font-black font-serif">85%</p>
                    </div>
                    <div className="relative h-2.5 w-full rounded-full bg-cream inner-shadow overflow-hidden">
                        <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-terracotta to-accent rounded-full" style={{ width: '65%' }}></div>
                    </div>
                </div>
            </header>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0 pb-20 md:pb-0">
                <ContextColumn
                    context="work"
                    title="Work"
                    headerIcon={<Briefcase className="text-terracotta" size={24} />}
                >
                    {workTasks.map(t => <TaskCard key={t.id} task={t} />)}
                </ContextColumn>

                <ContextColumn
                    context="home"
                    title="Home"
                    headerIcon={<Home className="text-sage" size={24} />}
                >
                    {homeTasks.map(t => <TaskCard key={t.id} task={t} />)}
                </ContextColumn>
            </div>

            <BrainDumpTray />
        </div>
    );
}
