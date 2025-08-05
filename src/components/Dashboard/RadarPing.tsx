import React, { useEffect, useState } from 'react';

interface RadarPingProps {
  x: number;
  y: number;
  onComplete?: () => void;
  color?: string;
  duration?: number; // Duration in milliseconds
}

const RadarPing: React.FC<RadarPingProps> = ({ 
  x, 
  y, 
  onComplete, 
  color = '#00d4ff',
  duration = 1000 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [scale, setScale] = useState(1); // Start at normal size
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Create a pulse effect: grow to 2x, then shrink back to 1x
      let scaleValue;
      if (progress < 0.5) {
        // First half: grow from 1x to 2x
        const growProgress = progress * 2; // 0 to 1
        scaleValue = 1 + growProgress; // 1 to 2
      } else {
        // Second half: shrink from 2x to 1x
        const shrinkProgress = (progress - 0.5) * 2; // 0 to 1
        scaleValue = 2 - shrinkProgress; // 2 to 1
      }
      
      setScale(scaleValue);
      
      // Fade out over the entire duration
      setOpacity(1 - progress);
      
      if (progress >= 1) {
        setIsVisible(false);
        onComplete?.();
      } else {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }, [duration, onComplete]);

  if (!isVisible) return null;

  return (
    <g>
      {/* Outer glow ring */}
      <circle
        cx={x}
        cy={y}
        r={12 * scale}
        fill="none"
        stroke={color}
        strokeWidth="2"
        opacity={opacity * 0.2}
        filter="url(#pingGlow)"
      />
      
      {/* Middle glow ring */}
      <circle
        cx={x}
        cy={y}
        r={8 * scale}
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity={opacity * 0.4}
        filter="url(#pingGlow)"
      />
      
      {/* Main ping circle */}
      <circle
        cx={x}
        cy={y}
        r={5 * scale}
        fill={color}
        opacity={opacity * 0.6}
        filter="url(#pingGlow)"
      />
      
      {/* Inner core */}
      <circle
        cx={x}
        cy={y}
        r={2 * scale}
        fill="#ffffff"
        opacity={opacity * 0.8}
      />
      
      {/* SVG filters for glow effect */}
      <defs>
        <filter id="pingGlow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
    </g>
  );
};

export default RadarPing;