// src/utils/util.ts

/**
 * Utility functions for port radar positioning and calculations
 */

// Constants for radar calculations
export const RADAR_CONSTANTS = {
  TOTAL_PORTS: 65535, // Total possible ports (0-65535)
  DEGREES_PER_LINE: 10, // Every 10 degrees
  TOTAL_LINES: 36, // 360 / 10 = 36 lines
  PORTS_PER_LINE: Math.ceil(65535 / 36), // ~1821 ports per line
} as const;

/**
 * Interface for port position on radar
 */
export interface PortRadarPosition {
  x: number;
  y: number;
  angle: number;
  radius: number;
  line: number;
  positionOnLine: number;
}

/**
 * Calculate which radar line (0-35) a port should be on
 * Each line represents 10 degrees, so port ranges are distributed across lines
 * @param port - Port number (0-65535)
 * @returns Line number (0-35)
 */
export function getPortLine(port: number): number {
  return Math.floor(port / RADAR_CONSTANTS.PORTS_PER_LINE) % RADAR_CONSTANTS.TOTAL_LINES;
}

/**
 * Calculate the position along a radar line (0-1) for a port
 * @param port - Port number
 * @returns Position as fraction (0-1) where 0 is center, 1 is edge
 */
export function getPortPositionOnLine(port: number): number {
  const positionInGroup = port % RADAR_CONSTANTS.PORTS_PER_LINE;
  return positionInGroup / RADAR_CONSTANTS.PORTS_PER_LINE;
}

/**
 * Convert line number to angle in degrees
 * @param line - Line number (0-35)
 * @returns Angle in degrees (0-350)
 */
export function lineToAngle(line: number): number {
  return line * RADAR_CONSTANTS.DEGREES_PER_LINE;
}

/**
 * Convert angle in degrees to radians
 * @param degrees - Angle in degrees
 * @returns Angle in radians
 */
export function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Calculate the cartesian coordinates (x, y) for a port on the radar
 * @param port - Port number
 * @param centerX - Center X coordinate of radar
 * @param centerY - Center Y coordinate of radar  
 * @param maxRadius - Maximum radius of the radar
 * @returns PortRadarPosition with x, y coordinates and metadata
 */
export function calculatePortPosition(
  port: number,
  centerX: number,
  centerY: number,
  maxRadius: number
): PortRadarPosition {
  const line = getPortLine(port);
  const positionOnLine = getPortPositionOnLine(port);
  const angle = lineToAngle(line);
  const angleInRadians = degreesToRadians(angle);
  
  // Calculate radius - start from small inner radius to avoid center clustering
  const minRadius = maxRadius * 0.2; // Start at 20% of max radius
  const radius = minRadius + (positionOnLine * (maxRadius - minRadius));
  
  // Calculate cartesian coordinates
  // Note: In SVG, angle 0 is at 3 o'clock, and we want 0 degrees at 12 o'clock
  // So we subtract 90 degrees to rotate the coordinate system
  const adjustedAngle = angleInRadians - (Math.PI / 2);
  const x = centerX + radius * Math.cos(adjustedAngle);
  const y = centerY + radius * Math.sin(adjustedAngle);
  
  return {
    x,
    y,
    angle,
    radius,
    line,
    positionOnLine
  };
}

/**
 * Get a color for a port based on its status
 * @param status - Port status ('online', 'offline', 'scanning', etc.)
 * @returns CSS color string
 */
export function getPortColor(status: string): string {
  switch (status) {
    case 'online':
      return '#00d4ff'; // Cyan
    case 'offline':
      return '#4a5568'; // Gray
    case 'scanning':
      return '#fbbf24'; // Yellow
    case 'error':
      return '#ef4444'; // Red
    default:
      return '#6b7280'; // Default gray
  }
}

/**
 * Format port number for display
 * @param port - Port number
 * @returns Formatted string
 */
export function formatPort(port: number): string {
  return port.toString();
}

