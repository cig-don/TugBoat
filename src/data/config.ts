// src/data/config.ts - TugBoat Port Scanner Configuration

import { ServiceType } from "../types/port";

// Default port ranges for scanning
export const DEFAULT_PORT_RANGES: Array<[number, number]> = [
  [3000, 3010], // React/Next.js dev servers
  [4000, 4010], // Development servers
  [5000, 5010], // Flask, Express servers
  [5173, 5180], // Vite dev servers (5173 is default, but can increment)
  [8000, 8010], // Django, HTTP servers
  [9000, 9010], // Additional dev ports
];

// Common development ports
export const COMMON_DEV_PORTS = [
  1313, // Hugo
  3000, // React, Next.js
  3001, // Alternative React
  4000, // Jekyll, Gatsby
  5000, // Flask default/Mac AirPlay Receiver
  5173, // Vite default
  5174, // Vite alternate
  5175, // Vite alternate
  5176, // Vite alternate
  5177, // Vite alternate
  5178, // Vite alternate
  5179, // Vite alternate
  5180, // Vite alternate
  7000, // Mac AirPlay Receiver
  8000, // Django, Python HTTP server
  8080, // Tomcat, alternative HTTP
  8888, // Jupyter
  9000, // PHP-FPM
];

// Platform detection
export const getPlatform = (): string => {
  if (typeof navigator !== 'undefined') {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('mac')) return 'darwin';
    if (userAgent.includes('win')) return 'win32';
    if (userAgent.includes('linux')) return 'linux';
  }
  return 'unknown';
};

// macOS-specific port mappings
export const MACOS_SYSTEM_PORTS: Record<number, ServiceType> = {
  5000: "airplay-receiver", // AirPlay Receiver
  7000: "airplay-receiver", // AirPlay Receiver (Control)
};

// Service type detection patterns
export const SERVICE_PATTERNS: Record<string, ServiceType> = {
  react: "react-dev",
  vite: "vite-dev",
  next: "nextjs",
  express: "express-api",
  django: "express-api",
  flask: "express-api",
  webpack: "webpack-dev",
  apache: "static-server",
  nginx: "static-server",
  adminer: "database-admin",
  phpmyadmin: "database-admin",
  airplay: "airplay-receiver",
};

// Service type labels for display
export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  "react-dev": "React Dev",
  nextjs: "Next.js",
  "vite-dev": "Vite Dev",
  "express-api": "Express API",
  "webpack-dev": "Webpack Dev",
  "static-server": "Static Server",
  "database-admin": "DB Admin",
  "airplay-receiver": "AirPlay Receiver",
  unknown: "Unknown",
};

// Default scan settings
export const DEFAULT_SCAN_SETTINGS = {
  autoRefresh: true,
  refreshInterval: 30, // seconds
  enableNotifications: true,
  scanTimeout: 5000, // milliseconds
  maxConcurrentScans: 10,
};

// Port status color configurations
export const PORT_STATUS_COLORS = {
  online: "bg-cyan-500 shadow-cyan-500/50",
  offline: "bg-red-500 shadow-red-500/50",
  testing: "bg-yellow-500 shadow-yellow-500/50 animate-pulse",
  error: "bg-red-500 shadow-red-500/50",
} as const;

// Animation durations (in milliseconds)
export const ANIMATION_DURATIONS = {
  cardHover: 300,
  statusChange: 200,
  scan: 2000,
  glow: 2000,
} as const;
