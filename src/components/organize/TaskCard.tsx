import { Check, CalendarIcon, RefreshCcw, Heart, Droplets, CalendarCheck } from "lucide-react";
import { clsx } from "clsx";

export interface Task {
    id: string;
    title: string;
    isDone: boolean;
    duration?: string; // e.g. "1h", "45m"
    context: 'work' | 'home';
}

interface TaskCardProps {
    task: Task;
    onToggle?: (id: string) => void;
}

export function TaskCard({ task, onToggle }: TaskCardProps) {
    const isWork = task.context === 'work';

    // Warm Friendly Theme: Work = Terracotta, Home = Sage
    const containerClasses = isWork
        ? "bg-white border-terracotta/20 hover:border-terracotta/40"
        : "bg-white border-sage/20 hover:border-sage/40";

    const textHighlight = isWork
        ? "text-terracotta"
        : "text-sage";

    const indicatorBorder = isWork
        ? "border-terracotta text-terracotta bg-terracotta/5 hover:bg-terracotta"
        : "border-sage text-sage bg-sage/5 hover:bg-sage";

    return (
        <div
            onClick={() => onToggle?.(task.id)}
            className={clsx(
                "p-4 rounded-xl border flex flex-col gap-2 shadow-soft cursor-pointer transition-all group",
                containerClasses,
                task.isDone ? "opacity-60 bg-cream/50 shadow-none border-transparent" : "hover:shadow-md hover:-translate-y-0.5"
            )}
        >
            <div className="flex items-start justify-between gap-3">
                <span className={clsx(
                    "text-base font-semibold leading-tight line-clamp-2 transition-colors font-serif",
                    task.isDone ? "line-through text-main/40" : "text-main"
                )}>
                    {task.title}
                </span>

                {/* Visual Indicator (Circle) */}
                <div className={clsx(
                    "size-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-all",
                    task.isDone ? "bg-main/20 border-main/20 text-white" : indicatorBorder
                )}>
                    {task.isDone && <Check size={12} strokeWidth={3} />}
                </div>
            </div>

            <div className="flex items-center gap-2 mt-1">
                {/* Duration Pill */}
                {task.duration && (
                    <span className={clsx(
                        "px-2 py-0.5 rounded-full bg-cream text-[10px] font-body font-bold tracking-wide uppercase",
                        textHighlight
                    )}>
                        {task.duration}
                    </span>
                )}

                {/* Default Duration if missing */}
                {!task.duration && (
                    <span className={clsx(
                        "px-2 py-0.5 rounded-full bg-cream text-[10px] font-body font-bold opacity-50 tracking-wide uppercase",
                        textHighlight
                    )}>
                        30m
                    </span>
                )}

                {/* Status/Context Icon */}
                {isWork ? (
                    <RefreshCcw size={14} className="text-main/20 group-hover:text-terracotta/60 transition-colors" />
                ) : (
                    <Heart size={14} className="text-main/20 group-hover:text-sage/60 transition-colors" />
                )}
            </div>
        </div>
    );
}
