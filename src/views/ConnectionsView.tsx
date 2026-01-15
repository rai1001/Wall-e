import { AccountCard } from "../components/connections/AccountCard";
import { Button } from "../components/ui/Button";
import { signInWithGoogle, supabase, signOut } from "../lib/supabase";
import { useEffect, useState, useCallback } from "react";
import type { ChangeEvent } from "react";
import { eventService } from "../services/eventService";
import { googleCalendarService, type GoogleCalendarListItem } from "../services/googleCalendarService";
import { importIcsFile } from "../services/icsImportService";
import { addDays, startOfDay } from "date-fns";
import type { Session } from "@supabase/supabase-js";

export function ConnectionsView() {
    const [googleSession, setGoogleSession] = useState<Session | null>(null);
    const [calendars, setCalendars] = useState<GoogleCalendarListItem[]>([]);
    const [loadingCalendars, setLoadingCalendars] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [importingCalendar, setImportingCalendar] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [icsFile, setIcsFile] = useState<File | null>(null);
    const [icsImporting, setIcsImporting] = useState(false);
    const [icsMessage, setIcsMessage] = useState<string | null>(null);
    const [icsInputKey, setIcsInputKey] = useState(0);

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

    const handleIcsFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;
        setIcsFile(file);
        if (file) {
            setIcsMessage(`Ready to import ${file.name}`);
        } else {
            setIcsMessage(null);
        }
    };

    const handleIcsImport = async () => {
        if (!icsFile) {
            setIcsMessage('Select an .ics file first.');
            return;
        }

        setIcsImporting(true);
        setIcsMessage(null);

        try {
            const result = await importIcsFile(icsFile);
            const summaries: string[] = [];
            if (result.imported) {
                summaries.push(`Imported ${result.imported} event${result.imported === 1 ? '' : 's'}`);
            }
            if (result.skipped) {
                summaries.push(`Skipped ${result.skipped}`);
            }
            if (result.errors.length) {
                summaries.push(`Errors: ${result.errors.slice(0, 2).join('; ')}`);
            }

            setIcsMessage(
                summaries.length
                    ? summaries.join(' · ')
                    : 'No events were found in the file.'
            );
        } catch (error) {
            const fallbackMessage = error instanceof Error ? error.message : 'Failed to import this file.';
            setIcsMessage(fallbackMessage);
        } finally {
            setIcsImporting(false);
            setIcsFile(null);
            setIcsInputKey((prev) => prev + 1);
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

                <div className="mt-4 space-y-3 rounded-2xl border border-main/10 bg-cream/80 p-4 shadow-sm">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-main/40">Import from .ics</p>
                        <p className="text-sm text-main/60 mt-1">Upload a calendar export to bring external events into Wall-e.</p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <label className="flex-1">
                            <span className="sr-only">Select an ICS file</span>
                            <input
                                key={icsInputKey}
                                type="file"
                                accept=".ics,text/calendar"
                                onChange={handleIcsFileChange}
                                className="block w-full cursor-pointer rounded-xl border border-main/20 bg-white px-4 py-3 text-sm text-main/70 transition hover:border-main/40 file:mr-4 file:rounded-full file:border-0 file:bg-main file:px-4 file:py-2 file:text-sm file:font-semibold file:text-cream hover:file:bg-main/80"
                            />
                        </label>
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={handleIcsImport}
                            disabled={icsImporting || !icsFile}
                        >
                            {icsImporting ? 'Importing...' : 'Import .ics'}
                        </Button>
                    </div>

                    {icsMessage && (
                        <p className="text-xs text-main/40 uppercase tracking-widest">{icsMessage}</p>
                    )}
                </div>

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
