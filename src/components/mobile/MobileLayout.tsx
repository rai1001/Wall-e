import { NavLink } from "react-router-dom";
import { Calendar, Home, BookOpen, BarChart2, Settings } from "lucide-react";
import { clsx } from "clsx";

interface MobileLayoutProps {
    children: React.ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
    const navItems = [
        { to: "/calendar", icon: Calendar, label: "Calendar" },
        { to: "/now", icon: Home, label: "Home" },
        { to: "/assistant", icon: BookOpen, label: "Planner" },
        { to: "/summary", icon: BarChart2, label: "Stats" },
        { to: "/settings", icon: Settings, label: "Settings" },
    ];

    return (
        <div className="flex h-screen w-full flex-col bg-cream overflow-hidden relative font-body selection:bg-sage/20">
            {/* Content Area */}
            <main className="flex-1 overflow-y-auto w-full pb-32 no-scrollbar">
                {children}
            </main>

            {/* Floating Bottom Navigation */}
            <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-auto min-w-[280px] max-w-sm z-30">
                <div className="bg-main/95 backdrop-blur-xl rounded-full p-2 shadow-xl border border-white/5 mx-4 flex items-center justify-between relative">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            aria-label={item.label}
                            title={item.label}
                            className={({ isActive }) =>
                                clsx(
                                    "flex flex-col items-center justify-center w-14 h-12 rounded-full transition-all duration-300 relative z-10",
                                    isActive ? "text-terracotta bg-cream shadow-soft scale-105" : "text-white/40 hover:text-white hover:bg-white/10"
                                )
                            }
                        >
                            {({ isActive }) => (
                                <item.icon
                                    size={24}
                                    strokeWidth={isActive ? 2.5 : 2}
                                />
                            )}
                        </NavLink>
                    ))}
                </div>
            </nav>
        </div>
    );
}
