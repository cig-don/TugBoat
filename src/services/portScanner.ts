// Frontend Port Scanner Service - No Backend Required

import { ServiceType, ServiceStatus, PortScanResult } from '../types/port';
import { DEFAULT_PORT_RANGES, COMMON_DEV_PORTS, getPlatform, MACOS_SYSTEM_PORTS } from '../data/config';

export interface ScanOptions {
  timeout?: number;
  maxConcurrent?: number;
  includeCommonPorts?: boolean;
  customPorts?: number[];
}

export interface ScanProgress {
  current: number;
  total: number;
  currentPort?: number;
  percentage: number;
  isComplete: boolean;
}

export class PortScanner {
  private abortController: AbortController | null = null;
  private progressCallback?: (progress: ScanProgress) => void;

  /**
   * Test a single port for HTTP connectivity
   */
  async testPort(port: number, timeout = 3000): Promise<ServiceStatus> {
    const startTime = Date.now();
    const testUrls = [
      `http://localhost:${port}`,
      `https://localhost:${port}`
    ];

    for (const url of testUrls) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          method: 'HEAD',
          mode: 'no-cors', // Bypass CORS for connectivity testing
          signal: controller.signal,
          cache: 'no-cache'
        });

        clearTimeout(timeoutId);
        const responseTime = Date.now() - startTime;
        
        // Try to get actual response for service detection
        const serviceType = await this.detectServiceType(url, port);

        return {
          port,
          status: 'online',
          responseTime,
          serviceType,
          lastChecked: new Date().toISOString()
        };

      } catch (error: any) {
        // Continue to next URL if this one fails
        if (error.name === 'AbortError') {
          // Timeout occurred, but this might still indicate an active port
          const responseTime = Date.now() - startTime;
          if (responseTime >= timeout * 0.9) {
            // Likely a timeout, not a closed port
            return {
              port,
              status: 'online',
              responseTime: timeout,
              serviceType: 'unknown',
              lastChecked: new Date().toISOString(),
              error: 'Timeout (service may be running)'
            };
          }
        }
      }
    }

    // Port appears to be closed or not responding
    return {
      port,
      status: 'offline',
      serviceType: 'unknown',
      lastChecked: new Date().toISOString()
    };
  }

  /**
   * Detect service type based on HTTP response headers and content
   */
  private async detectServiceType(url: string, port: number): Promise<ServiceType> {
    // Check for macOS-specific system services first
    const platform = getPlatform();
    if (platform === 'darwin' && MACOS_SYSTEM_PORTS[port]) {
      return MACOS_SYSTEM_PORTS[port];
    }

    try {
      // Try to get a proper response (not no-cors) for headers
      const response = await fetch(url, {
        method: 'GET',
        cache: 'no-cache'
      });

      const headers = response.headers;
      const serverHeader = headers.get('server')?.toLowerCase() || '';
      const poweredBy = headers.get('x-powered-by')?.toLowerCase() || '';
      
      // Try to get some content for detection
      let content = '';
      try {
        content = (await response.text()).toLowerCase();
      } catch {
        // Content reading failed, use headers only
      }

      // Vite dev server detection
      if (headers.get('x-vite') || content.includes('vite') || content.includes('/@vite/')) {
        return 'vite-dev';
      }

      // React dev server detection
      if (content.includes('react') && (content.includes('development') || port >= 3000 && port <= 3010)) {
        return 'react-dev';
      }

      // Next.js detection
      if (headers.get('x-nextjs-page') || content.includes('_next') || content.includes('next.js')) {
        return 'nextjs';
      }

      // Express server detection
      if (poweredBy.includes('express') || serverHeader.includes('express')) {
        return 'express-api';
      }

      // Webpack dev server
      if (content.includes('webpack') && content.includes('dev')) {
        return 'webpack-dev';
      }

      // Static servers
      if (serverHeader.includes('nginx') || serverHeader.includes('apache')) {
        return 'static-server';
      }

      // Database admin interfaces
      if (content.includes('phpmyadmin') || content.includes('adminer')) {
        return 'database-admin';
      }

      // Default to unknown if we can't determine
      return 'unknown';

    } catch {
      // CORS or other error, but we know something is running
      // Make educated guesses based on port number
      if (port === 3000 || port === 3001) return 'react-dev';
      if (port === 5173) return 'vite-dev';
      if (port === 8080) return 'express-api';
      if (port === 4000) return 'static-server';
      
      return 'unknown';
    }
  }

  /**
   * Scan multiple ports with progress tracking
   */
  async scanPorts(
    ports: number[],
    options: ScanOptions = {},
    onProgress?: (progress: ScanProgress) => void
  ): Promise<PortScanResult> {
    const {
      timeout = 3000,
      maxConcurrent = 5
    } = options;

    this.progressCallback = onProgress;
    this.abortController = new AbortController();

    const results: ServiceStatus[] = [];
    const total = ports.length;
    let completed = 0;

    // Process ports in batches to avoid overwhelming the browser
    for (let i = 0; i < ports.length; i += maxConcurrent) {
      if (this.abortController.signal.aborted) {
        break;
      }

      const batch = ports.slice(i, i + maxConcurrent);
      const batchPromises = batch.map(async (port) => {
        if (this.abortController?.signal.aborted) {
          return null;
        }

        const result = await this.testPort(port, timeout);
        completed++;
        
        // Report progress
        if (onProgress) {
          onProgress({
            current: completed,
            total,
            currentPort: port,
            percentage: Math.round((completed / total) * 100),
            isComplete: completed === total
          });
        }

        return result;
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults.filter(Boolean) as ServiceStatus[]);

      // Small delay between batches to prevent browser freezing
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    const scanResult: PortScanResult = {
      ports: results.map(result => ({
        port: result.port,
        state: result.status === 'online' ? 'LISTEN' : 'CLOSED',
        protocol: 'tcp' as const
      })),
      timestamp: new Date().toISOString()
    };

    return scanResult;
  }

  /**
   * Quick scan of common development ports
   */
  async quickScan(onProgress?: (progress: ScanProgress) => void): Promise<ServiceStatus[]> {
    const commonPorts = [...COMMON_DEV_PORTS];
    
    // Add ports from default ranges
    DEFAULT_PORT_RANGES.forEach(([start, end]) => {
      for (let port = start; port <= end; port++) {
        if (!commonPorts.includes(port)) {
          commonPorts.push(port);
        }
      }
    });

    const results: ServiceStatus[] = [];
    const total = commonPorts.length;
    let completed = 0;

    // Test 3 ports at a time for quick scan
    for (let i = 0; i < commonPorts.length; i += 3) {
      const batch = commonPorts.slice(i, i + 3);
      const batchPromises = batch.map(async (port) => {
        const result = await this.testPort(port, 2000); // Shorter timeout for quick scan
        completed++;
        
        if (onProgress) {
          onProgress({
            current: completed,
            total,
            currentPort: port,
            percentage: Math.round((completed / total) * 100),
            isComplete: completed === total
          });
        }

        return result;
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      // Only include online ports in quick scan results
      const onlineResults = batchResults.filter(result => result.status === 'online');
      if (onlineResults.length > 0) {
        // Found some active ports, can show immediate results
      }

      await new Promise(resolve => setTimeout(resolve, 25));
    }

    return results;
  }

  /**
   * Scan a specific port range
   */
  async scanRange(
    startPort: number,
    endPort: number,
    onProgress?: (progress: ScanProgress) => void
  ): Promise<ServiceStatus[]> {
    const ports = [];
    for (let port = startPort; port <= endPort; port++) {
      ports.push(port);
    }

    const results: ServiceStatus[] = [];
    const total = ports.length;
    let completed = 0;

    for (const port of ports) {
      if (this.abortController?.signal.aborted) {
        break;
      }

      const result = await this.testPort(port, 1500); // Fast scan for ranges
      results.push(result);
      completed++;
      
      if (onProgress) {
        onProgress({
          current: completed,
          total,
          currentPort: port,
          percentage: Math.round((completed / total) * 100),
          isComplete: completed === total
        });
      }

      // Very small delay to keep UI responsive
      if (completed % 5 === 0) {
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    }

    return results;
  }

  /**
   * Cancel ongoing scan
   */
  cancelScan(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  /**
   * Test if scanner is currently running
   */
  isScanning(): boolean {
    return this.abortController !== null && !this.abortController.signal.aborted;
  }
}

// Export singleton instance
export const portScanner = new PortScanner();