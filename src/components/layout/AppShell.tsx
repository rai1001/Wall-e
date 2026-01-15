import { useLocation, NavLink } from 'react-router-dom';
import { Calendar, LayoutGrid, Link2, Zap } from 'lucide-react';
import { VoiceInputButton } from '../voice/VoiceInputButton';
import { MobileLayout } from '../mobile/MobileLayout';
import { useState, useEffect } from 'react';

interface AppShellProps {
    children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
    const location = useLocation();
    const isNowMode = location.pathname === '/now';
    const isMobileSuiteRoute = ['/now', '/assistant', '/summary', '/settings'].includes(location.pathname);

    // Simple mobile detection (can be enhanced with useMediaQuery)
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Mobile Suite Mode
    if (isMobile) {
        return (
            <MobileLayout>
                {children}
            </MobileLayout>
        );
    }

    // Desktop Mode (Existing Sidebar)
    const navItems = [
        { to: '/calendar', label: 'Calendar', icon: Calendar },
        { to: '/organize', label: 'Organize', icon: LayoutGrid },
        { to: '/connections', label: 'Connections', icon: Link2 },
    ];

    return (
        <div className="min-h-screen bg-cream text-main flex flex-row">
            {/* Desktop Sidebar */}
            <aside className="w-64 flex flex-col border-r border-main/5 bg-cream p-6 fixed h-full z-10">
                <h1 className="text-3xl font-serif font-black italic text-terracotta mb-10 tracking-tight">Wall-e</h1>

                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${isActive
                                    ? 'bg-white shadow-soft text-terracotta'
                                    : 'text-main/60 hover:bg-white/50 hover:text-main'
                                }`
                            }
                        >
                            <item.icon size={20} strokeWidth={2} />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="pt-6 border-t border-main/5">
                    <NavLink
                        to="/now"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-br from-terracotta to-accent text-white shadow-lg shadow-terracotta/20 hover:scale-[1.02] transition-transform"
                    >
                        <Zap size={20} fill="currentColor" />
                        <span className="font-semibold">Ahora toca</span>
                    </NavLink>
                    <p className="text-xs text-main/30 mt-4 text-center">v1.1 - Wall-e</p>
                </div>
            </aside>

            {/* Main Content Desktop */}
            <main className="flex-1 ml-64 p-8 pb-8 max-w-7xl mx-auto w-full">
                {children}
            </main>

            {/* Voice Input (Desktop) - Mobile has it inside MobileLayout or views? Ref didn't show it, but good to keep. */}
            {!isNowMode && <VoiceInputButton />}
        </div>
    );
}
