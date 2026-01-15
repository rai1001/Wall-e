import { useState, useEffect, useCallback } from 'react';
import { eventService, type CreateEventInput } from '../services/eventService';
import { googleCalendarService } from '../services/googleCalendarService';
import type { CalendarEvent } from '../components/calendar/EventChip';

export function useEvents(viewStart: Date, viewEnd: Date) {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error] = useState<Error | null>(null);

    const fetchEvents = useCallback(async () => {
        // Resilient fetch: Try both in parallel
        // We use Promise.allSettled so one failure doesn't block the other
        const [internalResult, googleResult] = await Promise.allSettled([
            eventService.listEvents(viewStart, viewEnd),
            googleCalendarService.listEvents(viewStart, viewEnd)
        ]);

        let internalEvents: CalendarEvent[] = [];
        let googleEvents: CalendarEvent[] = [];

        if (internalResult.status === 'fulfilled') {
            internalEvents = internalResult.value.map(e => ({ ...e, source: 'internal' }));
        } else {
            console.warn('Internal events fetch failed:', internalResult.reason);
        }

        if (googleResult.status === 'fulfilled') {
            googleEvents = googleResult.value; // Already has source: 'google' from service
        } else {
            console.warn('Google events fetch failed:', googleResult.reason);
        }

        setEvents([...internalEvents, ...googleEvents]);
        setLoading(false);
    }, [viewStart.toISOString(), viewEnd.toISOString()]);

    // Initial fetch
    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const addEvent = async (event: CreateEventInput) => {
        // TODO: Optimistic update
        const newEvent = await eventService.createEvent(event);
        setEvents(prev => [...prev, newEvent]);
        return newEvent;
    };

    const updateEvent = async (id: string, updates: Partial<CreateEventInput>) => {
        const updatedEvent = await eventService.updateEvent(id, updates);
        setEvents(prev => prev.map(e => e.id === id ? updatedEvent : e));
        return updatedEvent;
    };

    const deleteEvent = async (id: string) => {
        await eventService.deleteEvent(id);
        setEvents(prev => prev.filter(e => e.id !== id));
    };

    return { events, loading, error, refetch: fetchEvents, addEvent, updateEvent, deleteEvent };
}
