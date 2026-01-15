import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
    fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    fullWidth = false,
    className = '',
    ...props
}) => {
    const baseStyles = "px-6 py-3 rounded-full font-medium transition-colors duration-200 text-sm flex items-center justify-center gap-2";

    const variants = {
        primary: "bg-action text-white hover:bg-action-hover active:bg-blue-800",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
        ghost: "bg-transparent text-gray-500 hover:text-action hover:bg-blue-50",
        outline: "border border-gray-200 text-gray-700 hover:border-gray-300 bg-white"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};
