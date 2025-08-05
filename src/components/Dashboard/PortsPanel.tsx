import React from 'react';
import { PortCardData } from '../../types/port';
import { SERVICE_TYPE_LABELS } from '../../data/config';

interface PortsPanelProps {
  displayPorts: PortCardData[];
  selectedPort?: number;
  onPortClick?: (port: number) => void;
}

const PortsPanel: React.FC<PortsPanelProps> = ({ displayPorts, selectedPort, onPortClick }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-cyan-500 shadow-cyan-500/50';
      case 'offline':
        return 'bg-red-500 shadow-red-500/50';
      case 'testing':
        return 'bg-yellow-500 shadow-yellow-500/50 animate-pulse';
      default:
        return 'bg-gray-500 shadow-gray-500/50';
    }
  };

  const getServiceTypeLabel = (type: string) => {
    return SERVICE_TYPE_LABELS[type as keyof typeof SERVICE_TYPE_LABELS] || 'Unknown';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1.5">
      {/* Port Cards */}
      {displayPorts.map((port) => {
        const isSelected = selectedPort === port.port;
        return (
          <div
            key={port.port}
            onClick={() => onPortClick?.(port.port)}
            onDoubleClick={() => window.open(`http://localhost:${port.port}`, '_blank')}
            className="group relative backdrop-blur-sm border rounded-xl p-6 transition-all duration-300 cursor-pointer"
            style={{
              backgroundColor: isSelected ? 'rgba(6, 182, 212, 0.2)' : 'var(--bg-secondary)',
              borderColor: isSelected ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
              boxShadow: isSelected ? '0 10px 15px -3px rgba(6, 182, 212, 0.25)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (!isSelected) {
                e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                e.currentTarget.style.borderColor = 'var(--bg-tertiary)';
              }
            }}
          >
          {/* Glow effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative z-10">
            {/* Port number and status indicator */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                :{port.port}
              </div>
              <div className={`w-3 h-3 rounded-full shadow-lg ${getStatusColor(port.status)}`}></div>
            </div>

            {/* Service type */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--accent-primary)' }}></div>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {getServiceTypeLabel(port.serviceType)}
              </span>
            </div>

            {/* Response time */}
            {port.responseTime && (
              <div className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                {port.responseTime}ms
              </div>
            )}

            {/* Last checked */}
            <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              {new Date(port.lastChecked).toLocaleTimeString()}
            </div>

            {/* Favorite indicator */}
            {port.isFavorite && (
              <div className="absolute top-3 right-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              </div>
            )}
          </div>
        </div>
        );
      })}

      {/* Empty state - spans full width when no ports */}
      {displayPorts.length === 0 && (
        <div className="col-span-full text-center py-12">
          <div className="text-6xl text-gray-600 mb-4">⚡</div>
          <h3 className="text-xl font-semibold text-gray-400 mb-2">
            No active ports detected
          </h3>
          <p className="text-gray-500">
            Start some development servers to see them appear here
          </p>
        </div>
      )}
    </div>
  );
};

export default PortsPanel;