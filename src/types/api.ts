// API response interfaces for TugBoat Port Scanner

import { ServiceStatus, ServiceTestResult, PortScanResult } from './port';

// Base API response wrapper
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
  requestId?: string;
}

// Port scanning API responses
export interface PortListResponse extends ApiResponse<PortScanResult> {
  data: PortScanResult;
}

export interface PortTestResponse extends ApiResponse<ServiceTestResult> {
  data: ServiceTestResult;
}

export interface PortScanStatusResponse extends ApiResponse<{
  isScanning: boolean;
  progress?: number;
  currentPort?: number;
  estimatedTimeRemaining?: number;
}> {}

// Health check response
export interface HealthCheckResponse extends ApiResponse<{
  status: 'healthy' | 'degraded' | 'unhealthy';
  uptime: number;
  version: string;
  systemInfo: {
    platform: string;
    nodeVersion: string;
    memoryUsage: {
      rss: number;
      heapTotal: number;
      heapUsed: number;
    };
  };
}> {}

// Configuration API responses
export interface ConfigResponse extends ApiResponse<{
  portRanges: Array<[number, number]>;
  excludedPorts: number[];
  scanTimeout: number;
  maxConcurrentScans: number;
  enableSystemScan: boolean;
}> {}

// WebSocket message types
export interface WebSocketMessage {
  type: 'port:status-change' | 'scan:complete' | 'scan:progress' | 'service:detected' | 'error';
  timestamp: string;
  data: unknown;
}

export interface PortStatusChangeMessage extends WebSocketMessage {
  type: 'port:status-change';
  data: {
    port: number;
    status: ServiceStatus;
  };
}

export interface ScanCompleteMessage extends WebSocketMessage {
  type: 'scan:complete';
  data: {
    totalPorts: number;
    onlinePorts: number;
    scanDuration: number;
    ports: ServiceStatus[];
  };
}

export interface ScanProgressMessage extends WebSocketMessage {
  type: 'scan:progress';
  data: {
    current: number;
    total: number;
    currentPort?: number;
    percentage: number;
  };
}

export interface ServiceDetectedMessage extends WebSocketMessage {
  type: 'service:detected';
  data: {
    port: number;
    serviceType: string;
    confidence: number;
    headers?: Record<string, string>;
  };
}

export interface ErrorMessage extends WebSocketMessage {
  type: 'error';
  data: {
    code: string;
    message: string;
    details?: unknown;
  };
}

// API endpoint interfaces
export interface ApiEndpoints {
  // Port scanning
  getPorts: () => Promise<PortListResponse>;
  testPort: (port: number) => Promise<PortTestResponse>;
  scanPortRange: (start: number, end: number) => Promise<PortListResponse>;
  scanSpecificPorts: (ports: number[]) => Promise<PortListResponse>;
  getScanStatus: () => Promise<PortScanStatusResponse>;
  
  // Configuration
  getConfig: () => Promise<ConfigResponse>;
  updateConfig: (config: Partial<ConfigResponse['data']>) => Promise<ConfigResponse>;
  
  // Health
  healthCheck: () => Promise<HealthCheckResponse>;
}

// Request interfaces
export interface ScanRequest {
  range?: [number, number];
  ports?: number[];
  scanType: 'http' | 'system' | 'both';
  timeout?: number;
}

export interface ConfigUpdateRequest {
  portRanges?: Array<[number, number]>;
  excludedPorts?: number[];
  scanTimeout?: number;
  maxConcurrentScans?: number;
  enableSystemScan?: boolean;
}

// Error response interfaces
export interface ApiError extends Error {
  status?: number;
  code?: string;
  details?: unknown;
}

export interface ValidationError extends ApiError {
  field: string;
  value: unknown;
  constraint: string;
}

// HTTP client configuration
export interface ApiClientConfig {
  baseURL: string;
  timeout: number;
  retries: number;
  retryDelay: number;
  headers?: Record<string, string>;
}