import { useState } from 'react';
import { MobileContainer } from './components/layout/MobileContainer';
import { BottomNav } from './components/layout/BottomNav';
import { OverviewView } from './views/OverviewView';
import { WorkView } from './views/WorkView';
import { HomeView } from './views/HomeView';

type ViewType = 'today' | 'work' | 'home';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('today');

  const renderView = () => {
    switch (currentView) {
      case 'today': return <OverviewView />;
      case 'work': return <WorkView />;
      case 'home': return <HomeView />;
      default: return <OverviewView />;
    }
  };

  return (
    <MobileContainer>
      <main className="flex-1 overflow-y-auto no-scrollbar">
        {renderView()}
      </main>
      <BottomNav currentView={currentView} onChange={setCurrentView} />
    </MobileContainer>
  );
}

export default App;
