import { useState, useEffect } from 'react';

// Default Pomodoro: 25 minutes
const FOCUS_DURATION = 25 * 60;

export function useFocusMode() {
    const [isActive, setIsActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(FOCUS_DURATION);
    const [currentTask, setCurrentTask] = useState<string | null>(null);

    useEffect(() => {
        if (!isActive) return;

        const interval = window.setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    setIsActive(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isActive]);

    const startSession = (task: string) => {
        setCurrentTask(task);
        setTimeLeft(FOCUS_DURATION);
        setIsActive(true);
    };

    const stopSession = () => {
        setIsActive(false);
        setCurrentTask(null);
    };

    const togglePause = () => {
        setIsActive(prev => !prev);
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return {
        isActive,
        timeLeft,
        currentTask,
        startSession,
        stopSession,
        togglePause,
        formatTime
    };
}
