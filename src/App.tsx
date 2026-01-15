import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { CalendarView } from './views/CalendarView';
import { OrganizeView } from './views/OrganizeView';
import { ConnectionsView } from './views/ConnectionsView';
import { NowView } from './views/NowView';
import { AssistantView } from './views/AssistantView';
import { DailySummaryView } from './views/DailySummaryView';

import { EventProvider } from './context/EventContext';
import { GlobalEventPanel } from './components/calendar/GlobalEventPanel';

function App() {
    return (
        <EventProvider>
            <BrowserRouter>
                <AppShell>
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
                </AppShell>
                <GlobalEventPanel />
            </BrowserRouter>
        </EventProvider>
    );
}

export default App;
