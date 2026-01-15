import { useState, useEffect, useRef, useCallback } from 'react';

export interface FocusTimerState {
    elapsedSeconds: number;
    isPaused: boolean;
    isActive: boolean;
    totalDuration: number | null; // Optional target duration
    togglePause: () => void;
    stop: () => void;
    start: () => void;
    formatTime: (totalSeconds: number) => string;
}

export function useFocusTimer(initialDuration: number | null = null) {
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [isActive, setIsActive] = useState(false);

    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        if (isActive && !isPaused) {
            intervalRef.current = window.setInterval(() => {
                setElapsedSeconds(prev => prev + 1);
            }, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isActive, isPaused]);

    const start = useCallback(() => {
        setIsActive(true);
        setIsPaused(false);
        setElapsedSeconds(0);
    }, []);

    const stop = useCallback(() => {
        setIsActive(false);
        setIsPaused(false);
        setElapsedSeconds(0);
    }, []);

    const togglePause = useCallback(() => {
        setIsPaused(prev => !prev);
    }, []);

    const formatTime = useCallback((totalSeconds: number) => {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;

        if (h > 0) {
            return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
        }
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    }, []);

    return {
        elapsedSeconds,
        isPaused,
        isActive,
        totalDuration: initialDuration,
        start,
        stop,
        togglePause,
        formatTime
    };
}
