import { useState } from 'react';
import { MobileContainer } from './components/layout/MobileContainer';
import { BottomNav } from './components/layout/BottomNav';
import { OverviewView } from './views/OverviewView';
import { WorkView } from './views/WorkView';
import { HomeView } from './views/HomeView';
import { AntigravityModal } from './components/features/AntigravityModal';
import { FocusCoachView } from './views/FocusCoachView';

type ViewType = 'today' | 'work' | 'home';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <FocusCoachView />
    </div>
  );
}

export default App;
