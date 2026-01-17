import OnboardingPanel from './components/sprint0/OnboardingPanel';
import NowPreview from './components/sprint0/NowPreview';
import WeekPreview from './components/sprint0/WeekPreview';
import StoryPanel from './components/sprint0/StoryPanel';
import MonthPreview from './components/sprint1/MonthPreview';
import OrganizerPreview from './components/sprint1/OrganizerPreview';
import ConnectionsPreview from './components/sprint1/ConnectionsPreview';
import EventList from './components/sprint1/EventList';
import PersonalizationControls from './components/sprint1/PersonalizationControls';

export default function App() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-cream via-white to-slate-50 px-4 py-8 lg:px-10">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 lg:flex-row">
        <aside className="flex w-full flex-col gap-8 lg:w-1/3">
            <OnboardingPanel />
            <StoryPanel />
        </aside>
        <main className="flex w-full flex-col gap-8 lg:w-2/3">
            <NowPreview />
            <WeekPreview />
            <section className="grid gap-6 lg:grid-cols-2">
                <MonthPreview />
                <OrganizerPreview />
            </section>
            <ConnectionsPreview />
            <section className="grid gap-6 lg:grid-cols-2">
                <PersonalizationControls />
                <EventList />
            </section>
        </main>
    </div>
</div>
);
}
