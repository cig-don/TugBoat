// Custom hook for port scanning functionality

import { useState, useCallback, useEffect } from 'react';
import { ServiceStatus } from '../types/port';
import { portScanner, ScanProgress } from '../services/portScanner';
import { usePorts } from '../context/GlobalContext';

export interface UsePortScannerResult {
  // State
  isScanning: boolean;
  scanProgress: ScanProgress | null;
  lastScanTime: Date | null;
  error: string | null;
  
  // Actions
  quickScan: () => Promise<void>;
  scanRange: (start: number, end: number) => Promise<void>;
  scanPorts: (ports: number[]) => Promise<void>;
  testSinglePort: (port: number) => Promise<ServiceStatus>;
  cancelScan: () => void;
  clearError: () => void;
}

export function usePortScanner(): UsePortScannerResult {
  const { setPorts, setScanning, setScanError } = usePorts();
  
  // Local state
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState<ScanProgress | null>(null);
  const [lastScanTime, setLastScanTime] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Progress callback for scanner
  const onProgress = useCallback((progress: ScanProgress) => {
    console.log('usePortScanner - onProgress called:', progress);
    setScanProgress(progress);
    setScanning(progress.current < progress.total);
  }, [setScanning]);

  // Quick scan of common development ports
  const quickScan = useCallback(async () => {
    try {
      setIsScanning(true);
      setScanning(true);
      setError(null);
      setScanProgress(null);

      const results = await portScanner.quickScan(onProgress);
      
      // Convert to PortCardData format and update global state
      const portData = results.map(result => ({
        ...result,
        isFavorite: false,
        isVisible: true
      }));

      setPorts(portData);
      setLastScanTime(new Date());
      
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to scan ports';
      setError(errorMessage);
      setScanError(errorMessage);
    } finally {
      setIsScanning(false);
      setScanning(false);
      setScanProgress(null);
    }
  }, [setPorts, setScanning, setScanError, onProgress]);

  // Scan a specific port range
  const scanRange = useCallback(async (start: number, end: number) => {
    try {
      setIsScanning(true);
      setScanning(true);
      setError(null);
      setScanProgress(null);

      const results = await portScanner.scanRange(start, end, onProgress);
      
      const portData = results.map(result => ({
        ...result,
        isFavorite: false,
        isVisible: true
      }));

      setPorts(portData);
      setLastScanTime(new Date());
      
    } catch (err: any) {
      const errorMessage = err.message || `Failed to scan range ${start}-${end}`;
      setError(errorMessage);
      setScanError(errorMessage);
    } finally {
      setIsScanning(false);
      setScanning(false);
      setScanProgress(null);
    }
  }, [setPorts, setScanning, setScanError, onProgress]);

  // Scan specific ports
  const scanPorts = useCallback(async (ports: number[]) => {
    try {
      setIsScanning(true);
      setScanning(true);
      setError(null);
      setScanProgress(null);

      const results: ServiceStatus[] = [];
      const total = ports.length;
      
      for (let i = 0; i < ports.length; i++) {
        const port = ports[i];
        const result = await portScanner.testPort(port);
        results.push(result);
        
        // Update progress
        onProgress({
          current: i + 1,
          total,
          currentPort: port,
          percentage: Math.round(((i + 1) / total) * 100),
          isComplete: i + 1 === total
        });
      }
      
      const portData = results.map(result => ({
        ...result,
        isFavorite: false,
        isVisible: true
      }));

      setPorts(portData);
      setLastScanTime(new Date());
      
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to scan specified ports';
      setError(errorMessage);
      setScanError(errorMessage);
    } finally {
      setIsScanning(false);
      setScanning(false);
      setScanProgress(null);
    }
  }, [setPorts, setScanning, setScanError, onProgress]);

  // Test a single port
  const testSinglePort = useCallback(async (port: number): Promise<ServiceStatus> => {
    try {
      setError(null);
      const result = await portScanner.testPort(port);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || `Failed to test port ${port}`;
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Cancel ongoing scan
  const cancelScan = useCallback(() => {
    portScanner.cancelScan();
    setIsScanning(false);
    setScanning(false);
    setScanProgress(null);
  }, [setScanning]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
    setScanError(null);
  }, [setScanError]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (portScanner.isScanning()) {
        portScanner.cancelScan();
      }
    };
  }, []);

  return {
    // State
    isScanning,
    scanProgress,
    lastScanTime,
    error,
    
    // Actions
    quickScan,
    scanRange,
    scanPorts,
    testSinglePort,
    cancelScan,
    clearError
  };
}