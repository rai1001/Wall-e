import { useState } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";
import { CalendarSidebar } from "../components/calendar/CalendarSidebar";
import { WeekView } from "../components/calendar/WeekView";
import { MonthView } from "../components/calendar/MonthView";
import { ChevronLeft, ChevronRight, LayoutGrid, List, Plus } from "lucide-react";
import { useEvents } from "../hooks/useEvents";
import { useEventContext } from "../context/useEventContext";
import { EventPanel } from "../components/calendar/EventPanel";
import type { CreateEventInput } from "../services/eventService";
import { Button } from "../components/ui/Button";

export function CalendarView() {
    const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
    const [currentDate, setCurrentDate] = useState(new Date());

    const { isPanelOpen, closePanel, openCreateEvent, initialData } = useEventContext();

    // Determine date range for fetching
    const viewStart = viewMode === 'month' ? startOfMonth(currentDate) : startOfWeek(currentDate, { weekStartsOn: 1 });
    const viewEnd = viewMode === 'month' ? endOfMonth(currentDate) : endOfWeek(currentDate, { weekStartsOn: 1 });

    const { events, loading, addEvent, updateEvent, deleteEvent } = useEvents(viewStart, viewEnd);

    const handlePrev = () => {
        setCurrentDate(prev => viewMode === 'month' ? subMonths(prev, 1) : new Date(prev.setDate(prev.getDate() - 7)));
    };

    const handleNext = () => {
        setCurrentDate(prev => viewMode === 'month' ? addMonths(prev, 1) : new Date(prev.setDate(prev.getDate() + 7)));
    };

    const handleSaveEvent = async (data: CreateEventInput & { id?: string }) => {
        if (data.id) {
            const { id, ...rest } = data;
            await updateEvent(id, rest);
        } else {
            await addEvent(data);
        }
    };

    return (
        <div className="flex h-screen bg-cream overflow-hidden">
            {/* Sidebar */}
            <CalendarSidebar onCreateEvent={() => openCreateEvent()} />

            {/* Main Calendar Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 px-8 py-6 border-b border-main/5">
                    <div className="flex items-center gap-4">
                        <h1 className="text-3xl font-serif font-bold text-main">
                            {format(currentDate, 'MMMM yyyy')}
                        </h1>
                        <div className="flex items-center gap-1 bg-white rounded-xl border border-main/10 p-1 shadow-sm">
                            <button onClick={handlePrev} className="p-1.5 hover:bg-main/5 rounded-lg text-main/60 transition-colors">
                                <ChevronLeft size={18} />
                            </button>
                            <button onClick={handleNext} className="p-1.5 hover:bg-main/5 rounded-lg text-main/60 transition-colors">
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-white rounded-xl border border-main/10 p-1 shadow-sm">
                            <button
                                onClick={() => setViewMode('week')}
                                className={`p-2 rounded-lg transition-all flex items-center gap-2 ${viewMode === 'week' ? 'bg-main/5 text-main shadow-sm' : 'text-main/40 hover:text-main'}`}
                            >
                                <List size={18} />
                                <span className="text-sm font-medium">Week</span>
                            </button>
                            <button
                                onClick={() => setViewMode('month')}
                                className={`p-2 rounded-lg transition-all flex items-center gap-2 ${viewMode === 'month' ? 'bg-main/5 text-main shadow-sm' : 'text-main/40 hover:text-main'}`}
                            >
                                <LayoutGrid size={18} />
                                <span className="text-sm font-medium">Month</span>
                            </button>
                        </div>

                        <Button
                            size="sm"
                            className="lg:hidden"
                            onClick={() => openCreateEvent()}
                            aria-label="Create event"
                            title="Create event"
                        >
                            <Plus size={16} />
                            New
                        </Button>
                    </div>
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center h-full text-main/40 animate-pulse">Loading schedule...</div>
                    ) : (
                        viewMode === 'week' ? (
                            <WeekView
                                currentDate={currentDate}
                                events={events}
                                onEventClick={(event) => openCreateEvent({ ...event, category: event.type })}
                            />
                        ) : (
                            <MonthView
                                currentDate={currentDate}
                                events={events}
                                onEventClick={(event) => openCreateEvent({ ...event, category: event.type })}
                            />
                        )
                    )}
                </div>
            </div>

            {/* Event Panel (Global) */}
            <EventPanel
                isOpen={isPanelOpen}
                onClose={closePanel}
                onSave={handleSaveEvent}
                onDelete={deleteEvent}
                initialData={initialData}
            />
        </div>
    );
}
