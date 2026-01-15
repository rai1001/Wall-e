import { supabase } from '../lib/supabase';
import type { CalendarEvent } from '../components/calendar/EventChip';

const GOOGLE_CALENDAR_BASE = 'https://www.googleapis.com/calendar/v3';

export type GoogleCalendarListItem = {
    id: string;
    summary?: string | null;
    primary?: boolean;
    accessRole?: string;
    description?: string;
    timeZone?: string;
};

type GoogleCalendarEvent = {
    id: string;
    summary?: string | null;
    description?: string | null;
    location?: string | null;
    start: { dateTime?: string | null; date?: string | null };
    end: { dateTime?: string | null; date?: string | null };
};

async function getProviderToken(overrides?: string) {
    if (overrides) return overrides;
    const { data: { session } } = await supabase.auth.getSession();
    return session?.provider_token;
}

async function fetchGoogle(
    token: string,
    path: string,
    params?: Record<string, string>
) {
    const url = new URL(`${GOOGLE_CALENDAR_BASE}${path}`);
    if (params) {
        Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
    }

    const response = await fetch(url.toString(), {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        if (response.status === 401) {
            console.error('Google API Unauthorized');
        }
        throw new Error(`Google Calendar API Error: ${response.statusText}`);
    }

    return response.json();
}

async function fetchCalendars(token: string): Promise<GoogleCalendarListItem[]> {
    const data = await fetchGoogle(token, '/users/me/calendarList');
    return Array.isArray(data?.items) ? data.items : [];
}

async function fetchEvents(
    token: string,
    calendarId: string,
    start: Date,
    end: Date
): Promise<GoogleCalendarEvent[]> {
    const params = {
        timeMin: start.toISOString(),
        timeMax: end.toISOString(),
        singleEvents: 'true',
        orderBy: 'startTime',
    };
    const data = await fetchGoogle(token, `/calendars/${encodeURIComponent(calendarId)}/events`, params);
    return Array.isArray(data?.items) ? data.items : [];
}

function mapGoogleEventToUi(gEvent: GoogleCalendarEvent): CalendarEvent {
    const startTimeStr = gEvent.start.dateTime ?? gEvent.start.date ?? new Date().toISOString();
    const endTimeStr = gEvent.end.dateTime ?? gEvent.end.date ?? new Date().toISOString();

    const start = new Date(startTimeStr);
    const end = new Date(endTimeStr);
    const duration = (end.getTime() - start.getTime()) / (1000 * 60);

    const isAllDay = !!gEvent.start.date;

    return {
        id: gEvent.id,
        title: gEvent.summary || '(No Title)',
        time: start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        duration: isAllDay ? 24 * 60 : duration,
        type: 'work',
        description: gEvent.description ?? undefined,
        location: gEvent.location ?? undefined,
        source: 'google',
        start_time: start.toISOString(),
    };
}

export const googleCalendarService = {
    async listEvents(start: Date, end: Date, calendarId: string = 'primary'): Promise<CalendarEvent[]> {
        const token = await getProviderToken();
        if (!token) {
            console.warn('No Google provider token found in session.');
            return [];
        }

        try {
            const items = await fetchEvents(token, calendarId, start, end);
            return items.map(mapGoogleEventToUi);
        } catch (error) {
            console.error('Failed to fetch Google Calendar events', error);
            return [];
        }
    },

    async listCalendars(providerToken?: string): Promise<GoogleCalendarListItem[]> {
        const token = await getProviderToken(providerToken);
        if (!token) {
            console.warn('No Google provider token available to read calendar list.');
            return [];
        }

        try {
            return await fetchCalendars(token);
        } catch (error) {
            console.error('Unable to load calendar list', error);
            return [];
        }
    },

    async listEventsForCalendar(
        providerToken: string,
        calendarId: string,
        start: Date,
        end: Date
    ): Promise<GoogleCalendarEvent[]> {
        try {
            return await fetchEvents(providerToken, calendarId, start, end);
        } catch (error) {
            console.error('Failed to fetch calendar events for import', error);
            return [];
        }
    },
};
