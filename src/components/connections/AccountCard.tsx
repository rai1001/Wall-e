import { RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "../ui/Button";

export type AccountType = 'google' | 'outlook' | 'notion' | 'slack';
export type ConnectionStatus = 'connected' | 'disconnected' | 'error' | 'syncing';

interface AccountCardProps {
    type: AccountType;
    email?: string;
    status: ConnectionStatus;
    lastSynced?: string;
    onConnect?: () => void;
    onDisconnect?: () => void;
}

const BRAND_CONFIG = {
    google: { label: 'Google Calendar', color: 'bg-blue-100 text-blue-600', letter: 'G' },
    outlook: { label: 'Outlook Calendar', color: 'bg-indigo-100 text-indigo-600', letter: 'O' },
    notion: { label: 'Notion', color: 'bg-stone-100 text-stone-600', letter: 'N' },
    slack: { label: 'Slack', color: 'bg-purple-100 text-purple-600', letter: 'S' },
};

export function AccountCard({ type, email, status, lastSynced, onConnect, onDisconnect }: AccountCardProps) {
    const brand = BRAND_CONFIG[type];
    const isConnected = status === 'connected' || status === 'syncing';

    return (
        <div className="bg-white p-6 rounded-3xl shadow-soft border border-main/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 transition-all hover:shadow-lg hover:-translate-y-0.5 group">
            <div className="flex items-center gap-5">
                {/* Brand Icon */}
                <div className={`w-16 h-16 rounded-2xl ${brand.color} flex items-center justify-center text-2xl font-black font-serif shadow-sm transition-transform group-hover:scale-105 group-hover:rotate-1`}>
                    {brand.letter}
                </div>

                {/* Info */}
                <div className="space-y-1">
                    <h3 className="font-bold text-main text-lg tracking-tight">{brand.label}</h3>

                    {isConnected ? (
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-main/60">{email}</span>
                            <div className="flex items-center gap-1.5 mt-1">
                                {status === 'syncing' ? (
                                    <RefreshCw size={12} className="animate-spin text-terracotta" />
                                ) : (
                                    <CheckCircle size={14} className="text-sage" strokeWidth={2.5} />
                                )}
                                <span className="text-xs text-main/40 font-bold uppercase tracking-wide">
                                    {status === 'syncing' ? 'Syncing...' : `Synced ${lastSynced}`}
                                </span>
                            </div>
                        </div>
                    ) : status === 'error' ? (
                        <div className="flex items-center gap-1.5 text-terracotta mt-1">
                            <AlertCircle size={14} strokeWidth={2.5} />
                            <span className="text-xs font-bold uppercase tracking-wide">Re-auth required</span>
                        </div>
                    ) : (
                        <p className="text-sm text-main/30 font-medium">Not connected</p>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="w-full sm:w-auto mt-2 sm:mt-0">
                {isConnected ? (
                    <Button variant="ghost" className="text-main/40 hover:text-terracotta hover:bg-terracotta/5 w-full sm:w-auto" onClick={onDisconnect}>
                        Disconnect
                    </Button>
                ) : (
                    <Button onClick={onConnect} className={`w-full sm:w-auto ${status === 'error' ? 'bg-terracotta hover:bg-terracotta/80 text-white shadow-lg shadow-terracotta/20' : ''}`}>
                        {status === 'error' ? 'Fix Connection' : 'Connect Account'}
                    </Button>
                )}
            </div>
        </div>
    );
}
