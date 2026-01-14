import React from 'react';

interface ChipProps {
    label: string;
    variant?: 'neutral' | 'blue' | 'green' | 'yellow';
    size?: 'sm' | 'md';
}

export const Chip: React.FC<ChipProps> = ({ label, variant = 'neutral', size = 'md' }) => {
    const styles = {
        neutral: "bg-gray-100 text-gray-600",
        blue: "bg-blue-50 text-action",
        green: "bg-green-50 text-status-ok",
        yellow: "bg-amber-50 text-yellow-700"
    };

    const sizes = {
        sm: "px-2 py-0.5 text-xs",
        md: "px-3 py-1 text-xs"
    };

    return (
        <span className={`inline-flex items-center rounded-full font-medium ${styles[variant]} ${sizes[size]}`}>
            {label}
        </span>
    );
};
