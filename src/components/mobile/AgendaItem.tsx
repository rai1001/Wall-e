import { Check, Soup, Laptop, Book, Play } from "lucide-react";

interface AgendaItemProps {
    status: 'done' | 'active' | 'upcoming';
    time: string;
    title: string;
    subtitle?: string;
    category?: string; // e.g. 'Productivity', 'Wellness'
    categoryColor?: string; // hex or tailwind class
    onStart?: () => void;
}

export function AgendaItem({ status, time, title, subtitle, category, categoryColor, onStart }: AgendaItemProps) {

    // Icon Logic (Mocking based on title/category for now, or could be passed as prop)
    const renderIcon = () => {
        if (status === 'done') return <Check size={20} strokeWidth={3} />;
        if (title.includes('Meal')) return <Soup size={20} />;
        if (title.includes('Work')) return <Laptop size={20} />;
        if (title.includes('Wind')) return <Book size={20} />;
        return <div className="size-2 rounded-full bg-current" />;
    };

    if (status === 'done') {
        return (
            <div className="grid grid-cols-[40px_1fr] gap-x-4 relative group">
                {/* Node */}
                <div className="flex flex-col items-center pt-1 z-10">
                    <div className="size-10 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center text-stone-400 dark:text-stone-500 ring-4 ring-cream dark:ring-background-dark">
                        {renderIcon()}
                    </div>
                </div>
                {/* Card */}
                <div className="flex flex-col bg-white/60 dark:bg-white/5 p-4 rounded-2xl border border-stone-100 dark:border-white/5 opacity-60">
                    <div className="flex justify-between items-start mb-1">
                        <p className="text-sm font-bold text-stone-400">{time}</p>
                        <span className="text-xs font-semibold bg-stone-100 dark:bg-stone-800 text-stone-500 px-2 py-0.5 rounded-md">Done</span>
                    </div>
                    <p className="text-lg font-bold text-stone-400 line-through decoration-stone-300">{title}</p>
                </div>
            </div>
        );
    }

    if (status === 'active') {
        return (
            <div className="grid grid-cols-[40px_1fr] gap-x-4 relative">
                {/* Node */}
                <div className="flex flex-col items-center pt-1 z-10">
                    <div className="size-10 rounded-full bg-primary text-white flex items-center justify-center ring-4 ring-cream dark:ring-background-dark shadow-lg shadow-primary/30 animate-pulse">
                        {renderIcon()}
                    </div>
                </div>
                {/* Card */}
                <div className="flex flex-col bg-primary/10 dark:bg-primary/20 p-5 rounded-2xl border border-primary/30 shadow-sm relative overflow-hidden">
                    {/* Glow Effect */}
                    <div className="absolute -right-6 -top-6 size-24 bg-primary/20 rounded-full blur-2xl"></div>

                    <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-bold text-terracotta dark:text-primary">{time} • Now</p>
                        <span className="bg-white dark:bg-black/20 text-xs font-bold px-2 py-1 rounded-lg text-terracotta dark:text-primary">High Priority</span>
                    </div>
                    <h4 className="text-xl font-extrabold text-main dark:text-white leading-tight mb-1">{title}</h4>
                    {subtitle && <p className="text-sm text-main/70 dark:text-white/70 font-medium">{subtitle}</p>}

                    <div className="mt-4 flex gap-2">
                        <button
                            onClick={onStart}
                            className="bg-primary text-white text-sm font-bold py-3 px-5 rounded-xl flex items-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-transform"
                        >
                            <Play size={18} fill="currentColor" /> Start
                        </button>
                        <button className="bg-white dark:bg-stone-800 text-main dark:text-white text-sm font-bold py-3 px-4 rounded-xl border border-transparent dark:border-white/10 flex items-center gap-2">
                            Details
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Upcoming
    return (
        <div className="grid grid-cols-[40px_1fr] gap-x-4 relative">
            {/* Node */}
            <div className="flex flex-col items-center pt-1 z-10">
                <div className="size-10 rounded-full bg-white dark:bg-stone-800 border-2 border-stone-200 dark:border-white/10 flex items-center justify-center text-main dark:text-white ring-4 ring-cream dark:ring-background-dark">
                    {renderIcon()}
                </div>
            </div>
            {/* Card */}
            <div className="flex flex-col bg-white dark:bg-stone-800 p-4 rounded-2xl border border-stone-100 dark:border-white/5 shadow-sm">
                <div className="flex justify-between items-start mb-1">
                    <p className="text-sm font-bold text-stone-500">{time}</p>
                </div>
                <p className="text-lg font-bold text-main dark:text-white">{title}</p>

                {category && (
                    <div className="flex items-center gap-2 mt-2">
                        <span className={`size-2 rounded-full ${categoryColor || 'bg-stone-400'}`}></span>
                        <span className="text-xs font-medium text-main/60 dark:text-white/60">{category}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
