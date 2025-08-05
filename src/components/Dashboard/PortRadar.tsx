import React, { useState, useEffect, useRef } from 'react';
import { PortCardData } from '../../types/port';
import { calculatePortPosition, getPortColor, clusterPorts, getPortRangeForLine } from '../../utils/util';
import { createRadarSweep, calculateSweepLineCoordinates } from '../../utils/radarUtils';
import { portScanner } from '../../services/portScanner';
import { usePorts } from '../../context/GlobalContext';
import PortIcon from './PortIcon';

interface PortRadarProps {
  ports: PortCardData[];
  selectedPort?: number;
  isActiveScanning?: boolean;
  onPortClick?: (port: number) => void;
}

const PortRadar: React.FC<PortRadarProps> = ({ ports, selectedPort, isActiveScanning, onPortClick }) => {

  // Radar sweep animation state
  const [sweepAngle, setSweepAngle] = useState(0);
  const [, setIsSweeping] = useState(false);
  const radarSweepRef = useRef(createRadarSweep(0.2)); // 0.2 degrees per frame = 2 RPM

  // Port scanning state
  const [, setIsLineScanning] = useState(false);

  // Port scanner context for updating discovered ports
  const { mergePorts, getPortsInRange } = usePorts();



  // Make radar responsive to container width
  const size = 450; // Increased size to accommodate labels
  const centerX = size / 2;
  const centerY = size / 2;
  const radius1 = size * 0.13;  // 13% of size (adjusted for larger canvas)
  const radius2 = size * 0.27;  // 27% of size  
  const radius3 = size * 0.40;  // 40% of size
  const radius4 = size * 0.43;  // 43% of size (outer thick circle)
  const maxRadius = radius4; // Use outer circle as max radius for port positioning

  // Function to handle when radar hits a spoke
  const logSpokeHit = async (line: number) => {
    const [startPort, endPort] = getPortRangeForLine(line);
    console.log(`🎯 Radar hit spoke ${line} - scanning ports ${startPort}-${endPort}`);
    
    // Show pings for all existing ports on this line
    showPingsForPortsOnLine(line);
    
    // Start async scan for ports on this line
    scanPortsOnLine(line);
  };

  // Show ping animations for existing ports on this radar line
  const showPingsForPortsOnLine = (line: number) => {
    const [startPort, endPort] = getPortRangeForLine(line);
    
    // Find existing ports in this range - ensure ports is an array
    const portsArray = Array.isArray(ports) ? ports : [];
    console.log(`🔍 Line ${line}: Checking range ${startPort}-${endPort} against existing ports:`, portsArray.map(p => p.port));
    
    const portsOnLine = portsArray.filter(port => 
      port.port >= startPort && port.port <= endPort && port.status === 'online'
    );
    
    console.log(`📍 Line ${line}: Found ${portsOnLine.length} ports on this line:`, portsOnLine.map(p => p.port));
    
    // Create ping animations for each port using the PortIcon.ping method
    portsOnLine.forEach(port => {
      const position = calculatePortPosition(port.port, centerX, centerY, maxRadius);
      const iconId = `port-icon-${port.port}`;
      console.log(`🎯 Triggering ping for port ${port.port} with iconId: ${iconId}`);
      PortIcon.ping(iconId, position.x, position.y, getPortColor('online'));
    });
  };

  // Helper function to update master list for scanned range
  const updateMasterListForRange = (foundPorts: PortCardData[], rangeStart: number, rangeEnd: number) => {
    console.log(`📊 Updating master list: Found ${foundPorts.length} ports in range ${rangeStart}-${rangeEnd}`);
    
    const currentRangePorts = getPortsInRange(rangeStart, rangeEnd);
    console.log(`📊 Current ports in range: ${currentRangePorts.length}`, currentRangePorts.map(p => p.port));
    console.log(`📊 Found ports: ${foundPorts.length}`, foundPorts.map(p => p.port));
    
    // Use mergePorts to replace all ports in the range with found ports
    // This automatically handles add/update/delete for the specific range
    mergePorts(foundPorts, rangeStart, rangeEnd);
    
    console.log(`📊 Master list updated for range ${rangeStart}-${rangeEnd}`);
  };

  // Async function to scan ports on a line
  const scanPortsOnLine = async (line: number) => {
    setIsLineScanning(true);
    const [rangeStart, rangeEnd] = getPortRangeForLine(line);
    
    try {
      console.log(`📡 Scanning line ${line}: ports ${rangeStart}-${rangeEnd}`);
      
      // Only test ports that are likely to be active:
      // 1. Ports that are already in the master list within this range
      // 2. Common development ports within this range
      const portsToTest = new Set<number>();
      
      // Add existing ports in this range
      const currentRangePorts = getPortsInRange(rangeStart, rangeEnd);
      currentRangePorts.forEach(port => {
        portsToTest.add(port.port);
      });
      
      // Add common dev ports in this range
      const commonDevPorts = [3000, 3001, 3100, 4000, 5000, 5173, 7000, 8000, 8080, 9000];
      commonDevPorts.forEach(port => {
        if (port >= rangeStart && port <= rangeEnd) {
          portsToTest.add(port);
        }
      });
      
      console.log(`📡 Testing ${portsToTest.size} potential ports in range:`, Array.from(portsToTest));
      
      // Test the selected ports
      const scannedResults: PortCardData[] = [];
      
      for (const port of portsToTest) {
        try {
          const result = await portScanner.testPort(port, 500);
          scannedResults.push({
            ...result,
            isFavorite: false,
            isVisible: true
          });
          console.log(`🔍 Port ${port}: ${result.status}`);
        } catch {
          // Port is offline
          scannedResults.push({
            port,
            status: 'offline' as const,
            serviceType: 'unknown' as const,
            lastChecked: new Date().toISOString(),
            isFavorite: false,
            isVisible: true
          });
          console.log(`🔍 Port ${port}: offline`);
        }
      }
      
      // Show pings for online ports
      const onlinePorts = scannedResults.filter(p => p.status === 'online');
      onlinePorts.forEach(port => {
        const position = calculatePortPosition(port.port, centerX, centerY, maxRadius);
        const iconId = `port-icon-${port.port}`;
        PortIcon.ping(iconId, position.x, position.y, getPortColor('online'));
      });
      
      console.log(`📡 Line ${line} results: ${onlinePorts.length} online, ${scannedResults.length - onlinePorts.length} offline`);
      
      // Update master list for the scanned range
      updateMasterListForRange(onlinePorts, rangeStart, rangeEnd);
      
    } catch (error) {
      console.error(`Error scanning line ${line}:`, error);
    } finally {
      setIsLineScanning(false);
    }
  };


  // Initialize radar sweep animation
  useEffect(() => {
    const radarSweep = radarSweepRef.current;
    
    radarSweep.setCallbacks({
      onAngleChange: (angle) => {
        setSweepAngle(angle);
      },
      onSweepStart: () => {
        setIsSweeping(true);
      },
      onLineReached: (line) => {
        // Only log if actively scanning
        if (isActiveScanning) {
          logSpokeHit(line);
        }
      },
      onSweepComplete: () => {
        // Optional: stop after one complete rotation
        // radarSweep.stop();
        // setIsSweeping(false);
      }
    });

    // Cleanup on unmount
    return () => {
      radarSweep.stop();
    };
  }, [isActiveScanning]);

  // Control radar sweep based on active scanning state
  useEffect(() => {
    const radarSweep = radarSweepRef.current;
    
    if (isActiveScanning) {
      console.log('🎯 Starting radar sweep animation');
      radarSweep.start();
    } else {
      console.log('⏸️ Stopping radar sweep animation');
      radarSweep.stop();
      setIsSweeping(false);
    }
  }, [isActiveScanning]);


  // Generate 36 lines every 10 degrees for port positioning
  const generateRadarLines = () => {
    const lines = [];
    for (let i = 0; i < 36; i++) {
      const angle = i * 10; // 0, 10, 20, 30, ... 350 degrees
      const radian = (angle * Math.PI) / 180;
      
      // Calculate start and end points (edge to edge through center)
      const x1 = centerX - radius4 * Math.cos(radian);
      const y1 = centerY - radius4 * Math.sin(radian);
      const x2 = centerX + radius4 * Math.cos(radian);
      const y2 = centerY + radius4 * Math.sin(radian);
      
      lines.push(
        <line
          key={`line-${angle}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="rgba(6, 182, 212, 0.15)"
          strokeWidth="0.5"
        />
      );
    }
    return lines;
  };

  // Generate the animated radar sweep line
  const generateSweepLine = () => {
    const sweepLine = calculateSweepLineCoordinates(centerX, centerY, radius4, sweepAngle);
    
    return (
      <g key="radar-sweep">
        {/* Sweep gradient definition */}
        <defs>
          <linearGradient id="sweepGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(0, 212, 255, 0)" stopOpacity="0" />
            <stop offset="70%" stopColor="#00d4ff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#00d4ff" stopOpacity="1" />
          </linearGradient>
          <filter id="sweepGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Main sweep line */}
        <line
          x1={sweepLine.x1}
          y1={sweepLine.y1}
          x2={sweepLine.x2}
          y2={sweepLine.y2}
          stroke="#00d4ff"
          strokeWidth="2"
          filter="url(#sweepGlow)"
          opacity="0.9"
        />
        
        {/* Sweep line shadow/glow effect */}
        <line
          x1={sweepLine.x1}
          y1={sweepLine.y1}
          x2={sweepLine.x2}
          y2={sweepLine.y2}
          stroke="#00d4ff"
          strokeWidth="4"
          opacity="0.3"
        />
      </g>
    );
  };


  // Generate port icons using the new PortIcon component
  const generatePortIcons = () => {
    // Ensure ports is an array
    const portsArray = Array.isArray(ports) ? ports : [];
    if (portsArray.length === 0) return [];

    // Create clusters from port data
    const portNumbers = portsArray.map(p => p.port);
    const clusters = clusterPorts(portNumbers, centerX, centerY, maxRadius, 10);

    return clusters.map((cluster) => {
      // Find port data for this cluster
      const clusterPortData = cluster.ports.map(portNum => 
        portsArray.find(p => p.port === portNum)!
      ).filter(Boolean);

      const hasSelectedPort = cluster.ports.includes(selectedPort || -1);

      return (
        <PortIcon
          key={`port-icon-${cluster.ports.join('-')}`}
          x={cluster.centerX}
          y={cluster.centerY}
          ports={clusterPortData}
          isSelected={hasSelectedPort}
          onClick={onPortClick}
        />
      );
    });
  };

  return (
    <>
      <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Port Radar</h2>
        
        <div className="w-full">
          <svg 
            width="100%" 
            height="100%" 
            viewBox={`0 0 ${size} ${size}`}
            className="bg-gray-900/50 rounded-full aspect-square max-w-full"
          >
            {/* Radar circles */}
            <circle
              cx={centerX}
              cy={centerY}
              r={radius1}
              fill="none"
              stroke="rgba(6, 182, 212, 0.4)"
              strokeWidth="1"
            />
            <circle
              cx={centerX}
              cy={centerY}
              r={radius2}
              fill="none"
              stroke="rgba(6, 182, 212, 0.4)"
              strokeWidth="1"
            />
            <circle
              cx={centerX}
              cy={centerY}
              r={radius3}
              fill="none"
              stroke="rgba(6, 182, 212, 0.4)"
              strokeWidth="1"
            />
            {/* Outer thick circle */}
            <circle
              cx={centerX}
              cy={centerY}
              r={radius4}
              fill="none"
              stroke="rgba(6, 182, 212, 0.6)"
              strokeWidth="2"
            />
            
            {/* Radar lines every 10 degrees */}
            {generateRadarLines()}
            
            {/* Port icons */}
            {generatePortIcons()}
            
            {/* Animated radar sweep line - only show when actively scanning */}
            {isActiveScanning && generateSweepLine()}
            
            {/* Center dot */}
            <circle
              cx={centerX}
              cy={centerY}
              r="3"
              fill="rgba(6, 182, 212, 0.8)"
            />
          </svg>
        </div>
      </div>

    </>
  );
};

export default PortRadar;