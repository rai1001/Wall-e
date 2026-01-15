import { useState } from 'react';
import { ChevronLeft, ChevronRight, Briefcase, Home } from 'lucide-react';
import { Button } from '../ui/Button';

interface CalendarSidebarProps {
    onCreateEvent?: () => void;
}

export function CalendarSidebar({ onCreateEvent }: CalendarSidebarProps) {
    const [filters, setFilters] = useState({ work: true, home: true });

    const toggleFilter = (key: 'work' | 'home') => {
        setFilters(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="w-full md:w-64 flex-shrink-0 space-y-8 pr-4 hidden lg:block">
            {/* Create Button */}
            <Button size="lg" className="w-full shadow-lg shadow-terracotta/20" onClick={onCreateEvent}>
                + Create Event
            </Button>

            {/* Mini Calendar (Static for now) */}
            <div className="bg-white p-4 rounded-2xl shadow-soft border border-main/5">
                <div className="flex items-center justify-between mb-4 px-2">
                    <span className="text-xl font-bold font-serif italic text-main">January 2026</span>
                    <div className="flex gap-1">
                        <button className="p-1 hover:bg-main/5 rounded-full transition-colors text-main/40 hover:text-main">
                            <ChevronLeft size={20} />
                        </button>
                        <button className="p-1 hover:bg-main/5 rounded-full transition-colors text-main/40 hover:text-main">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-7 mb-2 text-center">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                        <div key={i} className="text-xs font-bold text-main/30 uppercase tracking-wider py-1">
                            {d}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-y-2 gap-x-1 text-center">
                    {/* Empty days padding (mocked for now) */}
                    {[...Array(4)].map((_, i) => <div key={`empty-${i}`} />)}

                    {/* Days */}
                    {[...Array(31)].map((_, i) => {
                        const day = i + 1;
                        const isSelected = day === 15; // Mock selection
                        const isToday = day === 12; // Mock today

                        return (
                            <button
                                key={day}
                                className={`
                                aspect-square flex flex-col items-center justify-center rounded-full text-sm font-medium transition-all relative group
                                ${isSelected
                                        ? 'bg-white shadow-soft scale-110 z-10 border border-main/5 text-terracotta font-bold'
                                        : 'hover:bg-main/5 text-main/80'
                                    }
                                ${isToday && !isSelected ? 'text-terracotta font-bold' : ''}
                            `}
                            >
                                <span>{day}</span>

                                {/* Dot Indicators (Mock) */}
                                {/* Random dots for visual "sample" effect */}
                                {day % 3 === 0 && (
                                    <div className="flex gap-0.5 mt-0.5">
                                        <div className="w-1 h-1 rounded-full bg-terracotta"></div>
                                    </div>
                                )}
                                {day % 5 === 0 && (
                                    <div className="flex gap-0.5 mt-0.5">
                                        <div className="w-1 h-1 rounded-full bg-sage"></div>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Filters */}
            <div className="space-y-3">
                <h3 className="text-xs font-bold text-main/40 uppercase tracking-widest pl-2">My Calendars</h3>

                <div
                    onClick={() => toggleFilter('work')}
                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${filters.work ? 'hover:bg-main/5' : 'opacity-50'}`}
                >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${filters.work ? 'bg-terracotta border-terracotta text-white' : 'border-main/20'}`}>
                        {filters.work && <Briefcase size={10} />}
                    </div>
                    <span className="font-medium text-main">Work</span>
                </div>

                <div
                    onClick={() => toggleFilter('home')}
                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${filters.home ? 'hover:bg-main/5' : 'opacity-50'}`}
                >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${filters.home ? 'bg-sage border-sage text-white' : 'border-main/20'}`}>
                        {filters.home && <Home size={10} />}
                    </div>
                    <span className="font-medium text-main">Home & Pugs</span>
                </div>
            </div>
        </div>
    );
}
