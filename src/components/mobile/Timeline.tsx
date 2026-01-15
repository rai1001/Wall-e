

interface TimelineProps {
    children: React.ReactNode;
}

export function Timeline({ children }: TimelineProps) {
    return (
        <div className="flex flex-col relative pl-2">
            {/* Vertical Line - Absolute relative to the container */}
            {/* Adjusted position: left-[19px] based on reference (center of 40px col) */}
            <div className="absolute left-[19px] top-4 bottom-10 w-0.5 bg-main/5 z-0 rounded-full"></div>

            <div className="flex flex-col gap-6">
                {children}
            </div>

            {/* End Cap */}
            <div className="grid grid-cols-[40px_1fr] gap-x-4 relative">
                <div className="flex flex-col items-center pt-1 z-10">
                    <div className="size-3 rounded-full bg-main/20"></div>
                </div>
            </div>
        </div>
    );
}
