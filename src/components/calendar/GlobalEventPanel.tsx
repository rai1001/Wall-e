
import { useEventContext } from "../../context/EventContext";
import { EventPanel } from "./EventPanel";
import { eventService } from "../../services/eventService";

export function GlobalEventPanel() {
    const { isPanelOpen, closePanel, initialData } = useEventContext();

    const handleSave = async (eventData: any) => {
        try {
            await eventService.createEvent(eventData);
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
