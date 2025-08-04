import React from 'react';
import { PortCardData } from '../../types/port';

interface PortOverviewProps {
  displayPorts: PortCardData[];
}

const PortOverview: React.FC<PortOverviewProps> = ({ displayPorts }) => {
  const allPorts = displayPorts; // Only showing online ports now
  const onlinePorts = displayPorts.filter(p => p.status === 'online');
  const testingPorts = displayPorts.filter(p => p.status === 'testing');

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-1.5 mb-8">
      <div className="backdrop-blur-sm border rounded-lg p-4" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--bg-tertiary)' }}>
        <div className="flex items-center gap-3">
          <div className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>{allPorts.length}</div>
          <div style={{ color: 'var(--text-secondary)' }}>Active Ports</div>
        </div>
      </div>
      <div className="backdrop-blur-sm border rounded-lg p-4" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--bg-tertiary)' }}>
        <div className="flex items-center gap-3">
          <div className="text-4xl font-bold" style={{ color: 'var(--accent-primary)' }}>{onlinePorts.length}</div>
          <div style={{ color: 'var(--text-secondary)' }}>Online</div>
        </div>
      </div>
      <div className="backdrop-blur-sm border rounded-lg p-4" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--bg-tertiary)' }}>
        <div className="flex items-center gap-3">
          <div className="text-4xl font-bold text-red-400">0</div>
          <div style={{ color: 'var(--text-secondary)' }}>Offline</div>
        </div>
      </div>
      <div className="backdrop-blur-sm border rounded-lg p-4" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--bg-tertiary)' }}>
        <div className="flex items-center gap-3">
          <div className="text-4xl font-bold text-yellow-400">{testingPorts.length}</div>
          <div style={{ color: 'var(--text-secondary)' }}>Testing</div>
        </div>
      </div>
    </div>
  );
};

export default PortOverview;