/**
 * Check if two ports would visually overlap on the radar
 * @param port1 - First port number
 * @param port2 - Second port number
 * @param threshold - Distance threshold for overlap detection
 * @returns True if ports would overlap
 */
export function portsWillOverlap(
  port1: number, 
  port2: number, 
  threshold: number = 0.01
): boolean {
  const line1 = getPortLine(port1);
  const line2 = getPortLine(port2);
  const pos1 = getPortPositionOnLine(port1);
  const pos2 = getPortPositionOnLine(port2);
  
  // If on same line, check position difference
  if (line1 === line2) {
    return Math.abs(pos1 - pos2) < threshold;
  }
  
  // If on adjacent lines, check if positions are close
  if (Math.abs(line1 - line2) === 1 || Math.abs(line1 - line2) === 35) {
    return Math.abs(pos1 - pos2) < threshold;
  }
  
  return false;
}

/**
 * Interface for port cluster information
 */
export interface PortCluster {
  ports: number[];
  centerX: number;
  centerY: number;
  isCluster: boolean;
}

/**
 * Calculate distance between two points
 * @param x1 - First point X coordinate
 * @param y1 - First point Y coordinate  
 * @param x2 - Second point X coordinate
 * @param y2 - Second point Y coordinate
 * @returns Distance in pixels
 */
export function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

/**
 * Group ports into clusters based on proximity
 * @param ports - Array of port numbers
 * @param centerX - Radar center X coordinate
 * @param centerY - Radar center Y coordinate
 * @param maxRadius - Maximum radar radius
 * @param clusterThreshold - Distance threshold for clustering (default 10px)
 * @returns Array of port clusters
 */
export function clusterPorts(
  ports: number[],
  centerX: number,
  centerY: number,
  maxRadius: number,
  clusterThreshold: number = 10
): PortCluster[] {
  // Calculate positions for all ports
  const portPositions = ports.map(port => ({
    port,
    ...calculatePortPosition(port, centerX, centerY, maxRadius)
  }));

  const clusters: PortCluster[] = [];
  const processed = new Set<number>();

  for (const portPos of portPositions) {
    if (processed.has(portPos.port)) continue;

    // Find all ports within cluster threshold
    const clusterPorts = [portPos.port];
    processed.add(portPos.port);

    for (const otherPos of portPositions) {
      if (processed.has(otherPos.port)) continue;

      const distance = calculateDistance(
        portPos.x, portPos.y,
        otherPos.x, otherPos.y
      );

      if (distance <= clusterThreshold) {
        clusterPorts.push(otherPos.port);
        processed.add(otherPos.port);
      }
    }

    // Calculate cluster center (average position)
    const clusterPositions = clusterPorts.map(port => 
      calculatePortPosition(port, centerX, centerY, maxRadius)
    );
    
    const centerPos = {
      x: clusterPositions.reduce((sum, pos) => sum + pos.x, 0) / clusterPositions.length,
      y: clusterPositions.reduce((sum, pos) => sum + pos.y, 0) / clusterPositions.length
    };

    clusters.push({
      ports: clusterPorts.sort((a, b) => a - b), // Sort ports numerically
      centerX: centerPos.x,
      centerY: centerPos.y,
      isCluster: clusterPorts.length > 1
    });
  }

  return clusters;
}

/**
 * Get radar statistics for debugging
 * @param ports - Array of port numbers
 * @returns Statistics object
 */
export function getRadarStats(ports: number[]) {
  const lineDistribution = new Array(RADAR_CONSTANTS.TOTAL_LINES).fill(0);
  
  ports.forEach(port => {
    const line = getPortLine(port);
    lineDistribution[line]++;
  });
  
  return {
    totalPorts: ports.length,
    lineDistribution,
    averagePortsPerLine: ports.length / RADAR_CONSTANTS.TOTAL_LINES,
    maxPortsOnLine: Math.max(...lineDistribution),
    minPortsOnLine: Math.min(...lineDistribution)
  };
}