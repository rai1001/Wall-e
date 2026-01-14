import { useState, useEffect, useMemo } from "react";
import { aiCoach } from "../logic/aiCoach";
import { supabase } from "../lib/supabase";
import type { NowResponse } from "../lib/types";

export function FocusCoachView() {
    const [session, setSession] = useState<any>(null); // Keep session for now or simplify if auth not needed
    const [now, setNow] = useState<NowResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
    const [parkingText, setParkingText] = useState("");

    // ... useEffect for Timer ...

    async function refreshNow() {
        setLoading(true);
        try {
            // Use local AI Coach instead of Edge Function
            const data = await aiCoach.getNowSuggestion();
            setNow(data);
            if (data?.mode === "focus_lock") setSecondsLeft(data.step_minutes * 60);
            else setSecondsLeft(null);
        } catch (err) {
            console.error("Fetch exception:", err);
        } finally {
            setLoading(false);
        }
    }

    async function markDone() {
        if (!now || now.mode !== "focus_lock") return;
        // Mock completion for now
        alert(`Completed: ${now.now_task.title}`);
        await refreshNow();
    }

    async function pause() {
        if (!now || now.mode !== "focus_lock") return;
        await supabase.functions.invoke('pauseTask', {
            body: { task_id: now.now_task.id }
        });
        await refreshNow();
    }

    async function parking() {
        if (!parkingText.trim()) return;
        await supabase.functions.invoke('parking', {
            body: { text: parkingText.trim() }
        });
        setParkingText("");
        alert("Saved to Parking Lot");
    }

    async function quickAuth() {
        const email = prompt("Email");
        const password = prompt("Password");
        if (!email || !password) return;
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) alert(error.message);
    }

    const mmss = useMemo(() => {
        if (secondsLeft === null) return "";
        const m = Math.floor(secondsLeft / 60);
        const s = secondsLeft % 60;
        return `${m}:${String(s).padStart(2, '0')}`;
    }, [secondsLeft]);

    // Bypass Auth for Local Agent Mode
    useEffect(() => {
        refreshNow();
    }, []);

    return (
        <main className="max-w-[520px] mx-auto mt-10 p-4 font-sans pb-24">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Ahora toca</h1>
                <button
                    onClick={refreshNow}
                    disabled={loading}
                    className="text-sm text-gray-500 hover:text-gray-900 px-3 py-1 rounded bg-gray-100"
                >
                    {loading ? "..." : "Refresh"}
                </button>
            </div>

            {now?.mode === "idle" && (
                <div className="p-8 border border-gray-200 rounded-2xl bg-white shadow-sm text-center">
                    <p className="text-lg text-gray-700 mb-6">{now.message}</p>
                    <div className="text-sm text-gray-400">Add tasks to your database to begin.</div>
                </div>
            )}

            {now?.mode === "focus_lock" && (
                <div className="p-6 border-2 border-indigo-100 rounded-3xl bg-white shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold tracking-wider uppercase text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">
                            {now.now_task.type}
                        </span>
                    </div>

                    <div className="text-2xl font-bold text-gray-900 mb-6 leading-tight">
                        {now.now_task.title}
                    </div>

                    <div className="bg-blue-50 rounded-2xl p-6 mb-8 border border-blue-100">
                        <div className="text-sm text-blue-600 font-medium mb-2 uppercase tracking-wide">Next Step</div>
                        <div className="text-xl font-medium text-blue-900 shadow-sm leading-relaxed">
                            {now.next_step}
                        </div>
                    </div>

                    <div className="text-6xl font-mono font-bold text-center text-gray-900 mb-10 tracking-tighter">
                        {mmss}
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-8">
                        <button
                            onClick={markDone}
                            className="col-span-1 bg-gray-900 text-white p-4 rounded-xl font-semibold hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-gray-200"
                        >
                            Done
                        </button>
                        <div className="col-span-1 flex flex-col gap-2">
                            <button
                                onClick={pause}
                                className="bg-gray-100 text-gray-700 p-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                            >
                                Pause
                            </button>
                            <button
                                onClick={() => alert("Stuck logic to be implemented via 'resolveStuck' function.")}
                                className="bg-orange-50 text-orange-600 p-3 rounded-xl font-medium hover:bg-orange-100 transition-colors"
                            >
                                Stuck
                            </button>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100">
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Parking Lot</div>
                        <div className="flex gap-2">
                            <input
                                value={parkingText}
                                onChange={(e) => setParkingText(e.target.value)}
                                placeholder="Quick capture thought..."
                                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                                onKeyDown={(e) => e.key === 'Enter' && parking()}
                            />
                            <button
                                onClick={parking}
                                className="bg-white border border-gray-200 text-gray-500 hover:text-blue-600 hover:border-blue-200 px-4 py-2 rounded-lg transition-all"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
