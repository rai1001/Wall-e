
import { useState, type ReactNode } from 'react';
import { EventContext } from './eventContextStore';
import type { CreateEventInput } from '../types/events';

export function EventProvider({ children }: { children: ReactNode }) {
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [initialData, setInitialData] = useState<Partial<CreateEventInput> & { id?: string } | null>(null);

    const openCreateEvent = (data?: Partial<CreateEventInput> & { id?: string }) => {
        setInitialData(data || null);
        setIsPanelOpen(true);
    };

    const closePanel = () => {
        setIsPanelOpen(false);
        setInitialData(null);
    };

    return (
        <EventContext.Provider value={{ isPanelOpen, initialData, openCreateEvent, closePanel }}>
            {children}
        </EventContext.Provider>
    );
}
