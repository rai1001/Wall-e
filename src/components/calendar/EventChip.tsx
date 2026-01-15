import { Clock } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility for merging classes (should be in utils but inline for now to fix immediately)
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface CalendarEvent {
    id: string;
    title: string;
    time: string; // e.g., "10:00"
    duration: number; // minutes
    type: 'work' | 'home' | 'personal';
    description?: string;
    isStuck?: boolean;
    source?: 'internal' | 'google';
    location?: string;
    start_time: string; // ISO String for internal logic
}

interface EventChipProps {
    event: CalendarEvent;
    onClick?: (event: CalendarEvent) => void;
    viewMode?: 'week' | 'month';
}

export function EventChip({ event, onClick, viewMode = 'week' }: EventChipProps) {
    // Base styles
    const baseStyles = "rounded-lg text-xs font-medium cursor-pointer transition-all hover:scale-[1.02] shadow-sm flex flex-col overflow-hidden";

    // Type-specific styles with Design System colors
    const typeStyles = {
        work: "bg-cream border-main/10 text-main hover:border-main/20 border-l-4",
        personal: "bg-terracotta/10 border-terracotta/20 text-terracotta hover:bg-terracotta/15 border-l-4",
        home: "bg-sage/10 border-sage/20 text-sage-dark hover:bg-sage/15 border-l-4",
        // Google specific style - distinct
        google: "bg-[#E8F0FE] border-[#1a73e8]/50 text-[#1a73e8] border-l-4 hover:brightness-95"
    };

    const isGoogle = event.source === 'google';
    const className = cn(
        baseStyles,
        isGoogle ? typeStyles.google : typeStyles[event.type as keyof typeof typeStyles] || typeStyles.work
    );

    // In Month view, we might want a compacted version
    if (viewMode === 'month') {
        return (
            <div
                onClick={() => onClick?.(event)}
                className={`${className} px-2 py-1 mb-1 truncate`}
            >
                <span className="font-bold mr-1">{event.time}</span>
                {event.title}
            </div>
        );
    }

    // Week view setup
    return (
        <div
            onClick={() => onClick?.(event)}
            className={`${className} p-2 h-full absolute w-full`}
        >
            <div className="flex items-center gap-1 mb-0.5 opacity-80">
                <Clock size={10} />
                <span>{event.time}</span>
            </div>
            <div className="font-bold leading-tight line-clamp-2">
                {event.title}
            </div>
        </div>
    );
}
