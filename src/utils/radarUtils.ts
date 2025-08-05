// src/utils/radarUtils.ts

/**
 * Radar animation utilities for the TugBoat port scanner
 */

export interface RadarSweepState {
  angle: number;
  isActive: boolean;
  speed: number; // degrees per animation frame
}

export interface RadarSweepCallbacks {
  onSweepStart?: () => void;
  onSweepComplete?: () => void;
  onAngleChange?: (angle: number) => void;
  onLineReached?: (line: number, angle: number) => void;
  onPortDetected?: (port: number, angle: number) => void;
}

/**
 * Calculate the sweep line coordinates for a given angle
 * @param centerX - Center X coordinate of radar
 * @param centerY - Center Y coordinate of radar
 * @param radius - Radius of the sweep line
 * @param angle - Current angle in degrees (0 = 12 o'clock)
 * @returns Object with x1, y1, x2, y2 coordinates for the line
 */
export function calculateSweepLineCoordinates(
  centerX: number,
  centerY: number,
  radius: number,
  angle: number
): { x1: number; y1: number; x2: number; y2: number } {
  // Convert angle to radians and adjust for 12 o'clock start position
  const radian = ((angle - 90) * Math.PI) / 180;
  
  const x2 = centerX + radius * Math.cos(radian);
  const y2 = centerY + radius * Math.sin(radian);
  
  return {
    x1: centerX,
    y1: centerY,
    x2,
    y2
  };
}

/**
 * Create a radar sweep animation controller
 * @param initialSpeed - Initial rotation speed in degrees per frame (default: 2)
 * @returns Radar sweep controller object
 */
export function createRadarSweep(initialSpeed: number = 2) {
  let state: RadarSweepState = {
    angle: 0,
    isActive: false,
    speed: initialSpeed
  };
  
  let callbacks: RadarSweepCallbacks = {};
  let animationId: number | null = null;
  let lastTriggeredLine = -1;
  
  const animate = () => {
    if (!state.isActive) return;
    
    const previousAngle = state.angle;
    
    // Update angle
    state.angle = (state.angle + state.speed) % 360;
    
    // Trigger angle change callback
    callbacks.onAngleChange?.(state.angle);
    
    // Check if we've crossed a 10° line boundary
    const currentLine = Math.floor(state.angle / 10);
    const previousLine = Math.floor(previousAngle / 10);
    
    // Handle wrap-around at 360°/0°
    if (currentLine !== previousLine || (previousAngle > state.angle && state.angle < 10)) {
      if (currentLine !== lastTriggeredLine) {
        callbacks.onLineReached?.(currentLine, currentLine * 10);
        lastTriggeredLine = currentLine;
      }
    }
    
    // Check if we've completed a full rotation
    if (state.angle < state.speed && state.angle >= 0) {
      callbacks.onSweepComplete?.(state.angle);
      lastTriggeredLine = -1; // Reset for next rotation
    }
    
    // Continue animation
    animationId = requestAnimationFrame(animate);
  };
  
  return {
    // Start the radar sweep
    start: () => {
      if (state.isActive) {
        console.log('⚠️ Radar already active, skipping start');
        return;
      }
      
      console.log('🚀 Starting radar sweep, speed:', state.speed);
      state.isActive = true;
      callbacks.onSweepStart?.();
      animate();
    },
    
    // Stop the radar sweep
    stop: () => {
      state.isActive = false;
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    },
    
    // Reset angle to 0
    reset: () => {
      state.angle = 0;
    },
    
    // Set callbacks
    setCallbacks: (newCallbacks: RadarSweepCallbacks) => {
      callbacks = { ...callbacks, ...newCallbacks };
    },
    
    // Update speed
    setSpeed: (newSpeed: number) => {
      state.speed = newSpeed;
    },
    
    // Get current state
    getState: (): RadarSweepState => ({ ...state }),
    
    // Check if currently active
    isActive: () => state.isActive
  };
}

/**
 * Calculate fade effect for sweep trail
 * @param currentAngle - Current sweep angle
 * @param targetAngle - Target angle to check fade for
 * @param trailLength - Length of trail in degrees (default: 45)
 * @returns Opacity value between 0 and 1
 */
export function calculateSweepFade(
  currentAngle: number,
  targetAngle: number,
  trailLength: number = 45
): number {
  // Calculate angular difference (handling 360° wrap-around)
  let diff = currentAngle - targetAngle;
  if (diff < 0) diff += 360;
  if (diff > 180) diff = 360 - diff;
  
  // If within trail length, calculate fade
  if (diff <= trailLength) {
    return Math.max(0, 1 - (diff / trailLength));
  }
  
  return 0;
}

/**
 * Generate sweep gradient configuration for SVG
 * @param id - Unique ID for the gradient
 * @param primaryColor - Primary sweep color (default: cyan)
 * @param secondaryColor - Fade-out color (default: transparent cyan)
 * @returns Gradient configuration object
 */
export function createSweepGradientConfig(
  id: string,
  primaryColor: string = '#00d4ff',
  secondaryColor: string = 'rgba(0, 212, 255, 0)'
) {
  return {
    id,
    x1: '0%',
    y1: '0%',
    x2: '100%',
    y2: '0%',
    stops: [
      { offset: '0%', color: secondaryColor, opacity: 0 },
      { offset: '70%', color: primaryColor, opacity: 0.3 },
      { offset: '100%', color: primaryColor, opacity: 1 }
    ]
  };
}

/**
 * Easing functions for radar animations
 */
export const RadarEasing = {
  linear: (t: number) => t,
  easeIn: (t: number) => t * t,
  easeOut: (t: number) => t * (2 - t),
  easeInOut: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
};