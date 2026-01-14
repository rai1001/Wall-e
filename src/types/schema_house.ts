import type { UserId } from './schema';

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0=Sunday

export interface HouseArea {
    id: string;
    user_id: UserId;
    name: string; // "Salón", "Cocina"
    sort_order: number;
    deep_clean_minutes: number; // e.g., 45
}

export interface RecurringTemplate {
    id: string;
    user_id: UserId;
    title: string;
    domain: 'home' | 'pet';
    default_minutes: number;
    priority: 'low' | 'medium' | 'high';
    // Simplified RRULE for MVP: just a list of active days
    active_days: DayOfWeek[];
    preferred_windows: { from: string; to: string }[]; // e.g. "18:00"
}

export interface DeepCleanRotation {
    user_id: UserId;
    next_area_id: string; // FK to HouseArea
    last_generated_week: string; // ISO Date of Monday
    frequency_per_week: 1 | 2;
}

export interface Suggestion {
    type: 'micro' | 'deep' | 'pet' | 'work';
    title: string;
    minutes: number;
    reason: string; // Debug info: "Gap > 45m"
    action_label: string;
}
