import React from 'react';

interface TabSelectorProps {
    tabs: string[];
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export const TabSelector: React.FC<TabSelectorProps> = ({ tabs, activeTab, onTabChange }) => {
    return (
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            {tabs.map((tab) => {
                const isActive = activeTab === tab;
                return (
                    <button
                        key={tab}
                        onClick={() => onTabChange(tab)}
                        className={`flex-1 py-1.5 px-3 rounded-md text-sm font-medium transition-all ${isActive ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        {tab}
                    </button>
                );
            })}
        </div>
    );
};
