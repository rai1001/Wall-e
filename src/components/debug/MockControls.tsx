import { useState, useEffect } from "react";
// import { Button } from "../ui/Button"; 
import type { CalendarEvent } from "../calendar/EventChip";
import { Settings, Clock } from "lucide-react";

interface MockControlsProps {
    currentTime: Date;
    onTimeChange: (date: Date | null) => void;
    onInjectEvents: (events: CalendarEvent[]) => void;
}

export function MockControls({ currentTime, onTimeChange, onInjectEvents }: MockControlsProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [mockTime, setMockTime] = useState<string>(""); // HH:mm
    const [activeScenario, setActiveScenario] = useState<string | null>(null);

    // Sync mockTime input with currentTime when opened or changed externally
    useEffect(() => {
        setMockTime(`${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`);
    }, [currentTime]);

    const handleTimeApply = () => {
        if (!mockTime) {
            onTimeChange(null); // Reset to real time
            return;
        }
        const [hours, minutes] = mockTime.split(':').map(Number);
        const newDate = new Date(currentTime); // Clone current to keep date, change time
        newDate.setHours(hours, minutes, 0, 0);
        onTimeChange(newDate);
    };

    const handleScenario = (type: 'busy' | 'gap' | 'free') => {
        // Use the VIEW's current time as the anchor, not system time
        const baseTime = currentTime.getTime();
        let newEvents: CalendarEvent[] = [];

        console.log(`[MockControls] Injecting scenario: ${type} at baseTime: ${currentTime.toLocaleTimeString()}`);

        if (type === 'busy') {
            // Event starts 10 mins ago, lasts 45 mins
            newEvents = [{
                id: 'mock-1',
                title: 'Deep Work: Coding',
                description: 'Implementing the ADHD Engine',
                start_time: new Date(baseTime - 10 * 60000).toISOString(),
                time: 'Now',
                duration: 45,
                type: 'work',
                source: 'internal'
            }];
        } else if (type === 'gap') {
            // Event starts in 20 mins
            newEvents = [{
                id: 'mock-2',
                title: 'Team Sync',
                description: 'Daily Standup',
                start_time: new Date(baseTime + 20 * 60000).toISOString(),
                time: 'Soon',
                duration: 30,
                type: 'work',
                source: 'google'
            }];
        }
        // free = empty array

        setActiveScenario(type);
        onInjectEvents(newEvents);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 right-4 bg-main text-cream p-3 rounded-full shadow-xl hover:scale-110 transition-transform z-50 opacity-50 hover:opacity-100"
                title="Open Debug Controls"
            >
                <Settings size={20} />
            </button>
        );
    }

    return (
        <div className="fixed bottom-4 right-4 bg-white border border-main/10 shadow-2xl p-4 rounded-2xl z-50 w-72 animate-in slide-in-from-bottom duration-200">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-main flex items-center gap-2">
                    <Clock size={16} /> Debug Controls
                </h3>
                <button onClick={() => setIsOpen(false)} className="text-main/40 hover:text-main">
                    Close
                </button>
            </div>

            <div className="space-y-4">
                {/* Time Travel */}
                <div>
                    <label className="text-xs font-bold text-main/60 uppercase tracking-wide block mb-1">Time Travel (HH:mm)</label>
                    <div className="flex gap-2">
                        <input
                            type="time"
                            value={mockTime}
                            onChange={(e) => setMockTime(e.target.value)}
                            className="bg-main/5 border border-main/10 rounded-lg px-2 py-1 text-sm flex-1"
                        />
                        <button onClick={handleTimeApply} className="text-xs bg-main/10 hover:bg-main/20 px-2 rounded font-medium">
                            Set
                        </button>
                        <button onClick={() => onTimeChange(null)} className="text-xs bg-terracotta/10 text-terracotta hover:bg-terracotta/20 px-2 rounded font-medium">
                            Reset
                        </button>
                    </div>
                </div>

                {/* Scenarios */}
                <div>
                    <label className="text-xs font-bold text-main/60 uppercase tracking-wide block mb-1">Scenarios</label>
                    <div className="grid grid-cols-3 gap-2">
                        <button
                            onClick={() => handleScenario('busy')}
                            className={`text-xs py-1.5 rounded-lg border ${activeScenario === 'busy' ? 'bg-main text-cream border-main' : 'bg-white border-main/20 text-main hover:bg-main/5'}`}
                        >
                            Focus
                        </button>
                        <button
                            onClick={() => handleScenario('gap')}
                            className={`text-xs py-1.5 rounded-lg border ${activeScenario === 'gap' ? 'bg-main text-cream border-main' : 'bg-white border-main/20 text-main hover:bg-main/5'}`}
                        >
                            Gap
                        </button>
                        <button
                            onClick={() => handleScenario('free')}
                            className={`text-xs py-1.5 rounded-lg border ${activeScenario === 'free' ? 'bg-main text-cream border-main' : 'bg-white border-main/20 text-main hover:bg-main/5'}`}
                        >
                            Free
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
