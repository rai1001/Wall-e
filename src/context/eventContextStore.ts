import { createContext } from 'react';
import type { CreateEventInput } from '../types/events';

export interface EventContextValue {
    isPanelOpen: boolean;
    initialData: Partial<CreateEventInput> & { id?: string } | null;
    openCreateEvent: (data?: Partial<CreateEventInput> & { id?: string }) => void;
    closePanel: () => void;
}

export const EventContext = createContext<EventContextValue | undefined>(undefined);
