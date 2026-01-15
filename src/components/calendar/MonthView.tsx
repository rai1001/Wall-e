import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, isSameDay } from "date-fns";
import { EventChip, type CalendarEvent } from "./EventChip";

interface MonthViewProps {
    currentDate: Date;
    events: CalendarEvent[];
    loading?: boolean;
    onEventClick: (event: CalendarEvent) => void;
}

export function MonthView({ currentDate, events, loading = false, onEventClick }: MonthViewProps) {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({
        start: startDate,
        end: endDate
    });

    // Simple day names
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    if (loading) return <div className="h-full flex items-center justify-center text-main/40 font-body">Loading month...</div>;

    return (
        <div className="h-full flex flex-col bg-white rounded-3xl shadow-soft border border-main/5 overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-7 border-b border-main/5 bg-cream/50">
                {days.map(d => (
                    <div key={d} className="p-4 text-center text-xs font-bold text-main/40 uppercase tracking-wider font-body">
                        {d}
                    </div>
                ))}
            </div>

            {/* Grid */}
            <div className="flex-1 grid grid-cols-7 grid-rows-5 bg-white">
                {calendarDays.map((day, i) => {
                    const isCurrentMonth = isSameMonth(day, monthStart);
                    const isToday = isSameDay(day, new Date());

                    // Filter events for this day
                    const dayEvents = events.filter(e => isSameDay(new Date(e.start_time), day));

                    return (
                        <div
                            key={i}
                            className={`border-r border-b border-main/5 p-2 min-h-[100px] hover:bg-cream/20 transition-colors cursor-pointer group relative ${!isCurrentMonth ? 'bg-cream/10' : ''}`}
                        >
                            <span className={`text-sm font-semibold rounded-full w-8 h-8 flex items-center justify-center mb-1 transition-colors ${isToday ? 'bg-terracotta text-white shadow-sm' : 'text-main/60 group-hover:bg-main/5'}`}>
                                {format(day, 'd')}
                            </span>

                            {/* Events List */}
                            <div className="space-y-1">
                                {dayEvents.slice(0, 3).map((event) => (
                                    <div key={event.id} onClick={(e) => { e.stopPropagation(); onEventClick(event); }}>
                                        <EventChip event={event} viewMode="month" />
                                    </div>
                                ))}
                                {dayEvents.length > 3 && (
                                    <div className="text-xs text-main/40 pl-1">
                                        +{dayEvents.length - 3} more
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
