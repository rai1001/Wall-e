import { useState, useEffect } from "react";
import { useEvents } from "../hooks/useEvents";
import { useFocusMode } from "../hooks/useFocusMode";
import { Timeline } from "../components/mobile/Timeline";
import { TimelineItem } from "../components/ui/TimelineItem";
import { SmartCard } from "../components/ui/SmartCard";
import { format } from "date-fns";
import { Lock } from "lucide-react";
import { useNowLogic } from "../hooks/useNowLogic";
import { MockControls } from "../components/debug/MockControls";
import { ActiveSession } from "../components/focus/ActiveSession";
import type { CalendarEvent } from "../components/calendar/EventChip";

export function NowView() {
    // Debug State
    const [debugTime, setDebugTime] = useState<Date | null>(null);
    const [mockEvents, setMockEvents] = useState<CalendarEvent[] | null>(null);

    // Active Time
    const [actualNow, setActualNow] = useState(() => new Date());

    // Update time every minute if not debugging
    useEffect(() => {
        if (debugTime) {
            return;
        }

        const timer = setInterval(() => {
            setActualNow(new Date());
        }, 60000);
        return () => clearInterval(timer);
    }, [debugTime]);

    const now = debugTime ?? actualNow;

    // Data Fetching
    const today = now;
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const { events: realEvents, loading } = useEvents(startOfDay, endOfDay);

    // Choose Source (Mock vs Real)
    const effectiveEvents = mockEvents || realEvents;

    // The Brain 🧠
    const { currentEvent, nextEvent, status, timeUntilNext } = useNowLogic(effectiveEvents, now);
    const { isActive, startSession, stopSession, currentTask } = useFocusMode();

    // Determine Hero Card Content
    const renderHero = () => {
        // 1. If Focus Mode is manually active, show that (User override)
        if (isActive) {
            return (
                <SmartCard
                    time="Now • Focus Mode"
                    title={currentTask || "Deep Work"}
                    subtitle="Focus Lock Active"
                    onStart={() => { }}
                    priority="High"
                // TODO: Add progress based on session if available
                />
            );
        }

        // 2. Logic: Current Event (Focus)
        if (status === 'focus' && currentEvent) {
            return (
                <SmartCard
                    key={currentEvent.id}
                    time={`${format(new Date(currentEvent.start_time), 'h:mm a')} • Now`}
                    title={currentEvent.title}
                    subtitle={currentEvent.description || "Happening now"}
                    onStart={() => startSession(currentEvent.title)}
                    priority={currentEvent.source === 'google' ? 'Medium' : 'High'}
                />
            );
        }

        // 3. Logic: Gap (Prepare)
        if (status === 'gap' && nextEvent) {
            return (
                <SmartCard
                    time={`${timeUntilNext} until next`}
                    title="Free Time"
                    subtitle={`Up next: ${nextEvent.title}`}
                    onStart={() => { }} // Maybe "Start Early"?
                />
            );
        }

        // 4. Logic: Free
        // 4. Logic: Free
        return (
            <SmartCard
                time="Unscheduled"
                title="All Caught Up"
                subtitle="No events scheduled for the rest of the day."
                onStart={() => { }}
            />
        );
    };

    // If session is active, show the overlay
    if (isActive) {
        return (
            <ActiveSession
                taskTitle={currentTask || "Focus Session"}
                taskSubtitle={currentEvent?.title === currentTask ? currentEvent?.description : "Stay in the flow."}
                onComplete={stopSession}
                onCancel={stopSession}
            />
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-cream pb-32 relative">
            {/* Header: Home Mode / Focus Lock */}
            <header className="flex-none pt-12 pb-6 px-6 z-10 sticky top-0 bg-cream/90 backdrop-blur-md transition-all">
                <div className="flex flex-col items-center gap-4">
                    {/* Focus Lock Pill */}
                    {isActive ? (
                        <div className="bg-terracotta/5 text-terracotta px-4 py-1.5 rounded-full flex items-center gap-2 border border-terracotta/20 shadow-sm animate-pulse-slow">
                            <Lock size={14} strokeWidth={2.5} />
                            <span className="text-sm font-bold tracking-wide uppercase">Focus Lock Active</span>
                        </div>
                    ) : (
                        <div className="bg-main/5 text-main/40 px-4 py-1.5 rounded-full flex items-center gap-2 border border-main/5">
                            <span className="text-sm font-bold tracking-wide uppercase">Auto-Pilot On</span>
                        </div>
                    )}

                    {/* Date Display */}
                    <h2 className="text-4xl font-serif font-medium text-main text-center italic">
                        {format(now, 'EEEE, MMM d')}
                    </h2>
                </div>
            </header>

            {/* Main Content: Timeline */}
            <div className="px-6 flex-1 flex flex-col gap-8">

                {/* Active / Next Task (Hero) */}
                <div className="w-full transition-all duration-500 ease-in-out">
                    {renderHero()}
                </div>

                {/* Upcoming List */}
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-4">
                        <h3 className="text-xl font-serif text-main/60 italic">Tiny Steps</h3>
                        <div className="h-px bg-main/10 flex-1"></div>
                    </div>

                    <Timeline>
                        {loading && !mockEvents && <div className="p-4 text-main/40 text-center text-sm">Loading schedule...</div>}

                        {effectiveEvents
                            .filter(e => {
                                // Filter out past events unless they are the current one (handled by hero, but maybe we want them in list too? No, usually not)
                                // Only show Future events that are NOT the current one
                                const eStart = new Date(e.start_time).getTime();
                                const nowMs = now.getTime();
                                return eStart > nowMs;
                            })
                            .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
                            .map(event => (
                                <TimelineItem
                                    key={event.id}
                                    status={'upcoming'}
                                    time={format(new Date(event.start_time), 'h:mm a')}
                                    title={event.title}
                                    subtitle={event.description}
                                    category={event.type === 'home' ? 'Personal' : 'Work'}
                                    categoryColor={event.type === 'home' ? 'bg-sage' : event.source === 'google' ? 'bg-[#4285F4]' : 'bg-terracotta'}
                                />
                            ))}

                        {effectiveEvents.length === 0 && !loading && (
                            <div className="p-4 text-main/40 text-center text-sm italic">
                                Enjoy your free time!
                            </div>
                        )}
                    </Timeline>
                </div>
            </div>

            {/* Debug Controls */}
            <MockControls
                currentTime={now}
                onTimeChange={setDebugTime}
                onInjectEvents={setMockEvents}
            />
        </div>
    );
}
