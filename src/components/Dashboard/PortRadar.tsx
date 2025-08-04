import React, { useState } from 'react';
import { PortCardData } from '../../types/port';
import { calculatePortPosition, getPortColor, clusterPorts, PortCluster } from '../../utils/util';
import PortSelectionRollover from './PortSelectionRollover';

interface PortRadarProps {
  ports: PortCardData[];
  selectedPort?: number;
  onPortClick?: (port: number) => void;
}

const PortRadar: React.FC<PortRadarProps> = ({ ports, selectedPort, onPortClick }) => {
  const [rolloverState, setRolloverState] = useState<{
    isVisible: boolean;
    position: { x: number; y: number };
    ports: PortCardData[];
  }>({
    isVisible: false,
    position: { x: 0, y: 0 },
    ports: []
  });

  // Make radar responsive to container width
  const size = 400; // Larger base size
  const centerX = size / 2;
  const centerY = size / 2;
  const radius1 = size * 0.15;  // 15% of size
  const radius2 = size * 0.30;  // 30% of size  
  const radius3 = size * 0.45;  // 45% of size
  const radius4 = size * 0.48;  // 48% of size (outer thick circle)
  const maxRadius = radius4; // Use outer circle as max radius for port positioning

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

  // Generate port clusters
  const generatePortClusters = () => {
    if (!ports || ports.length === 0) return [];

    // Create clusters from port data
    const portNumbers = ports.map(p => p.port);
    const clusters = clusterPorts(portNumbers, centerX, centerY, maxRadius, 10);

    return clusters.map((cluster, index) => {
      // Find port data for this cluster
      const clusterPortData = cluster.ports.map(portNum => 
        ports.find(p => p.port === portNum)!
      ).filter(Boolean);

      const hasSelectedPort = cluster.ports.includes(selectedPort || -1);
      const isCluster = cluster.isCluster;

      // For clusters, use the dominant color (most common status)
      const statusCounts = clusterPortData.reduce((acc, port) => {
        acc[port.status] = (acc[port.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const dominantStatus = Object.entries(statusCounts)
        .sort(([,a], [,b]) => b - a)[0][0];
      const dominantColor = getPortColor(dominantStatus);

      const handleClusterClick = (event: React.MouseEvent) => {
        if (isCluster) {
          // Show rollover for multiple ports
          const rect = (event.target as SVGElement).getBoundingClientRect();
          const svgRect = (event.currentTarget as SVGSVGElement).closest('svg')?.getBoundingClientRect();
          
          if (svgRect) {
            setRolloverState({
              isVisible: true,
              position: {
                x: rect.left + window.scrollX,
                y: rect.top + window.scrollY
              },
              ports: clusterPortData
            });
          }
        } else {
          // Single port, select directly
          onPortClick?.(cluster.ports[0]);
        }
      };

      return (
        <g key={`cluster-${index}`}>
          {/* Cluster/Port circle */}
          <circle
            cx={cluster.centerX}
            cy={cluster.centerY}
            r={hasSelectedPort ? 5 : 4}
            fill={isCluster ? dominantColor : "none"}
            stroke={dominantColor}
            strokeWidth={isCluster ? (hasSelectedPort ? 2 : 1) : (hasSelectedPort ? 2 : 1)}
            className="cursor-pointer transition-all duration-200"
            onClick={handleClusterClick}
            style={{
              filter: hasSelectedPort ? 'drop-shadow(0 0 8px currentColor)' : 'none',
              opacity: dominantStatus === 'online' ? 1 : 0.7
            }}
          >
            <title>
              {isCluster 
                ? `Ports: ${cluster.ports.join(', ')}`
                : `Port ${cluster.ports[0]} - ${clusterPortData[0]?.serviceType} (${clusterPortData[0]?.status})`
              }
            </title>
          </circle>

          {/* Cluster count indicator */}
          {isCluster && cluster.ports.length > 1 && (
            <text
              x={cluster.centerX}
              y={cluster.centerY}
              textAnchor="middle"
              dominantBaseline="central"
              className="text-xs font-bold pointer-events-none"
              style={{ 
                fill: isCluster ? 'white' : dominantColor,
                textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                fontSize: '10px'
              }}
            >
              {cluster.ports.length}
            </text>
          )}
          
          {/* Port label for selected single port */}
          {!isCluster && hasSelectedPort && (
            <text
              x={cluster.centerX}
              y={cluster.centerY - 12}
              textAnchor="middle"
              className="text-xs fill-white font-mono pointer-events-none"
              style={{ 
                textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
              }}
            >
              {cluster.ports[0]}
            </text>
          )}
        </g>
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
            
            {/* Port clusters */}
            {generatePortClusters()}
            
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

      {/* Port Selection Rollover */}
      <PortSelectionRollover
        ports={rolloverState.ports}
        position={rolloverState.position}
        isVisible={rolloverState.isVisible}
        selectedPort={selectedPort}
        onPortSelect={(port) => {
          onPortClick?.(port);
          setRolloverState(prev => ({ ...prev, isVisible: false }));
        }}
        onClose={() => setRolloverState(prev => ({ ...prev, isVisible: false }))}
      />
    </>
  );
};

export default PortRadar;