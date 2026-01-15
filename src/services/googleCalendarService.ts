import { supabase } from '../lib/supabase';
import type { CalendarEvent } from '../components/calendar/EventChip';

const GOOGLE_CALENDAR_API_BASE = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';

export const googleCalendarService = {
    /**
     * Fetch events from the user's primary Google Calendar.
     * Uses the provider_token from the current Supabase session.
     */
    async listEvents(start: Date, end: Date): Promise<CalendarEvent[]> {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session || !session.provider_token) {
            console.warn('No Google provider token found in session.');
            return [];
        }

        const params = new URLSearchParams({
            timeMin: start.toISOString(),
            timeMax: end.toISOString(),
            singleEvents: 'true',
            orderBy: 'startTime',
        });

        try {
            const response = await fetch(`${GOOGLE_CALENDAR_API_BASE}?${params.toString()}`, {
                headers: {
                    'Authorization': `Bearer ${session.provider_token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    // Token expired or invalid - in a real app we'd try to refresh uses session.provider_refresh_token
                    // but Supabase JS client handles session refresh automatically *for Supabase calls*,
                    // extracting the provider token might need manual handling if it expires.
                    // For now, let's treat it as an error.
                    console.error('Google API Unauthorized');
                }
                throw new Error(`Google Calendar API Error: ${response.statusText}`);
            }

            const data = await response.json();
            return (data.items || []).map(mapGoogleEventToUi);

        } catch (error) {
            console.error('Failed to fetch Google Calendar events', error);
            // Return empty array to not break the UI
            return [];
        }
    }
};

function mapGoogleEventToUi(gEvent: any): CalendarEvent {
    // Google Events have 'dateTime' or 'date' (all-day)
    const startTimeStr = gEvent.start.dateTime || gEvent.start.date;
    const endTimeStr = gEvent.end.dateTime || gEvent.end.date;

    const start = new Date(startTimeStr);
    const end = new Date(endTimeStr);
    const duration = (end.getTime() - start.getTime()) / (1000 * 60);

    const isAllDay = !!gEvent.start.date;

    return {
        id: gEvent.id,
        title: gEvent.summary || '(No Title)',
        time: start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        duration: isAllDay ? 24 * 60 : duration, // Visual hack for all-day in our basic grid
        type: 'work', // Default to work for google events? Or add 'google' type? 
        // We will use 'work' for now, but EventChip needs to know it's google to style it.
        // Let's rely on extending the type in EventChip.ts next.
        description: gEvent.description,
        location: gEvent.location,
        source: 'google', // We will add this property to CalendarEvent interface
        start_time: start.toISOString()
    } as CalendarEvent;
}
