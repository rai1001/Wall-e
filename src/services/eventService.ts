import { supabase } from '../lib/supabase';
import type { CalendarEvent } from '../components/calendar/EventChip';

export interface DbEvent {
    id: string;
    user_id: string;
    title: string;
    description?: string;
    start_time: string;
    end_time: string;
    is_all_day: boolean;
    category: 'work' | 'home' | 'personal';
    location?: string;
    created_at: string;
}

export interface CreateEventInput {
    title: string;
    description: string;
    location: string;
    start_time: string;
    end_time: string;
    category: 'work' | 'home' | 'personal';
    is_all_day: boolean;
}

export const eventService = {
    async listEvents(start: Date, end: Date) {
        const { data, error } = await supabase
            .from('calendar_events')
            .select('*')
            .gte('start_time', start.toISOString())
            .lte('end_time', end.toISOString())
            .order('start_time', { ascending: true });

        if (error) throw error;

        // Map to UI model
        return (data || []).map(mapDbToUi);
    },

    async createEvent(event: Omit<DbEvent, 'id' | 'user_id' | 'created_at'>) {
        const { data, error } = await supabase
            .from('calendar_events')
            .insert([event])
            .select()
            .single();

        if (error) throw error;
        return mapDbToUi(data);
    },

    async updateEvent(id: string, updates: Partial<CreateEventInput>) {
        const { data, error } = await supabase
            .from('calendar_events')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return mapDbToUi(data);
    },

    async deleteEvent(id: string) {
        const { error } = await supabase
            .from('calendar_events')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    }
};

function mapDbToUi(dbEvent: DbEvent): CalendarEvent {
    // Simple duration calculation roughly
    const start = new Date(dbEvent.start_time);
    const end = new Date(dbEvent.end_time);
    const duration = (end.getTime() - start.getTime()) / (1000 * 60);

    return {
        id: dbEvent.id,
        title: dbEvent.title,
        time: start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        duration,
        type: dbEvent.category,
        description: dbEvent.description,
        start_time: dbEvent.start_time
    };
}
