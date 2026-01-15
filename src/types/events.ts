export type EventCategory = 'work' | 'home' | 'personal';

export interface CreateEventInput {
    title: string;
    description: string;
    location: string;
    start_time: string;
    end_time: string;
    category: EventCategory;
    is_all_day: boolean;
}

export interface DbEvent extends CreateEventInput {
    id: string;
    user_id: string;
    created_at: string;
}
