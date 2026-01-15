import { Circle, CheckCircle2, PlayCircle } from 'lucide-react';

interface TimelineItemProps {
    time: string;
    title: string;
    subtitle?: string;
    status: 'done' | 'active' | 'upcoming';
    icon?: string;
    category?: string;
    categoryColor?: string; // e.g., 'bg-purple-400'
}

export function TimelineItem({ time, title, subtitle, status, category, categoryColor }: TimelineItemProps) {
    if (status === 'active') {
        // Active item is usually the SmartCard, but if rendered as an item:
        return (
            <div className="grid grid-cols-[40px_1fr] gap-x-4 mb-6 relative">
                <div className="flex flex-col items-center pt-1 z-10">
                    <div className="size-10 rounded-full bg-terracotta text-white flex items-center justify-center ring-4 ring-cream shadow-lg shadow-terracotta/30 animate-pulse">
                        <PlayCircle size={20} fill="currentColor" />
                    </div>
                </div>
                {/* The content here is usually the SmartCard component, handled by the parent view */}
                <div className="relative">
                    {/* Placeholder if used directly, but usually wraps SmartCard */}
                </div>
            </div>
        );
    }

    if (status === 'done') {
        return (
            <div className="grid grid-cols-[40px_1fr] gap-x-4 mb-6 relative group">
                <div className="flex flex-col items-center pt-1 z-10">
                    <div className="size-10 rounded-full bg-sage flex items-center justify-center text-white ring-4 ring-cream transition-transform group-hover:scale-110">
                        <CheckCircle2 size={20} />
                    </div>
                </div>
                <div className="flex flex-col bg-white p-4 rounded-2xl border border-sage/20 opacity-60">
                    <div className="flex justify-between items-start mb-1">
                        <p className="text-sm font-bold text-sage">{time}</p>
                        <span className="text-xs font-bold bg-sage/10 text-sage px-2 py-0.5 rounded-md uppercase tracking-wider">Done</span>
                    </div>
                    <p className="text-lg font-bold text-main line-through decoration-main/30 font-serif">
                        {title}
                    </p>
                </div>
            </div>
        );
    }

    // Default: Upcoming
    return (
        <div className="grid grid-cols-[40px_1fr] gap-x-4 mb-6 relative group">
            <div className="flex flex-col items-center pt-1 z-10">
                <div className="size-10 rounded-full bg-white border-2 border-main/10 flex items-center justify-center text-main/30 ring-4 ring-cream group-hover:border-terracotta/50 group-hover:text-terracotta transition-colors">
                    <Circle size={18} />
                </div>
            </div>
            <div className="flex flex-col bg-white p-5 rounded-[2rem] border border-main/5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lg group">
                <div className="flex justify-between items-start mb-1">
                    <p className="text-sm font-bold text-main/40">{time}</p>
                </div>
                <p className="text-lg font-bold text-main font-serif group-hover:text-terracotta transition-colors">{title}</p>
                {(subtitle || category) && (
                    <div className="flex items-center gap-2 mt-2">
                        {categoryColor ? <span className={`size-2 rounded-full ${categoryColor}`}></span> : <span className="size-2 rounded-full bg-terracotta"></span>}
                        <span className="text-xs font-medium text-main/60">
                            {category || subtitle}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
