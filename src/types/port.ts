// Port-related type definitions for TugBoat

export interface Port {
  port: number;
  pid?: number;
  process?: string;
  state: 'LISTEN' | 'ESTABLISHED' | 'CLOSED';
  protocol: 'tcp' | 'udp';
}

export interface ServiceStatus {
  port: number;
  status: 'online' | 'offline' | 'testing' | 'error';
  responseTime?: number;
  serviceType: ServiceType;
  lastChecked: string;
  headers?: Record<string, string>;
  error?: string;
}

export type ServiceType = 
  | 'react-dev'
  | 'nextjs'
  | 'express-api'
  | 'static-server'
  | 'database-admin'
  | 'airplay-receiver'
  | 'unknown'
  | 'vite-dev'
  | 'webpack-dev';

export interface PortScanResult {
  ports: Port[];
  timestamp: string;
  scanDuration?: number;
}

export interface ServiceTestResult {
  port: number;
  status: 'online' | 'offline' | 'error';
  responseTime?: number;
  serviceType: ServiceType;
  headers?: Record<string, string>;
  timestamp: string;
  error?: string;
}

export interface ScanRequest {
  range?: [number, number];
  ports?: number[];
  scanType: 'http' | 'system' | 'both';
}

export interface PortCardData extends ServiceStatus {
  isFavorite?: boolean;
  customName?: string;
  isVisible?: boolean;
}

export interface ScanSettings {
  autoRefresh: boolean;
  refreshInterval: number; // in seconds
  defaultPortRanges: Array<[number, number]>;
  excludedPorts: number[];
  enableNotifications: boolean;
  theme: 'dark' | 'light';
}