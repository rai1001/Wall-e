import React from 'react';
import { Button } from './Button';
import { ArrowRight, Sparkles } from 'lucide-react';

interface SmartCardProps {
    time: string;
    title: string;
    subtitle?: string;
    priority?: 'High' | 'Medium' | 'Low';
    onStart?: () => void;
    onDetails?: () => void;
}

export function SmartCard({ time, title, subtitle, onStart }: SmartCardProps) {
    return (
        <div className="group relative flex flex-col bg-white p-6 rounded-[2.5rem] shadow-soft border border-main/5 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">

            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-terracotta/5 rounded-full blur-[50px] -mr-10 -mt-10 pointer-events-none"></div>

            {/* Header / Time */}
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-terracotta uppercase tracking-wider mb-1">Up Next</span>
                    <span className="font-serif font-medium text-lg text-main italic">{time}</span>
                </div>

                {/* Visual Icon Circle */}
                <div className="w-12 h-12 rounded-2xl bg-cream border border-main/5 flex items-center justify-center text-terracotta rotate-3 group-hover:rotate-6 transition-transform duration-500 shadow-sm">
                    <Sparkles size={20} />
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10 mb-6">
                <h3 className="font-serif text-3xl font-bold text-main leading-tight mb-2">
                    {title}
                </h3>
                {subtitle && (
                    <p className="text-main/60 font-medium text-base leading-relaxed line-clamp-2">
                        {subtitle}
                    </p>
                )}
            </div>

            {/* Action Area */}
            <div className="mt-auto flex items-center justify-between gap-3 relative z-10">
                {onStart && (
                    <Button onClick={onStart} className="w-full !rounded-2xl !text-lg !font-serif !font-bold bg-main text-white hover:bg-terracotta shadow-lg shadow-main/20 hover:shadow-terracotta/30 transition-all">
                        Start Session
                        <ArrowRight size={18} className="ml-2" />
                    </Button>
                )}
            </div>
        </div>
    );
}
