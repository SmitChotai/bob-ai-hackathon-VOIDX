import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ShipmentTable from './components/ShipmentTable';
import FleetPanel from './components/FleetPanel';
import ColdChainPanel from './components/ColdChainPanel';
import AICopilot from './components/AICopilot';
import type { Disruption } from './types';

export type ActiveView = 'dashboard' | 'shipments' | 'fleet' | 'coldchain' | 'copilot';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [selectedDisruption, setSelectedDisruption] = useState<Disruption | null>(null);

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh', background: 'var(--color-bg)' }}>
      <Sidebar activeView={activeView} onNavigate={setActiveView} />
      <main style={{ flex: 1, overflow: 'auto', padding: '24px', marginLeft: '220px' }}>
        {activeView === 'dashboard' && (
          <Dashboard
            onDisruptionSelect={setSelectedDisruption}
            selectedDisruption={selectedDisruption}
            onNavigate={setActiveView}
          />
        )}
        {activeView === 'shipments' && (
          <ShipmentTable selectedDisruption={selectedDisruption} />
        )}
        {activeView === 'fleet' && <FleetPanel />}
        {activeView === 'coldchain' && <ColdChainPanel />}
        {activeView === 'copilot' && <AICopilot />}
      </main>
    </div>
  );
};

export default App;
