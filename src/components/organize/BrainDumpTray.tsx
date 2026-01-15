import { Plus, Lightbulb } from "lucide-react";
import { useState } from "react";

export function BrainDumpTray() {
    const [text, setText] = useState("");

    // Mock quick adds for visual alignment
    const quickAdds = ["Buy birthday gift", "Research vacation", "Car service"];

    return (
        <div className="shrink-0 bg-white rounded-t-[2.5rem] shadow-[0_-8px_30px_rgba(0,0,0,0.06)] border-t border-main/5 relative z-20 -mx-4 md:-mx-8 px-6 pb-6 pt-2 mt-auto">
            {/* Handle */}
            <div className="w-full flex justify-center pt-3 pb-4">
                <div className="h-1.5 w-12 bg-main/10 rounded-full"></div>
            </div>

            <h3 className="text-xl font-bold font-serif mb-4 flex items-center gap-2 text-main">
                <Lightbulb className="text-terracotta" size={22} fill="currentColor" />
                Brain Dump
            </h3>

            {/* Brain Dump Items (Horizontal Scroll) */}
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 mb-4">
                {quickAdds.map((item, i) => (
                    <div key={i} className="shrink-0 px-4 py-2.5 bg-cream rounded-xl border border-main/5 flex items-center gap-2 group cursor-pointer hover:border-terracotta/50 hover:bg-white hover:shadow-sm transition-all">
                        <span className="font-body text-sm font-medium text-main/80">{item}</span>
                        <Plus className="text-terracotta text-sm opacity-0 group-hover:opacity-100 transition-opacity" size={14} />
                    </div>
                ))}
            </div>

            {/* Input Area */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1">
                    <input
                        className="w-full pl-5 pr-12 py-3.5 bg-cream border-2 border-transparent rounded-2xl text-sm font-medium placeholder-main/30 focus:border-terracotta/30 focus:bg-white transition-all outline-none text-main"
                        placeholder="Add a quick thought..."
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                </div>
                <button className="size-12 rounded-2xl bg-main flex items-center justify-center shadow-lg hover:bg-terracotta hover:shadow-terracotta/30 text-white hover:scale-105 active:scale-95 transition-all">
                    <Plus size={24} />
                </button>
            </div>

            <div className="mt-2 text-xs text-main/30 text-center font-body italic">
                Persists until cleared
            </div>
        </div>
    );
}
