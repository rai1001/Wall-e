import { useMemo } from "react";
import { format, addDays, startOfWeek } from "date-fns";
import { EventChip } from "./EventChip";
import type { CalendarEvent } from "./EventChip";

const HOURS = Array.from({ length: 14 }, (_, i) => i + 7); // 7am to 8pm

interface WeekViewProps {
    currentDate: Date;
    events: CalendarEvent[];
    loading?: boolean; // Make loading optional to match usage if needed, or keep required
    onEventClick: (event: CalendarEvent) => void;
}

export function WeekView({ currentDate, events, loading = false, onEventClick }: WeekViewProps) {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

    // Process events to determine placement
    const processedEvents = useMemo(() => {
        return events.map(event => {
            const eventDate = new Date(event.start_time);
            // Calculate day index (0-6, Mon-Sun)
            // getDay() returns 0 for Sunday. We want 0 for Monday.
            let dayIndex = eventDate.getDay() - 1;
            if (dayIndex === -1) dayIndex = 6;

            const startHour = parseInt(event.time.split(':')[0]) || 9;
            // Simple parsing for now, ideally parse ISO string properly
            // If event.time is HH:MM

            // If we use ISO start_time:
            const hour = eventDate.getHours();
            const minutes = eventDate.getMinutes();

            return {
                ...event,
                day: dayIndex,
                startHour: hour + (minutes / 60)
            };
        });
    }, [events]);

    if (loading) return <div className="flex h-full items-center justify-center text-main/40 font-body">Loading schedule...</div>;

    return (
        <div className="flex flex-1 overflow-y-auto bg-white rounded-3xl shadow-soft border border-main/5 relative">
            {/* Time Labels */}
            <div className="w-16 flex-shrink-0 border-r border-main/5 bg-cream/50">
                <div className="h-12 border-b border-main/5"></div> {/* Header spacer */}
                {HOURS.map(hour => (
                    <div key={hour} className="h-20 text-xs text-main/40 font-medium text-right pr-3 relative -top-2 font-body">
                        {hour}:00
                    </div>
                ))}
            </div>

            {/* Grid */}
            <div className="flex-1 flex flex-col min-w-[800px]">
                {/* Header Days */}
                <div className="flex border-b border-main/5 h-12 bg-cream/30">
                    {weekDays.map((date, i) => {
                        const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                        return (
                            <div key={i} className={`flex-1 flex items-center justify-center text-sm font-bold border-r border-main/5 last:border-r-0 ${isToday ? 'text-terracotta bg-terracotta/5' : 'text-main/60'}`}>
                                {format(date, 'EEE')}
                                {isToday && <span className="ml-1.5 w-1.5 h-1.5 bg-terracotta rounded-full"></span>}
                            </div>
                        );
                    })}
                </div>

                {/* Calendar Body */}
                <div className="flex-1 relative bg-white">
                    {/* Horizontal Lines */}
                    {HOURS.map(hour => (
                        <div key={hour} className="absolute w-full border-b border-main/5 h-20" style={{ top: `${(hour - 7) * 80}px` }}></div>
                    ))}

                    {/* Vertical Lines */}
                    {weekDays.map((_, i) => (
                        <div key={i} className="absolute h-full border-r border-main/5" style={{ left: `${(i + 1) * (100 / 7)}%` }}></div>
                    ))}

                    {/* Events Layer */}
                    {processedEvents.map(event => (
                        <div
                            key={event.id}
                            onClick={(e) => {
                                e.stopPropagation();
                                onEventClick(event);
                            }}
                            className="absolute z-10 p-1 transition-transform hover:scale-[1.02] hover:z-20 cursor-pointer"
                            style={{
                                top: `${(event.startHour - 7) * 80}px`,
                                left: `${event.day * (100 / 7)}%`,
                                width: `${100 / 7}%`,
                                height: `${(event.duration / 60) * 80}px`
                            }}
                        >
                            <EventChip event={event} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
