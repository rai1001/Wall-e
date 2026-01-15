
import React, { useState } from 'react';
import { Play, Pause, CheckCircle, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { useFocusTimer } from '../../hooks/useFocusTimer';
import confetti from 'canvas-confetti';

interface ActiveSessionProps {
    taskTitle: string;
    taskSubtitle?: string;
    onComplete: () => void;
    onCancel: () => void;
}

export function ActiveSession({ taskTitle, taskSubtitle, onComplete, onCancel }: ActiveSessionProps) {
    // Start timer automatically on mount
    const timer = useFocusTimer();
    const { elapsedSeconds, isPaused, start, stop, togglePause, formatTime } = timer;
    const [isCelebrating, setIsCelebrating] = useState(false);

    React.useEffect(() => {
        start();
        return () => stop();
    }, [start, stop]);

    const handleComplete = () => {
        setIsCelebrating(true);
        stop();
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#D2691E', '#87A96B', '#FFFBF2', '#FF8C42'] // Terracotta, Sage, Cream, Accent
        });

        // Delay actual completion to let them enjoy the confetti
        setTimeout(() => {
            onComplete();
        }, 2000);
    };

    if (isCelebrating) {
        return (
            <div className="fixed inset-0 z-50 bg-main text-cream flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
                <div className="text-center space-y-6 animate-in zoom-in-50 duration-500">
                    <div className="w-24 h-24 bg-sage rounded-full flex items-center justify-center mx-auto text-white shadow-2xl shadow-sage/40">
                        <CheckCircle size={48} strokeWidth={3} />
                    </div>
                    <h1 className="text-4xl font-serif font-bold">Well Done!</h1>
                    <p className="text-white/60 text-xl">Session Complete</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 bg-main text-cream flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[50vh] h-[50vh] bg-terracotta/20 rounded-full blur-[100px] animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[40vh] h-[40vh] bg-sage/10 rounded-full blur-[80px]"></div>
            </div>

            {/* Header Controls */}
            <div className="absolute top-6 right-6 flex gap-4 z-20">
                <button onClick={onCancel} className="text-white/40 hover:text-white transition-colors">
                    <X size={24} />
                    <span className="sr-only">Cancel Session</span>
                </button>
            </div>

            {/* Main Content */}
            <div className="relative z-10 text-center flex flex-col items-center gap-12 w-full max-w-lg">

                {/* Task Info */}
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-sm font-medium tracking-wide uppercase text-white/60">
                        <div className="w-2 h-2 rounded-full bg-terracotta animate-pulse"></div>
                        Focus Mode Active
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight">
                        {taskTitle}
                    </h1>
                    {taskSubtitle && (
                        <p className="text-xl text-white/50 font-medium">
                            {taskSubtitle}
                        </p>
                    )}
                </div>

                {/* Timer Display */}
                <div className="relative group cursor-default">
                    <div className="text-[6rem] md:text-[8rem] font-black font-variant-numeric tabular-nums leading-none tracking-tight select-none">
                        {formatTime(elapsedSeconds)}
                    </div>
                    <div className="text-center text-white/30 text-lg font-medium mt-2">
                        Time Elapsed
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-6 w-full max-w-xs">
                    <Button
                        onClick={togglePause}
                        variant="ghost"
                        className="flex-1 bg-white/10 hover:bg-white/20 text-white border-none h-16 rounded-2xl"
                    >
                        {isPaused ? <Play size={28} fill="currentColor" /> : <Pause size={28} fill="currentColor" />}
                    </Button>

                    <Button
                        onClick={handleComplete}
                        className="flex-[2] bg-terracotta hover:bg-[#c05f1b] text-white text-xl font-bold h-16 rounded-2xl shadow-lg shadow-terracotta/20 hover:shadow-terracotta/40 hover:scale-105 transition-all"
                    >
                        <CheckCircle size={28} className="mr-3" />
                        Complete
                    </Button>
                </div>
            </div>
        </div>
    );
}
