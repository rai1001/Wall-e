import { WeekView } from "./WeekView";
import { MonthView } from "./MonthView";
import type { CalendarEvent } from "./EventChip";

interface CalendarGridProps {
    viewMode: 'week' | 'month';
    onViewChange: (mode: 'week' | 'month') => void;
    events: CalendarEvent[];
    loading: boolean;
    currentDate: Date; // Added prop
}

export function CalendarGrid({ viewMode, events, loading, currentDate }: CalendarGridProps) {
    return (
        <div className="flex-1 h-full min-h-0 flex flex-col">
            {viewMode === 'week'
                ? <WeekView events={events} loading={loading} currentDate={currentDate} onEventClick={() => { }} />
                : <MonthView events={events} loading={loading} currentDate={currentDate} onEventClick={() => { }} />
            }
        </div>
    );
}
