import { AccountCard } from "../components/connections/AccountCard";
import { Button } from "../components/ui/Button";
import { signInWithGoogle, supabase, signOut } from "../lib/supabase";
import { useEffect, useState, useCallback } from "react";
import { eventService } from "../services/eventService";
import { googleCalendarService, type GoogleCalendarListItem } from "../services/googleCalendarService";
import { addDays, startOfDay } from "date-fns";
import type { Session } from "@supabase/supabase-js";

export function ConnectionsView() {
    const [googleSession, setGoogleSession] = useState<Session | null>(null);
    const [calendars, setCalendars] = useState<GoogleCalendarListItem[]>([]);
    const [loadingCalendars, setLoadingCalendars] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [importingCalendar, setImportingCalendar] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const loadCalendars = useCallback(async (token?: string) => {
        if (!token) {
            setCalendars([]);
            return;
        }

        setLoadingCalendars(true);
        try {
            const list = await googleCalendarService.listCalendars(token);
            setCalendars(list);
        } finally {
            setLoadingCalendars(false);
        }
    }, []);

    useEffect(() => {
        const fetchSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setGoogleSession(session);
            if (session?.provider_token) {
                await loadCalendars(session.provider_token);
            }
        };

        fetchSession();

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setGoogleSession(session);
            if (session?.provider_token) {
                loadCalendars(session.provider_token);
            } else {
                setCalendars([]);
            }
        });

        return () => listener.subscription.unsubscribe();
    }, [loadCalendars]);

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

    const refreshCalendars = async () => {
        if (!googleSession?.provider_token) return;
        setRefreshing(true);
        await loadCalendars(googleSession.provider_token);
        setRefreshing(false);
    };

    const importEvents = async (calendar: GoogleCalendarListItem) => {
        if (!googleSession?.provider_token) return;
        setMessage(null);
        setImportingCalendar(calendar.id);

        const start = startOfDay(new Date());
        const end = addDays(start, 7);

        try {
            const events = await googleCalendarService.listEventsForCalendar(
                googleSession.provider_token,
                calendar.id,
                start,
                end
            );

            let created = 0;
            for (const event of events) {
                const startStr = event.start.dateTime ?? event.start.date;
                if (!startStr) continue;
                const startDate = new Date(startStr);

                const endStr = event.end.dateTime ?? event.end.date;
                const endDate = endStr ? new Date(endStr) : new Date(startDate.getTime() + 60 * 60 * 1000);

                await eventService.createEvent({
                    title: event.summary || 'Google Event',
                    description: event.description || '',
                    location: event.location || '',
                    start_time: startDate.toISOString(),
                    end_time: endDate.toISOString(),
                    category: 'work',
                    is_all_day: !!event.start.date
                });
                created++;
            }

            setMessage(`Imported ${created} event${created === 1 ? '' : 's'} from ${calendar.summary ?? 'this calendar'}.`);
        } catch (error) {
            console.error(error);
            setMessage('Failed to import events. Please try again.');
        } finally {
            setImportingCalendar(null);
        }
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

                {googleSession && (
                    <div className="mt-4 space-y-4 rounded-2xl border border-main/10 bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between gap-4">
                            <h4 className="text-sm font-semibold uppercase tracking-wider text-main/60">Import from Google</h4>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={refreshCalendars}
                                disabled={refreshing || loadingCalendars}
                            >
                                {refreshing ? 'Refreshing...' : 'Refresh'}
                            </Button>
                        </div>

                        {message && (
                            <p className="text-sm text-sage">{message}</p>
                        )}

                        {loadingCalendars ? (
                            <p className="text-xs text-main/40 uppercase tracking-widest">Loading calendars...</p>
                        ) : calendars.length === 0 ? (
                            <p className="text-xs text-main/40 uppercase tracking-widest">No calendars found.</p>
                        ) : (
                            <div className="space-y-3">
                                {calendars.map((calendar) => (
                                    <div
                                        key={calendar.id}
                                        className="flex flex-col gap-2 rounded-2xl border border-main/10 p-3 bg-cream/50"
                                    >
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <div>
                                                <p className="text-sm font-semibold">{calendar.summary || 'Untitled calendar'}</p>
                                                <p className="text-xs text-main/40">
                                                    {calendar.primary ? 'Primary calendar' : calendar.accessRole || 'Secondary'}
                                                </p>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="primary"
                                                onClick={() => importEvents(calendar)}
                                                disabled={importingCalendar === calendar.id}
                                            >
                                                {importingCalendar === calendar.id ? 'Importing...' : 'Import events (7d)'}
                                            </Button>
                                        </div>
                                        {calendar.description && (
                                            <p className="text-xs text-main/50">
                                                {calendar.description}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

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
