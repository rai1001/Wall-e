import { motion } from "framer-motion";
import { Dog, Zap } from "lucide-react";

interface KalElAvatarProps {
    state?: 'idle' | 'happy' | 'thinking';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function KalElAvatar({ state = 'idle', size = 'md', className = "" }: KalElAvatarProps) {

    const sizeClasses = {
        sm: "w-8 h-8",
        md: "w-16 h-16",
        lg: "w-32 h-32"
    };

    const variants = {
        idle: { rotate: [0, -5, 5, 0], transition: { repeat: Infinity, duration: 5 } },
        happy: { y: [0, -10, 0], scale: [1, 1.1, 1], transition: { repeat: Infinity, duration: 0.8 } },
        thinking: { rotate: [0, 360], transition: { repeat: Infinity, duration: 3 } }
    };

    return (
        <motion.div
            className={`relative flex items-center justify-center rounded-full bg-primary/10 border-2 border-primary text-primary-dark ${sizeClasses[size]} ${className}`}
            animate={state}
            variants={variants}
        >
            {/* Base "Pug" Icon Representation */}
            <Dog
                className={`text-primary-dark dark:text-primary ${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-8 h-8' : 'w-16 h-16'}`}
                strokeWidth={2.5}
            />

            {/* Accessories / Expressions */}
            {state === 'thinking' && (
                <motion.div
                    className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                >
                    <Zap className="w-3 h-3 text-yellow-500" fill="currentColor" />
                </motion.div>
            )}
        </motion.div>
    );
}
