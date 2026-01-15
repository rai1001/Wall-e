import type { HouseArea, DeepCleanRotation, RecurringTemplate } from '../types/schema_house';

const USER_ID = 'me';

export const HOUSE_AREAS: HouseArea[] = [
    { id: 'area_salon', user_id: USER_ID, name: 'Salón', sort_order: 1, deep_clean_minutes: 45 },
    { id: 'area_kitchen', user_id: USER_ID, name: 'Cocina', sort_order: 2, deep_clean_minutes: 40 },
    { id: 'area_bath', user_id: USER_ID, name: 'Baño', sort_order: 3, deep_clean_minutes: 35 },
    { id: 'area_bedroom', user_id: USER_ID, name: 'Dormitorio', sort_order: 4, deep_clean_minutes: 40 },
    { id: 'area_pugs', user_id: USER_ID, name: 'Zona pugs', sort_order: 5, deep_clean_minutes: 30 },
];

export const ROTATION_STATE: DeepCleanRotation = {
    user_id: USER_ID,
    next_area_id: 'area_kitchen', // Next up
    last_generated_week: '2026-01-12',
    frequency_per_week: 1,
};

export const RECURRING_TEMPLATES: RecurringTemplate[] = [
    {
        id: 'tpl_quick', user_id: USER_ID, title: 'Orden rápido', domain: 'home',
        default_minutes: 10, priority: 'medium', active_days: [1, 2, 3, 4, 5], preferred_windows: []
    },
    {
        id: 'tpl_trash', user_id: USER_ID, title: 'Sacar basura', domain: 'home',
        default_minutes: 5, priority: 'high', active_days: [1, 3, 5], preferred_windows: []
    },
];
