import React from 'react';
import { PortCardData } from '../../types/port';
import { getServiceIcon } from '../../data/icons';
import { SERVICE_TYPE_LABELS, PORT_STATUS_COLORS } from '../../data/config';

interface PortCardProps {
  port: PortCardData;
  onClick?: (port: number) => void;
  onFavoriteToggle?: (port: number) => void;
}

const PortCard: React.FC<PortCardProps> = ({ 
  port, 
  onClick, 
  onFavoriteToggle 
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(port.port);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFavoriteToggle) {
      onFavoriteToggle(port.port);
    }
  };

  const statusColorClass = PORT_STATUS_COLORS[port.status] || PORT_STATUS_COLORS.offline;

  return (
    <div
      className="group relative port-card"
      onClick={handleClick}
    >
      {/* Glow effect on hover */}
      <div className="port-card-glow"></div>
      
      <div className="relative z-10">
        {/* Header with port number and status */}
        <div className="flex items-center justify-between mb-4">
          <div className="port-number">
            :{port.port}
          </div>
          <div className={`w-3 h-3 rounded-full shadow-lg ${statusColorClass}`}></div>
        </div>

        {/* Service information */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-4 h-4 flex-shrink-0">
            {getServiceIcon(port.serviceType)}
          </div>
          <span className="service-label">
            {SERVICE_TYPE_LABELS[port.serviceType] || 'Unknown'}
          </span>
        </div>

        {/* Custom name if available */}
        {port.customName && (
          <div className="text-sm text-cyan-400 mb-2 font-medium">
            {port.customName}
          </div>
        )}

        {/* Response time */}
        {port.responseTime && (
          <div className="response-time mb-2">
            {port.responseTime}ms
          </div>
        )}

        {/* Last checked timestamp */}
        <div className="timestamp">
          {new Date(port.lastChecked).toLocaleTimeString()}
        </div>

        {/* Favorite indicator */}
        {port.isFavorite && (
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 w-4 h-4 text-yellow-400 hover:text-yellow-300 transition-colors"
            title="Remove from favorites"
          >
            <svg className="w-full h-full fill-current" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </button>
        )}

        {/* Error message if status is error */}
        {port.status === 'error' && port.error && (
          <div className="mt-3 p-2 bg-red-900/30 border border-red-500/30 rounded text-xs text-red-300">
            {port.error}
          </div>
        )}
      </div>
    </div>
  );
};

export default PortCard;