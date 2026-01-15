import React from 'react';
import { Chip } from './Chip';

interface TaskRowProps {
    title: string;
    meta?: string; // e.g. "10 min", "11:00 AM"
    tag?: string;
    isDone?: boolean;
    onToggle?: () => void;
    variant?: 'checkbox' | 'radio'; // Radio for "Focus" card selection if needed
}

export const TaskRow: React.FC<TaskRowProps> = ({ title, meta, tag, isDone, onToggle }) => {
    return (
        <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0 group">
            <div
                onClick={onToggle}
                className={`mt-1 w-5 h-5 rounded-md border flex items-center justify-center cursor-pointer transition-colors ${isDone ? 'bg-status-ok border-status-ok' : 'border-gray-300 bg-white'}`}
            >
                {isDone && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
            </div>

            <div className="flex-1">
                <div className={`text-sm font-medium ${isDone ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                    {title}
                </div>
                {(meta || tag) && (
                    <div className="flex items-center gap-2 mt-1">
                        {meta && <span className="text-xs text-gray-500">{meta}</span>}
                        {tag && <Chip label={tag} size="sm" variant="blue" />}
                    </div>
                )}
            </div>
        </div>
    );
};
