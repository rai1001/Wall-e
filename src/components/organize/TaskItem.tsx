import { Check, Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";

export interface Task {
    id: string;
    title: string;
    isDone: boolean;
}

interface TaskItemProps {
    task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
    const [isDone, setIsDone] = useState(task.isDone);

    return (
        <div className={`group flex items-start gap-3 p-3 rounded-xl transition-all ${isDone ? 'bg-stone-50 opacity-60' : 'bg-white hover:shadow-sm border border-transparent hover:border-stone-100'}`}>
            <button
                onClick={() => setIsDone(!isDone)}
                className={`mt-1 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${isDone ? 'bg-stone-400 border-stone-400 text-white' : 'border-stone-300 hover:border-stone-400 text-transparent'}`}
            >
                <Check size={14} strokeWidth={3} />
            </button>

            <div className="flex-1">
                <span className={`text-sm font-medium ${isDone ? 'line-through text-stone-400' : 'text-main'}`}>
                    {task.title}
                </span>
            </div>

            {/* Hover Actions */}
            <button className="opacity-0 group-hover:opacity-100 text-stone-300 hover:text-terracotta transition-opacity">
                <CalendarIcon size={16} />
            </button>
        </div>
    );
}
