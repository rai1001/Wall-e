import { AccountCard } from "../components/connections/AccountCard";
import { signInWithGoogle, supabase, signOut } from "../lib/supabase";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";

export function ConnectionsView() {
    const [googleSession, setGoogleSession] = useState<Session | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.provider_token) {
                setGoogleSession(session);
            }
        });
    }, []);

    const handleGoogleConnect = async () => {
        try {
            await signInWithGoogle();
        } catch (err) {
            console.error(err);
            alert("Failed to connect Google");
        }
    };

    const handleDisconnect = async () => {
        await signOut();
        setGoogleSession(null);
        window.location.reload();
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 pb-20 pt-8 animate-in slide-in-from-bottom duration-500">
            <div className="text-center space-y-3 mb-12">
                <h2 className="text-5xl font-serif font-black italic text-main tracking-tight">Integrations</h2>
                <p className="text-main/60 font-medium text-lg max-w-md mx-auto">Manage your "Kal-el" connections to sync events and tasks.</p>
            </div>

            <div className="space-y-6">
                <h3 className="text-xs font-bold text-main/40 uppercase tracking-widest pl-2 font-body border-l-2 border-terracotta/30 ml-1">Calendars</h3>

                <AccountCard
                    type="google"
                    status={googleSession ? "connected" : "disconnected"}
                    email={googleSession?.user?.email}
                    lastSynced={googleSession ? "Just now" : undefined}
                    onConnect={handleGoogleConnect}
                    onDisconnect={handleDisconnect}
                />

                <AccountCard
                    type="outlook"
                    status="error"
                    email="corp@chefos.com"
                />
            </div>

            <div className="space-y-6 pt-6">
                <h3 className="text-xs font-bold text-main/40 uppercase tracking-widest pl-2 font-body border-l-2 border-sage/30 ml-1">Productivity</h3>

                <AccountCard
                    type="notion"
                    status="disconnected"
                />
                <AccountCard
                    type="slack"
                    status="disconnected"
                />
            </div>
        </div>
    );
}
