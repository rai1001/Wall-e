import React from 'react';
import type { AppEvent } from '../../types/schema';

interface TimelineItemProps {
    event: AppEvent;
    isLast?: boolean;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({ event, isLast }) => {
    return (
        <div className="flex gap-4">
            <div className="flex flex-col items-center">
                <div className="w-2 h-2 rounded-full bg-gray-300 mt-2" />
                {!isLast && <div className="w-[1px] bg-gray-200 flex-1 my-1" />}
            </div>
            <div className="pb-8">
                <div className="text-gray-500 text-sm font-medium">{event.time}</div>
                <div className="text-gray-900 font-medium">{event.title}</div>
            </div>
        </div>
    );
};
