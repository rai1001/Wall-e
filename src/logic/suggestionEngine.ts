import type { Suggestion } from '../types/schema_house';
import { HOUSE_AREAS, ROTATION_STATE } from '../data/mockHouseData';
import { PUG_STATUS } from '../data/mockData';

interface EngineContext {
    workLoad: 'high' | 'medium' | 'low';
    minutesFree: number;
    timeOfDay: string; // "19:00"
}

export function getNowSuggestion(ctx: EngineContext): Suggestion {
    // 1. Critical Pugs Rule (Always top priority)
    if (PUG_STATUS.water === 'low') {
        return { type: 'pet', title: 'Rellenar agua pugs', minutes: 2, reason: 'Pug Critical', action_label: 'Voy' };
    }
    if (PUG_STATUS.food === 'pending' && ctx.timeOfDay > "09:00") {
        return { type: 'pet', title: 'Dar comida pugs', minutes: 5, reason: 'Pug Schedule', action_label: 'Dar comida' };
    }

    // 2. High Load Rule (Only Micro tasks)
    if (ctx.workLoad === 'high') {
        return {
            type: 'micro', title: 'Orden rápido (Salud mental)', minutes: 5,
            reason: 'Día intenso detectado', action_label: 'Hacer 5 min'
        };
    }

    // 3. Gap Analysis for Deep Clean
    if (ctx.minutesFree >= 45) {
        const nextArea = HOUSE_AREAS.find(a => a.id === ROTATION_STATE.next_area_id);
        if (nextArea) {
            return {
                type: 'deep',
                title: `Limpieza profunda: ${nextArea.name}`,
                minutes: nextArea.deep_clean_minutes,
                reason: `Tienes ${ctx.minutesFree}m libres`,
                action_label: 'Vamos'
            };
        }
    }

    // 4. Default / Fallback
    return { type: 'micro', title: 'Repaso rápido cocina', minutes: 10, reason: 'Mantenimiento suave', action_label: 'Ok' };
}
