import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';

import { EventProvider } from './context/EventContext';
import { GlobalEventPanel } from './components/calendar/GlobalEventPanel';

const CalendarView = lazy(() => import('./views/CalendarView').then((mod) => ({ default: mod.CalendarView })));
const OrganizeView = lazy(() => import('./views/OrganizeView').then((mod) => ({ default: mod.OrganizeView })));
const ConnectionsView = lazy(() => import('./views/ConnectionsView').then((mod) => ({ default: mod.ConnectionsView })));
const NowView = lazy(() => import('./views/NowView').then((mod) => ({ default: mod.NowView })));
const AssistantView = lazy(() => import('./views/AssistantView').then((mod) => ({ default: mod.AssistantView })));
const DailySummaryView = lazy(() => import('./views/DailySummaryView').then((mod) => ({ default: mod.DailySummaryView })));

function App() {
    const loadingFallback = (
        <div className="flex min-h-[50vh] items-center justify-center text-sm text-main/40">
            Loading...
        </div>
    );

    return (
        <EventProvider>
            <BrowserRouter>
                <AppShell>
                    <Suspense fallback={loadingFallback}>
                        <Routes>
                            <Route path="/" element={<Navigate to="/calendar" replace />} />
                            <Route path="/calendar" element={<CalendarView />} />
                            <Route path="/organize" element={<OrganizeView />} />
                            <Route path="/connections" element={<ConnectionsView />} />
                            <Route path="/now" element={<NowView />} />
                            <Route path="/assistant" element={<AssistantView />} />
                            <Route path="/summary" element={<DailySummaryView />} />
                            <Route path="/settings" element={<div className="p-8 text-center text-stone-400">Settings Placeholder</div>} />
                        </Routes>
                    </Suspense>
                </AppShell>
                <GlobalEventPanel />
            </BrowserRouter>
        </EventProvider>
    );
}

export default App;
