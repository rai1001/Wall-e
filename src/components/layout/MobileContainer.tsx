import React from 'react';

interface MobileContainerProps {
    children: React.ReactNode;
}

export const MobileContainer: React.FC<MobileContainerProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-surface flex justify-center">
            <div className="w-full max-w-[420px] md:max-w-[640px] transition-all duration-300 bg-surface min-h-screen relative shadow-2xl flex flex-col md:border-x md:border-gray-200">
                {children}
            </div>
        </div>
    );
};
