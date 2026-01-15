import { eventService } from './eventService';
import type { EventCategory } from '../types/events';

export interface ParsedIcsEvent {
    title?: string;
    description?: string;
    location?: string;
    start: Date;
    end: Date;
    isAllDay: boolean;
    category: EventCategory;
}

interface RawIcsEvent {
    title?: string;
    description?: string;
    location?: string;
    start?: Date;
    end?: Date;
    isAllDay?: boolean;
    durationMs?: number;
    categories?: string[];
}

export interface IcsImportResult {
    imported: number;
    skipped: number;
    errors: string[];
}

const CATEGORY_KEYWORDS: Record<EventCategory, string[]> = {
    work: ['work', 'business', 'meeting', 'office'],
    home: ['home', 'family', 'house'],
    personal: ['personal', 'life', 'private'],
};

function decodeIcsText(value: string) {
    return value
        .replace(/\\n/g, '\n')
        .replace(/\\,/g, ',')
        .replace(/\\;/g, ';')
        .replace(/\\\\/g, '\\');
}

function parseDuration(raw: string): number | null {
    if (!raw) return null;
    const match = raw.match(/^P(?:(\d+)D)?(?:T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/i);
    if (!match) return null;

    const days = Number(match[1] ?? 0);
    const hours = Number(match[2] ?? 0);
    const minutes = Number(match[3] ?? 0);
    const seconds = Number(match[4] ?? 0);

    return (
        ((days * 24 + hours) * 60 + minutes) * 60 * 1000 +
        seconds * 1000
    );
}

function parseDateValue(raw: string): { date: Date | null; isAllDay: boolean } {
    if (!raw) {
        return { date: null, isAllDay: false };
    }

    const fullMatch = raw.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z?)$/);
    if (fullMatch) {
        const [, year, month, day, hour, minute, second, zoneFlag] = fullMatch;
        const iso = `${year}-${month}-${day}T${hour}:${minute}:${second}${zoneFlag ? 'Z' : ''}`;
        return { date: new Date(iso), isAllDay: false };
    }

    const noSecondsMatch = raw.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(Z?)$/);
    if (noSecondsMatch) {
        const [, year, month, day, hour, minute, zoneFlag] = noSecondsMatch;
        const iso = `${year}-${month}-${day}T${hour}:${minute}:00${zoneFlag ? 'Z' : ''}`;
        return { date: new Date(iso), isAllDay: false };
    }

    const dateOnlyMatch = raw.match(/^(\d{4})(\d{2})(\d{2})$/);
    if (dateOnlyMatch) {
        const [, year, month, day] = dateOnlyMatch;
        const iso = `${year}-${month}-${day}T00:00:00`;
        return { date: new Date(iso), isAllDay: true };
    }

    return { date: new Date(raw), isAllDay: false };
}

function resolveCategory(categories?: string[]): EventCategory {
    if (!categories?.length) {
        return 'personal';
    }

    const normalized = categories
        .map((category) => category.trim().toLowerCase())
        .filter(Boolean);

    if (normalized.some((category) => CATEGORY_KEYWORDS.work.includes(category))) {
        return 'work';
    }

    if (normalized.some((category) => CATEGORY_KEYWORDS.home.includes(category))) {
        return 'home';
    }

    if (normalized.some((category) => CATEGORY_KEYWORDS.personal.includes(category))) {
        return 'personal';
    }

    return 'personal';
}

function finalizeEvent(event: RawIcsEvent): ParsedIcsEvent | null {
    if (!event.start) {
        return null;
    }

    let end = event.end;
    if (!end) {
        if (event.durationMs) {
            end = new Date(event.start.getTime() + event.durationMs);
        } else if (event.isAllDay) {
            end = new Date(event.start.getTime() + 24 * 60 * 60 * 1000);
        } else {
            end = new Date(event.start.getTime() + 60 * 60 * 1000);
        }
    }

    if (!end) {
        return null;
    }

    return {
        title: event.title,
        description: event.description,
        location: event.location,
        start: event.start,
        end,
        isAllDay: event.isAllDay ?? false,
        category: resolveCategory(event.categories),
    };
}

function normalizeLines(content: string) {
    const unfolded = content.replace(/\r?\n[ \t]/g, '');
    return unfolded.split(/\r?\n/);
}

function parseIcsEvents(content: string): ParsedIcsEvent[] {
    const events: ParsedIcsEvent[] = [];
    let current: RawIcsEvent | null = null;
    const lines = normalizeLines(content);

    for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line) {
            continue;
        }

        if (line === 'BEGIN:VEVENT') {
            current = {};
            continue;
        }

        if (line === 'END:VEVENT') {
            if (current) {
                const finalized = finalizeEvent(current);
                if (finalized) {
                    events.push(finalized);
                }
            }
            current = null;
            continue;
        }

        if (!current) {
            continue;
        }

        const separatorIndex = line.indexOf(':');
        if (separatorIndex === -1) {
            continue;
        }

        const rawKey = line.slice(0, separatorIndex);
        const value = line.slice(separatorIndex + 1);
        const baseKey = rawKey.split(';')[0].toUpperCase();

        switch (baseKey) {
            case 'SUMMARY':
                current.title = decodeIcsText(value);
                break;
            case 'DESCRIPTION':
                current.description = decodeIcsText(value);
                break;
            case 'LOCATION':
                current.location = decodeIcsText(value);
                break;
            case 'CATEGORIES':
                current.categories = [
                    ...(current.categories ?? []),
                    ...value.split(',').map((category) => category.trim()).filter(Boolean),
                ];
                break;
            case 'DTSTART': {
                const parsed = parseDateValue(value);
                if (parsed.date) {
                    current.start = parsed.date;
                    if (parsed.isAllDay) {
                        current.isAllDay = true;
                    }
                }
                break;
            }
            case 'DTEND': {
                const parsed = parseDateValue(value);
                if (parsed.date) {
                    current.end = parsed.date;
                }
                break;
            }
            case 'DURATION': {
                current.durationMs = parseDuration(value) ?? current.durationMs;
                break;
            }
            default:
                break;
        }
    }

    return events;
}

export async function importIcsFile(file: File): Promise<IcsImportResult> {
    const text = await file.text();
    const events = parseIcsEvents(text);

    const result: IcsImportResult = {
        imported: 0,
        skipped: 0,
        errors: [],
    };

    for (const event of events) {
        if (!event.start || !event.end) {
            result.skipped++;
            continue;
        }

        const payload = {
            title: (event.title && event.title.trim()) || 'Imported event',
            description: event.description || '',
            location: event.location || '',
            start_time: event.start.toISOString(),
            end_time: event.end.toISOString(),
            category: event.category,
            is_all_day: event.isAllDay,
        };

        try {
            await eventService.createEvent(payload);
            result.imported++;
        } catch (error) {
            const message =
                error instanceof Error ? error.message : 'Failed to import event';
            result.errors.push(message);
        }
    }

    return result;
}
