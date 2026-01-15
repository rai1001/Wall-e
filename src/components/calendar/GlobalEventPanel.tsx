
import { useEventContext } from "../../context/useEventContext";
import { EventPanel } from "./EventPanel";
import { eventService } from "../../services/eventService";
import type { CreateEventInput } from "../../services/eventService";

export function GlobalEventPanel() {
    const { isPanelOpen, closePanel, initialData } = useEventContext();

    const handleSave = async (eventData: CreateEventInput & { id?: string }) => {
        try {
            const { id, ...payload } = eventData;
            void id;
            await eventService.createEvent(payload);
            // We might want to trigger a global refresh or toast here
            // For now, rely on manual refresh or simplistic flow
            console.log('Event created globally');
        } catch (error) {
            console.error('Global save error', error);
            throw error; // Let panel handle alert
        }
    };

    return (
        <EventPanel
            isOpen={isPanelOpen}
            onClose={closePanel}
            onSave={handleSave}
            initialData={initialData}
        />
    );
}
