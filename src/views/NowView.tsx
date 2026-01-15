import { useEvents } from "../hooks/useEvents";
import { useFocusMode } from "../hooks/useFocusMode";
import { Timeline } from "../components/mobile/Timeline";
import { TimelineItem } from "../components/ui/TimelineItem";
import { SmartCard } from "../components/ui/SmartCard";
import { format } from "date-fns";
import { Lock } from "lucide-react";

export function NowView() {
    // Filter for Today and Sort
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const { events } = useEvents(startOfDay, endOfDay);
    const { isActive, startSession, currentTask } = useFocusMode();

    const todaysEvents = events
        .filter(event => {
            const eventDate = new Date(event.start_time);
            return eventDate >= startOfDay && eventDate <= endOfDay;
        })
        .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

    // Simple "Now" Logic (First future event or active task)
    const now = new Date();

    return (
        <div className="flex flex-col min-h-screen bg-cream pb-32">
            {/* Header: Home Mode / Focus Lock */}
            <header className="flex-none pt-12 pb-6 px-6 z-10 sticky top-0 bg-cream/90 backdrop-blur-md transition-all">
                <div className="flex flex-col items-center gap-4">
                    {/* Focus Lock Pill */}
                    <div className="bg-terracotta/5 text-terracotta px-4 py-1.5 rounded-full flex items-center gap-2 border border-terracotta/20 shadow-sm animate-pulse-slow">
                        <Lock size={14} strokeWidth={2.5} />
                        <span className="text-sm font-bold tracking-wide uppercase">Focus Lock Active</span>
                    </div>

                    {/* Date Display */}
                    <h2 className="text-4xl font-serif font-medium text-main text-center italic">
                        {format(new Date(), 'EEEE, MMM d')}
                    </h2>
                </div>
            </header>

            {/* Main Content: Timeline */}
            <div className="px-6 flex-1 flex flex-col gap-8">

                {/* Active / Next Task (Hero) */}
                <div className="w-full">
                    {/* Logic to pick the right card, for now showing the mock if empty or the real one */}
                    {todaysEvents.length > 0 ? (
                        todaysEvents.map(event => {
                            // Show only the active one or the very next one as the Hero
                            if (isActive && event.title === currentTask) {
                                return (
                                    <SmartCard
                                        key={event.id}
                                        time={`${format(new Date(event.start_time), 'h:mm a')} • Now`}
                                        title={event.title}
                                        subtitle={event.description || "In Progress"}
                                        onStart={() => { }}
                                        priority="High"
                                    />
                                );
                            }
                            return null;
                        })
                    ) : (
                        // Empty State Mock
                        <SmartCard
                            time="09:00 AM • Now"
                            title="Meal Prep: Lunch"
                            subtitle="Chicken Quinoa Bowl with fresh herbs"
                            onStart={() => startSession("Meal Prep: Lunch")}
                        />
                    )}
                </div>

                {/* Upcoming List */}
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-4">
                        <h3 className="text-xl font-serif text-main/60 italic">Tiny Steps</h3>
                        <div className="h-px bg-main/10 flex-1"></div>
                    </div>

                    <Timeline>
                        {todaysEvents.length === 0 && (
                            <>
                                <TimelineItem
                                    status="done"
                                    time="08:00 AM"
                                    title="Morning Walk"
                                />
                                <TimelineItem
                                    status="upcoming"
                                    time="12:00 PM"
                                    title="Deep Work Session"
                                    category="Productivity"
                                    categoryColor="bg-terracotta"
                                />
                                <TimelineItem
                                    status="upcoming"
                                    time="02:00 PM"
                                    title="Team Sync"
                                />
                            </>
                        )}

                        {todaysEvents.map(event => {
                            if (isActive && event.title === currentTask) return null; // Handled by Hero

                            const eventStart = new Date(event.start_time);
                            const isPast = eventStart < now;

                            return (
                                <TimelineItem
                                    key={event.id}
                                    status={isPast ? 'done' : 'upcoming'}
                                    time={format(eventStart, 'h:mm a')}
                                    title={event.title}
                                    subtitle={event.description}
                                />
                            );
                        })}
                    </Timeline>
                </div>
            </div>
        </div>
    );
}
