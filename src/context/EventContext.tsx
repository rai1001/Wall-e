
import { createContext, useContext, useState, type ReactNode } from 'react';

export interface CreateEventInput {
    id?: string;
    title: string;
    category: 'work' | 'home' | 'personal';
    description: string;
    location: string;
    start_time: string;
    end_time: string;
    is_all_day: boolean;
}

interface EventContextType {
    isPanelOpen: boolean;
    initialData: Partial<CreateEventInput> & { id?: string } | null;
    openCreateEvent: (data?: Partial<CreateEventInput> & { id?: string }) => void;
    closePanel: () => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

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

export function useEventContext() {
    const context = useContext(EventContext);
    if (context === undefined) {
        throw new Error('useEventContext must be used within an EventProvider');
    }
    return context;
}
