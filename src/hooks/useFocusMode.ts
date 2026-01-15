import { useState, useEffect } from 'react';

// Default Pomodoro: 25 minutes
const FOCUS_DURATION = 25 * 60;

export function useFocusMode() {
    const [isActive, setIsActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(FOCUS_DURATION);
    const [currentTask, setCurrentTask] = useState<string | null>(null);

    // Initial tick to demo functional timer
    useEffect(() => {
        let interval: any;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            // Timer done
            setIsActive(false);
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

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
        setIsActive(!isActive);
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
