import React, { useEffect, useRef } from 'react';
import { PortCardData } from '../../types/port';
import { getPortColor } from '../../utils/util';

interface PortSelectionRolloverProps {
  ports: PortCardData[];
  position: { x: number; y: number };
  isVisible: boolean;
  selectedPort?: number;
  onPortSelect: (port: number) => void;
  onClose: () => void;
}

const PortSelectionRollover: React.FC<PortSelectionRolloverProps> = ({
  ports,
  position,
  isVisible,
  selectedPort,
  onPortSelect,
  onClose
}) => {
  const rolloverRef = useRef<HTMLDivElement>(null);

  // Close rollover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (rolloverRef.current && !rolloverRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isVisible, onClose]);

  // Close rollover on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isVisible, onClose]);

  if (!isVisible || ports.length === 0) return null;

  // Calculate rollover position to avoid going off-screen
  const adjustPosition = () => {
    const rolloverWidth = 220;
    const rolloverHeight = Math.min(ports.length * 50 + 40, 300); // Max height for scrolling
    
    let adjustedX = position.x;
    let adjustedY = position.y;

    // Adjust horizontal position
    if (position.x + rolloverWidth > window.innerWidth - 20) {
      adjustedX = position.x - rolloverWidth - 10;
    }

    // Adjust vertical position  
    if (position.y + rolloverHeight > window.innerHeight - 20) {
      adjustedY = position.y - rolloverHeight - 10;
    }

    // Make sure it doesn't go off the left or top
    adjustedX = Math.max(10, adjustedX);
    adjustedY = Math.max(10, adjustedY);

    return { x: adjustedX, y: adjustedY };
  };

  const finalPosition = adjustPosition();
  const sortedPorts = [...ports].sort((a, b) => a.port - b.port);

  return (
    <div
      ref={rolloverRef}
      className="fixed z-50 border rounded-lg shadow-xl backdrop-blur-sm"
      style={{
        left: `${finalPosition.x}px`,
        top: `${finalPosition.y}px`,
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--bg-tertiary)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1)'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b" style={{ borderColor: 'var(--bg-tertiary)' }}>
        <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
          {ports.length} Port{ports.length !== 1 ? 's' : ''} Detected
        </h3>
        <button
          onClick={onClose}
          className="p-1 rounded hover:opacity-70 transition-opacity"
          style={{ color: 'var(--text-secondary)' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Port List */}
      <div className="max-h-60 overflow-y-auto">
        {sortedPorts.map((port) => {
          const isSelected = selectedPort === port.port;
          const statusColor = getPortColor(port.status);

          return (
            <div
              key={port.port}
              onClick={() => onPortSelect(port.port)}
              className={`flex items-center gap-3 p-3 cursor-pointer transition-colors border-b last:border-b-0 ${
                isSelected ? 'bg-opacity-20' : 'hover:bg-opacity-10'
              }`}
              style={{
                backgroundColor: isSelected 
                  ? 'rgba(6, 182, 212, 0.2)' 
                  : 'transparent',
                borderColor: 'var(--bg-tertiary)'
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = 'rgba(6, 182, 212, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              {/* Status indicator */}
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: statusColor }}
              />

              {/* Port info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>
                    :{port.port}
                  </span>
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--accent-primary)' }} />
                  )}
                </div>
                <div className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                  {port.serviceType.replace('-', ' ')}
                </div>
                {port.responseTime && (
                  <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    {port.responseTime}ms
                  </div>
                )}
              </div>

              {/* Arrow indicator for selected */}
              {isSelected && (
                <div style={{ color: 'var(--accent-primary)' }}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer with count info */}
      <div className="p-2 text-center border-t" style={{ borderColor: 'var(--bg-tertiary)' }}>
        <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
          Click to highlight • ESC to close
        </div>
      </div>
    </div>
  );
};

export default PortSelectionRollover;