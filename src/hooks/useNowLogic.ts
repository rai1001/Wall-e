import { useMemo } from 'react';
import type { CalendarEvent } from '../components/calendar/EventChip';
import { differenceInMinutes, formatDistance } from 'date-fns';

export interface NowState {
    currentEvent: CalendarEvent | null;
    nextEvent: CalendarEvent | null;
    status: 'focus' | 'gap' | 'free';
    timeUntilNext: string | null;
    progress: number; // 0-100 for current event progress
}

export function useNowLogic(events: CalendarEvent[], currentTime: Date = new Date()) {
    return useMemo((): NowState => {
        const now = currentTime;
        const nowTime = now.getTime();

        console.log(`[useNowLogic] Recalculating. Events: ${events.length}, Now: ${now.toLocaleTimeString()}`);

        // 1. Sort events by start time just in case
        const sortedEvents = [...events].sort((a, b) =>
            new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
        );

        // 2. Find Current Event
        const validCurrentEvent = sortedEvents.find(event => {
            const start = new Date(event.start_time).getTime();
            // Calculate end time based on duration (since end_time might be messy in some imports, trusting duration is often safer for 'now' logic, but let's use a fail-safe)
            // Actually, let's trust the start_time + duration for consistency with the rest of the app
            const end = start + (event.duration * 60 * 1000);
            return nowTime >= start && nowTime < end;
        });

        // 3. Find Next Event
        // It's the first event that starts AFTER now
        const nextEvent = sortedEvents.find(event => {
            return new Date(event.start_time).getTime() > nowTime;
        }) || null;

        // 4. Calculate Logic
        if (validCurrentEvent) {
            const start = new Date(validCurrentEvent.start_time).getTime();
            const end = start + (validCurrentEvent.duration * 60 * 1000);
            const durationMs = end - start;
            const elapsed = nowTime - start;
            const progress = Math.min(100, Math.max(0, (elapsed / durationMs) * 100));

            console.log(`[useNowLogic] Status: FOCUS. Event: ${validCurrentEvent.title}`);
            return {
                currentEvent: validCurrentEvent,
                nextEvent,
                status: 'focus',
                timeUntilNext: null, // We are busy
                progress
            };
        }

        // 5. Gap Logic
        if (nextEvent) {
            const minutesUntil = differenceInMinutes(new Date(nextEvent.start_time), now);
            const timeString = formatDistance(new Date(nextEvent.start_time), now, { addSuffix: true });

            console.log(`[useNowLogic] Status: GAP. Next: ${nextEvent.title} in ${minutesUntil} mins (${timeString})`);
            return {
                currentEvent: null,
                nextEvent,
                status: 'gap',
                timeUntilNext: timeString, // "in 15 minutes"
                progress: 0
            };
        }

        // 6. Completely Free
        return {
            currentEvent: null,
            nextEvent: null,
            status: 'free',
            timeUntilNext: null,
            progress: 0
        };

    }, [events, currentTime]);
}
