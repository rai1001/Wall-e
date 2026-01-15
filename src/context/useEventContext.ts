import { useContext } from 'react';
import { EventContext } from './eventContextStore';

export function useEventContext() {
    const context = useContext(EventContext);
    if (context === undefined) {
        throw new Error('useEventContext must be used within an EventProvider');
    }
    return context;
}
