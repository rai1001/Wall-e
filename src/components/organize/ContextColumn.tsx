import type { ReactNode } from "react";

interface ContextColumnProps {
    title: string;
    headerIcon: ReactNode;
    children: ReactNode;
}

export function ContextColumn({ title, headerIcon, children }: ContextColumnProps) {

    return (
        <div className="flex flex-col gap-4 min-h-0 h-full">
            {/* Header */}
            <div className="flex items-center gap-2 px-1 mb-1 border-b border-main/5 pb-2">
                {headerIcon}
                <h3 className="text-xl font-bold italic font-serif text-main">{title}</h3>
            </div>

            {/* Scrollable list */}
            <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-3 pb-20 pr-2">
                {children}
            </div>

            {/* Add Button */}
            <button className="mt-2 flex items-center gap-3 text-sm font-bold opacity-60 hover:opacity-100 transition-all text-main hover:text-terracotta group">
                <div className="size-8 rounded-full border-2 border-current flex items-center justify-center group-hover:bg-terracotta/10">
                    <span className="text-xl leading-none pb-0.5">+</span>
                </div>
                <span className="font-serif italic">Add task</span>
            </button>
        </div>
    );
}
