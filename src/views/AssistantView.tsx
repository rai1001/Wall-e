import { KalElAvatar } from "../components/ui/KalElAvatar";
import { Bell, ChevronRight, X } from "lucide-react";


export function AssistantView() {
    // Mock Data based on reference
    const notifications = [
        {
            id: 1,
            type: 'critical',
            title: 'Budget Alert',
            message: 'Weekly food budget exceeded by 15%.',
            action: 'Review',
            time: '2m ago'
        },
        {
            id: 2,
            type: 'suggestion',
            title: 'Suggestion',
            message: 'You have a 30m gap. Want a quick walk?',
            action: 'Schedule',
            time: '14m ago'
        },
        {
            id: 3,
            type: 'info',
            title: 'System',
            message: 'Sync completed successfully.',
            time: '1h ago'
        }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-work-bg dark:bg-background-dark pb-32">
            {/* Header */}
            <header className="flex-none pt-12 pb-6 px-6 z-10 sticky top-0 bg-work-bg/95 dark:bg-background-dark/95 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                    <div className="flex shrink-0 items-center justify-center rounded-full border-2 border-primary/20 p-1 bg-white dark:bg-surface-dark">
                        <KalElAvatar size="md" state="happy" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-serif font-black text-main dark:text-white leading-tight">
                            Hello, User.
                        </h2>
                        <p className="text-sm font-medium text-main/60 dark:text-white/60">
                            Here is what you missed.
                        </p>
                    </div>
                </div>
            </header>

            <div className="px-6 space-y-6">

                {/* Critical Section */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400">Critical Attention</h3>
                        <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full">1 New</span>
                    </div>

                    <div className="space-y-3">
                        {notifications.filter(n => n.type === 'critical').map(n => (
                            <div key={n.id} className="bg-white dark:bg-surface-dark p-5 rounded-2xl shadow-sm border-l-4 border-red-500 relative overflow-hidden group">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <Bell size={14} className="text-red-500" />
                                        <span className="text-xs font-bold text-red-500 uppercase">{n.title}</span>
                                    </div>
                                    <span className="text-xs text-stone-300">{n.time}</span>
                                </div>
                                <p className="text-main dark:text-white font-medium mb-3 pr-8">{n.message}</p>
                                <button className="w-full py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors hover:bg-red-100">
                                    {n.action} <ChevronRight size={14} />
                                </button>
                                <button className="absolute top-2 right-2 p-2 text-stone-300 hover:text-stone-500">
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Feed Section */}
                <section>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4">Feed</h3>

                    <div className="space-y-4">
                        {notifications.filter(n => n.type !== 'critical').map(n => (
                            <div key={n.id} className="bg-white/60 dark:bg-surface-dark/60 p-4 rounded-xl border border-stone-100 dark:border-white/5 flex gap-4">
                                <div className={`shrink-0 size-2 rounded-full mt-2 ${n.type === 'suggestion' ? 'bg-primary' : 'bg-stone-300'}`} />
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-sm font-bold text-main dark:text-white">{n.title}</h4>
                                        <span className="text-[10px] text-stone-400">{n.time}</span>
                                    </div>
                                    <p className="text-xs text-main/70 dark:text-white/70 mt-1 leading-relaxed">{n.message}</p>
                                    {n.action && (
                                        <button className="mt-2 text-xs font-bold text-primary hover:underline">
                                            {n.action}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </div>
    );
}
