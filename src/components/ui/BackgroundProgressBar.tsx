import React, { useState, useEffect, useRef } from "react";

interface BackgroundProgressBarProps {
  percentage: number;
  isScanning: boolean;
}

const BackgroundProgressBar: React.FC<BackgroundProgressBarProps> = ({
  percentage,
  isScanning,
}) => {
  const [displayPercentage, setDisplayPercentage] = useState(0);
  const [visible, setVisible] = useState(false);
  const fadeTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (isScanning && percentage > 0) {
      // We're actively scanning, show progress
      setDisplayPercentage(percentage);
      setVisible(true);
      
      // Clear any existing fade timeout since we're actively scanning
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
        fadeTimeoutRef.current = null;
      }

      // When we hit 100%, start the fade out timer
      if (percentage === 100) {
        fadeTimeoutRef.current = setTimeout(() => {
          setVisible(false);
          fadeTimeoutRef.current = null;
        }, 2000);
      }
    } else if (!isScanning && visible) {
      // Scanning stopped, fade out immediately
      setVisible(false);
    }
  }, [percentage, isScanning, visible]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 rounded-lg overflow-hidden">
      <svg
        width="100%"
        height="100%"
        className={`transition-opacity duration-500 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(6, 182, 212, 0.3)" />
            <stop offset="50%" stopColor="rgba(6, 182, 212, 0.2)" />
            <stop offset="100%" stopColor="rgba(6, 182, 212, 0.1)" />
          </linearGradient>
        </defs>
        
        {/* Progress rectangle */}
        <rect
          x="0"
          y="0"
          width={`${displayPercentage}%`}
          height="100%"
          fill="url(#progressGradient)"
          rx="8"
          ry="8"
          className="transition-all duration-200 ease-out"
        />
        
        {/* Optional animated shimmer effect */}
        {isScanning && visible && (
          <rect
            x="0"
            y="0"
            width="30%"
            height="100%"
            fill="url(#shimmerGradient)"
            rx="8"
            ry="8"
            className="animate-pulse"
            style={{
              transform: `translateX(${(displayPercentage * 0.7)}%)`,
              transition: 'transform 0.3s ease-out'
            }}
          />
        )}
        
        <defs>
          <linearGradient id="shimmerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(6, 182, 212, 0.0)" />
            <stop offset="50%" stopColor="rgba(6, 182, 212, 0.3)" />
            <stop offset="100%" stopColor="rgba(6, 182, 212, 0.0)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default BackgroundProgressBar;
