import React from 'react';

type ViewType = 'today' | 'work' | 'home';

interface BottomNavProps {
    currentView: ViewType;
    onChange: (view: ViewType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onChange }) => {
    const tabs: { id: ViewType; label: string; icon: string }[] = [
        { id: 'today', label: 'Hoy', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' }, // Clock/Time
        { id: 'work', label: 'Trabajo', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' }, // Briefcase
        { id: 'home', label: 'Casa & Pugs', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' }, // Home
    ];

    return (
        <div className="fixed bottom-0 w-full max-w-[420px] bg-white border-t border-gray-100 pb-safe pt-2 px-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
            <div className="flex justify-between items-center pb-5">
                {tabs.map((tab) => {
                    const isActive = currentView === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onChange(tab.id)}
                            className={`flex flex-col items-center gap-1 min-w-[64px] transition-colors ${isActive ? 'text-action' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <svg className={`w-6 h-6 ${isActive ? 'stroke-2' : 'stroke-1.5'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
                            </svg>
                            <span className="text-[10px] font-medium">{tab.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
