export type UserId = string;

export interface Task {
    id: string;
    user_id: UserId;
    title: string;
    duration?: string; // Pre-calculated for UI speed e.g. "30 min"
    status: 'done' | 'pending';
    tags: string[];
    section: 'focus' | 'work_important' | 'work_advance' | 'work_extra';
    is_focus_card?: boolean; // For "Ahora toca"
}

export interface AppEvent {
    id: string;
    user_id: UserId;
    title: string;
    time: string; // "10:00"
}

export interface PugStatus {
    id: string;
    user_id: UserId;
    last_walk: string; // "hace 4h"
    food: 'done' | 'pending';
    water: 'ok' | 'low';
}

export interface RoutineItem {
    id: string;
    title: string;
    is_done: boolean;
    user_id: UserId;
}
