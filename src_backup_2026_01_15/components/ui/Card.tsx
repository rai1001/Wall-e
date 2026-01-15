import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    title?: string;
    subtitle?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, title, subtitle }) => {
    return (
        <div
            onClick={onClick}
            className={`bg-white rounded-[24px] shadow-sm p-5 ${onClick ? 'active:scale-95 transition-transform cursor-pointer' : ''} ${className}`}
        >
            {(title || subtitle) && (
                <div className="mb-4">
                    {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
                    {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
                </div>
            )}
            {children}
        </div>
    );
};
