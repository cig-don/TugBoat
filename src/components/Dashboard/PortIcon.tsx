import React, { useState } from 'react';
import { PortCardData } from '../../types/port';
import { getPortColor } from '../../utils/util';
import PortSelectionRollover from './PortSelectionRollover';

interface PortIconProps {
  x: number;
  y: number;
  ports: PortCardData[];
  isSelected?: boolean;
  onClick?: (port: number) => void;
}

interface PortIconState {
  isRolloverVisible: boolean;
  rolloverPosition: { x: number; y: number };
}

interface PortIconComponent extends React.FC<PortIconProps> {
  ping: (iconId: string, x: number, y: number, color: string) => void;
}

const PortIcon: PortIconComponent = ({ 
  x, 
  y, 
  ports, 
  isSelected = false, 
  onClick 
}) => {
  const [state, setState] = useState<PortIconState>({
    isRolloverVisible: false,
    rolloverPosition: { x: 0, y: 0 }
  });

  // Determine if this is a cluster or single port
  const isCluster = ports.length > 1;
  const isSinglePort = ports.length === 1;
  
  // Get dominant color for clusters
  const statusCounts = ports.reduce((acc, port) => {
    acc[port.status] = (acc[port.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const dominantStatus = Object.entries(statusCounts)
    .sort(([,a], [,b]) => b - a)[0][0];
  const dominantColor = getPortColor(dominantStatus);

  // Handle click events
  const handleClick = (event: React.MouseEvent) => {
    if (isSinglePort) {
      // Single port, select directly
      onClick?.(ports[0].port);
    } else {
      // Cluster, show rollover
      const rect = (event.target as SVGElement).getBoundingClientRect();
      setState({
        isRolloverVisible: true,
        rolloverPosition: {
          x: rect.left + window.scrollX,
          y: rect.top + window.scrollY
        }
      });
    }
  };

  // Close rollover
  const closeRollover = () => {
    setState(prev => ({ ...prev, isRolloverVisible: false }));
  };

  // Generate unique ID for this icon's animations
  const iconId = `port-icon-${ports.map(p => p.port).join('-')}`;

  // Note: ping animation is handled by the static method below

  // Note: ping function is exposed via static method below

  return (
    <>
      <g id={iconId} className="port-icon">
        {/* Main port circle */}
        <circle
          cx={x}
          cy={y}
          r={isSelected ? 5 : 4}
          fill={isCluster ? dominantColor : `${dominantColor}1A`}
          stroke={dominantColor}
          strokeWidth={isCluster ? (isSelected ? 2 : 1) : (isSelected ? 2 : 1)}
          className="cursor-pointer transition-all duration-200"
          onClick={handleClick}
          style={{
            filter: isSelected ? 'drop-shadow(0 0 8px currentColor)' : 'none',
            opacity: dominantStatus === 'online' ? 1 : 0.7
          }}
        >
          <title>
            {isCluster 
              ? `Ports: ${ports.map(p => p.port).join(', ')}`
              : `Port ${ports[0].port} - ${ports[0].serviceType} (${ports[0].status})`
            }
          </title>
        </circle>

        {/* Cluster count indicator */}
        {isCluster && (
          <text
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="central"
            className="text-xs font-bold pointer-events-none"
            style={{ 
              fill: 'white',
              textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
              fontSize: '10px'
            }}
          >
            {ports.length}
          </text>
        )}
        
        {/* Port label for selected single port */}
        {isSinglePort && isSelected && (
          <text
            x={x}
            y={y - 12}
            textAnchor="middle"
            className="text-xs fill-white font-mono pointer-events-none"
            style={{ 
              textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
            }}
          >
            {ports[0].port}
          </text>
        )}
      </g>

      {/* Port Selection Rollover for clusters */}
      {isCluster && (
        <PortSelectionRollover
          ports={ports}
          position={state.rolloverPosition}
          isVisible={state.isRolloverVisible}
          selectedPort={isSelected ? ports[0]?.port : undefined}
          onPortSelect={(port) => {
            onClick?.(port);
            closeRollover();
          }}
          onClose={closeRollover}
        />
      )}
    </>
  );
};

// Static method to trigger ping on any PortIcon
PortIcon.ping = (iconId: string, x: number, y: number, color: string) => {
  const pingId = `ping-${iconId}-${Date.now()}`;
  
  // Find the SVG element
  const iconElement = document.getElementById(iconId);
  const svg = iconElement?.closest('svg');
  
  if (svg) {
    const pingGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    pingGroup.id = pingId;
    
    // Create multiple ripple circles with staggered timing
    // Base radius of port icon is 4-5px, so 2x would be 8-10px max
    const baseRadius = 5;
    const maxRadius = baseRadius * 4; // 20px - larger to be more visible
    
    // Create first ripple circle programmatically
    const ripple1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    ripple1.setAttribute('cx', x.toString());
    ripple1.setAttribute('cy', y.toString());
    ripple1.setAttribute('r', baseRadius.toString());
    ripple1.setAttribute('fill', 'none');
    ripple1.setAttribute('stroke', color);
    ripple1.setAttribute('stroke-width', '2');
    ripple1.setAttribute('opacity', '0.8');
    
    // Create animations for first ripple
    const rAnim1 = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
    rAnim1.setAttribute('attributeName', 'r');
    rAnim1.setAttribute('values', `${baseRadius};${maxRadius}`);
    rAnim1.setAttribute('dur', '0.8s');
    rAnim1.setAttribute('begin', '0s');
    
    const opacityAnim1 = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
    opacityAnim1.setAttribute('attributeName', 'opacity');
    opacityAnim1.setAttribute('values', '0.8;0');
    opacityAnim1.setAttribute('dur', '0.8s');
    opacityAnim1.setAttribute('begin', '0s');
    
    ripple1.appendChild(rAnim1);
    ripple1.appendChild(opacityAnim1);
    
    // Create second ripple circle
    const ripple2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    ripple2.setAttribute('cx', x.toString());
    ripple2.setAttribute('cy', y.toString());
    ripple2.setAttribute('r', baseRadius.toString());
    ripple2.setAttribute('fill', 'none');
    ripple2.setAttribute('stroke', color);
    ripple2.setAttribute('stroke-width', '1');
    ripple2.setAttribute('opacity', '0.6');
    
    // Create animations for second ripple
    const rAnim2 = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
    rAnim2.setAttribute('attributeName', 'r');
    rAnim2.setAttribute('values', `${baseRadius};${maxRadius * 1.2}`);
    rAnim2.setAttribute('dur', '1.0s');
    rAnim2.setAttribute('begin', '0.2s');
    
    const opacityAnim2 = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
    opacityAnim2.setAttribute('attributeName', 'opacity');
    opacityAnim2.setAttribute('values', '0.6;0');
    opacityAnim2.setAttribute('dur', '1.0s');
    opacityAnim2.setAttribute('begin', '0.2s');
    
    ripple2.appendChild(rAnim2);
    ripple2.appendChild(opacityAnim2);
    
    // Add ripples to group
    pingGroup.appendChild(ripple1);
    pingGroup.appendChild(ripple2);
    
    svg.appendChild(pingGroup);
    
    // Remove ping after all animations complete (last ripple finishes at 0.2s + 1.0s = 1.2s)
    setTimeout(() => {
      const ping = document.getElementById(pingId);
      if (ping) {
        ping.remove();
      }
    }, 1200);
  }
};

export default PortIcon as PortIconComponent;