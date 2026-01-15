import { KalElAvatar } from "../components/ui/KalElAvatar";
import { CheckCircle2, TrendingUp, Moon } from "lucide-react";

export function DailySummaryView() {
    // Mock Data based on reference

    return (
        <div className="flex flex-col min-h-screen bg-[#1a0b2e] text-white pb-32 overflow-hidden relative">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#4c1d95]/30 to-transparent pointer-events-none"></div>

            {/* Header */}
            <header className="flex-none pt-12 pb-6 px-6 z-10 sticky top-0 bg-[#1a0b2e]/90 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <div className="flex shrink-0 items-center justify-center rounded-full border-2 border-purple-400/30 p-1 bg-white/5">
                        <KalElAvatar size="md" state="happy" className="opacity-90 grayscale-[0.2]" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-serif font-black text-white leading-tight">
                            Wind Down.
                        </h2>
                        <p className="text-sm font-medium text-white/50">
                            You crushed it today.
                        </p>
                    </div>
                </div>
            </header>

            <div className="px-6 space-y-8 z-10">

                {/* Big Stat Card */}
                <section className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-20">
                        <div className="text-9xl font-black text-white leading-none -mt-4 -mr-4">92</div>
                    </div>

                    <div className="relative z-10">
                        <span className="text-xs font-bold uppercase tracking-widest text-purple-300">Daily Score</span>
                        <div className="text-6xl font-black text-white mt-2 mb-1 tracking-tight">92%</div>
                        <p className="text-sm text-white/60 font-medium">Top 5% of your days.</p>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-4">
                        <div className="bg-white/5 rounded-2xl p-4">
                            <CheckCircle2 className="text-purple-400 mb-2" size={20} />
                            <div className="text-2xl font-bold">12/14</div>
                            <div className="text-[10px] uppercase font-bold text-white/40">Tasks Done</div>
                        </div>
                        <div className="bg-white/5 rounded-2xl p-4">
                            <TrendingUp className="text-green-400 mb-2" size={20} />
                            <div className="text-2xl font-bold">5.2h</div>
                            <div className="text-[10px] uppercase font-bold text-white/40">Focus Time</div>
                        </div>
                    </div>
                </section>

                {/* Parking Lot Action */}
                <section>
                    <div className="flex justify-between items-end mb-4">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Left Over</h3>
                        <span className="text-xs font-bold text-white/60">2 Tasks</span>
                    </div>

                    <div className="space-y-3">
                        <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex justify-between items-center group">
                            <span className="font-bold">Call Mom</span>
                            <button className="text-xs font-bold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors">
                                Move to Tmrrw
                            </button>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex justify-between items-center group">
                            <span className="font-bold">Pay Bills</span>
                            <button className="text-xs font-bold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors">
                                Move to Tmrrw
                            </button>
                        </div>
                    </div>
                </section>

                {/* Wind Down Button */}
                <button className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-2xl shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2 transition-all active:scale-95">
                    <Moon size={20} fill="currentColor" /> Switch to Evening Mode
                </button>

            </div>
        </div>
    );
}
