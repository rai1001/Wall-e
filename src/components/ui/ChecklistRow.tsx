import React from 'react';

interface ChecklistRowProps {
    title: string;
    isDone: boolean;
    onToggle: () => void;
}

export const ChecklistRow: React.FC<ChecklistRowProps> = ({ title, isDone, onToggle }) => {
    return (
        <div
            onClick={onToggle}
            className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0 cursor-pointer group"
        >
            <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${isDone ? 'bg-status-ok border-status-ok' : 'border-gray-200 group-hover:border-action'}`}
            >
                {isDone && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
            </div>
            <span className={`text-sm font-medium transition-colors ${isDone ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                {title}
            </span>
        </div>
    );
};
