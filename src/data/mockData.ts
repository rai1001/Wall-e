import type { Task, AppEvent, PugStatus, RoutineItem } from '../types/schema';

const USER_ID = 'me';

export const EVENTS: AppEvent[] = [
    { id: '1', user_id: USER_ID, time: '10:00', title: 'Reunión equipo' },
    { id: '2', user_id: USER_ID, time: '11:30', title: 'Hueco libre' },
    { id: '3', user_id: USER_ID, time: '12:00', title: 'Reunión cliente' },
    { id: '4', user_id: USER_ID, time: '18:30', title: 'Gym' },
];

export const TASKS: Task[] = [
    // Focus Card
    {
        id: 'f1', user_id: USER_ID, title: 'Paseo corto con los pugs', duration: '10 min',
        status: 'pending', tags: [], section: 'focus', is_focus_card: true
    },
    // Work Section 1: Important
    {
        id: 'w1', user_id: USER_ID, title: 'Reunión con cliente',
        status: 'pending', tags: ['Proyecto X'], section: 'work_important'
    } as any, // time optional in interface but used here? Simplified for MVP
    {
        id: 'w2', user_id: USER_ID, title: 'Terminar propuesta', duration: '45 min',
        status: 'pending', tags: ['Chefos'], section: 'work_important'
    },
    // Work Section 2: Advance
    {
        id: 'w3', user_id: USER_ID, title: 'Responder emails', duration: '15 min',
        status: 'pending', tags: ['Rápida'], section: 'work_advance'
    },
    {
        id: 'w4', user_id: USER_ID, title: 'Análisis de datos', duration: '1h',
        status: 'pending', tags: ['Deep work'], section: 'work_advance'
    },
    // Extra
    {
        id: 'w5', user_id: USER_ID, title: 'Organizar archivos', duration: '10 min',
        status: 'pending', tags: [], section: 'work_extra'
    }
];

export const TASK_DATA = TASKS;
export const EVENT_DATA = EVENTS;

export const PUG_STATUS: PugStatus = {
    id: 'p1', user_id: USER_ID,
    last_walk: 'hace 4h',
    food: 'done',
    water: 'ok'
};

export const MORNING_ROUTINE: RoutineItem[] = [
    { id: 'r1', user_id: USER_ID, title: 'Dar de comer', is_done: true },
    { id: 'r2', user_id: USER_ID, title: 'Paseo corto', is_done: true },
    { id: 'r3', user_id: USER_ID, title: 'Orden rápido', is_done: true },
];

export const HOUSE_ROUTINE: RoutineItem[] = [
    { id: 'h1', user_id: USER_ID, title: 'Orden rápido (10 min)', is_done: false },
    { id: 'h2', user_id: USER_ID, title: 'Sacar basura', is_done: false },
    { id: 'h3', user_id: USER_ID, title: 'Lavadora', is_done: false },
];
