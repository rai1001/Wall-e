import { Target } from "lucide-react";

interface WeeklyReviewCardProps {
    context: 'work' | 'home';
}

export function WeeklyReviewCard({ context }: WeeklyReviewCardProps) {
    const isWork = context === 'work';
    const accentColor = isWork ? 'text-terracotta' : 'text-sage';
    const bgColor = isWork ? 'bg-terracotta/5' : 'bg-sage/5';
    const borderColor = isWork ? 'border-terracotta/20' : 'border-sage/20';

    return (
        <div className={`p-4 rounded-xl ${bgColor} border ${borderColor} mb-6`}>
            <div className={`flex items-center gap-2 mb-2 ${accentColor} font-serif font-bold`}>
                <Target size={18} />
                <span>Weekly Focus</span>
            </div>
            <input
                type="text"
                placeholder={isWork ? "What is the ONE thing to achieve?" : "Family/Personal highlight?"}
                className="w-full bg-transparent border-b border-stone-300 focus:border-stone-500 focus:outline-none py-1 text-main placeholder:text-stone-400 font-medium"
            />
        </div>
    );
}
