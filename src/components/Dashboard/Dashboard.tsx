import React, { useEffect, useState } from 'react';
import { usePorts, useUI } from '../../context/GlobalContext';
import { usePortScanner } from '../../hooks/usePortScanner';
import DashboardHeader from './DashboardHeader';
import PortOverview from './PortOverview';
import PortsPanel from './PortsPanel';
import PortRadar from './PortRadar';

const Dashboard: React.FC = () => {
  const { ports } = usePorts();
  const { searchQuery } = useUI();
  const { quickScan, activeScan, isActiveScanning, scanRange, scanPorts, cancelScan, scanProgress } = usePortScanner();
  const [selectedPort, setSelectedPort] = useState<number | undefined>();

  // Auto-run quick scan on component mount (but not during active scanning)
  useEffect(() => {
    if (ports.length === 0 && !isActiveScanning) {
      console.log('🔄 Dashboard: Auto-triggering quickScan because ports are empty');
      quickScan();
    }
  }, []);

  // Debug port changes
  useEffect(() => {
    console.log(`📊 Dashboard: Port count changed to ${ports.length}`, ports.map(p => p.port));
  }, [ports]);

  // Filter ports - only show online ports and apply search query
  const filteredPorts = ports.filter(port => {
    // Only show online ports
    if (port.status !== 'online') return false;
    
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      port.port.toString().includes(query) ||
      port.serviceType.toLowerCase().includes(query) ||
      (port.customName && port.customName.toLowerCase().includes(query))
    );
  });

  const displayPorts = filteredPorts;

  const handlePortClick = (port: number) => {
    setSelectedPort(port === selectedPort ? undefined : port);
  };

  return (
    <main 
      className="flex-1 overflow-y-auto p-8"
      style={{
        background: `linear-gradient(to bottom right, var(--bg-primary), var(--bg-secondary), var(--bg-primary))`
      }}
    >
      <div className="max-w-7xl mx-auto">
        <DashboardHeader 
          scanProgress={scanProgress} 
          quickScan={quickScan}
          activeScan={activeScan}
          isActiveScanning={isActiveScanning}
          scanRange={scanRange}
          scanPorts={scanPorts}
          cancelScan={cancelScan}
        />
        <PortOverview displayPorts={displayPorts} />
        
        {/* Main content area with radar and ports */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PortRadar 
            ports={displayPorts} 
            selectedPort={selectedPort}
            isActiveScanning={isActiveScanning}
            onPortClick={handlePortClick}
          />
          <PortsPanel 
            displayPorts={displayPorts} 
            selectedPort={selectedPort}
            onPortClick={handlePortClick}
          />
        </div>
      </div>
    </main>
  );
};

export default Dashboard;