import React, { useState } from "react";
import { usePorts } from "../../context/GlobalContext";

interface PortScanProps {
  quickScan: () => Promise<void>;
  activeScan: () => Promise<void>;
  isActiveScanning: boolean;
  scanRange: (start: number, end: number) => Promise<void>;
  scanPorts: (ports: number[]) => Promise<void>;
  cancelScan: () => void;
}

const PortScan: React.FC<PortScanProps> = ({ 
  quickScan,
  activeScan,
  isActiveScanning,
  scanRange, 
  scanPorts, 
  cancelScan 
}) => {
  const { isScanning: globalIsScanning } = usePorts();

  const [customPort, setCustomPort] = useState("");


  // Handle custom port testing
  const handleCustomPortScan = () => {
    const port = parseInt(customPort);
    if (port && port > 0 && port < 65536) {
      scanPorts([port]);
      setCustomPort("");
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-end gap-4 opacity-50 pointer-events-none">
      {/* Scan Controls */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {globalIsScanning && (
          <button
            onClick={cancelScan}
            className="btn-oblivion-outline text-sm px-3 py-1.5"
          >
            Cancel
          </button>
        )}
        
        <button
          onClick={quickScan}
          disabled={globalIsScanning || isActiveScanning}
          className="btn-oblivion-outline text-sm px-3 py-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Quick Scan
        </button>

        <button
          onClick={activeScan}
          disabled={globalIsScanning && !isActiveScanning}
          className={`text-sm px-3 py-1.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${
            isActiveScanning 
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 rounded' 
              : 'btn-oblivion-outline'
          }`}
          title={isActiveScanning ? 'Stop active scanning with radar sweep' : 'Start active scanning with radar sweep'}
        >
          {isActiveScanning ? '⏸️ Stop' : '📡'} Active Scan
        </button>

        <button
          onClick={() => scanRange(3000, 9999)}
          disabled={globalIsScanning || isActiveScanning}
          className="btn-oblivion-outline text-sm px-3 py-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Deep Scan
        </button>
      </div>

      {/* Custom Port Input */}
      <div className="flex items-center gap-2 px-2 pointer-events-auto">
        <input
          type="number"
          placeholder="Port (e.g. 5174)"
          value={customPort}
          onChange={(e) => setCustomPort(e.target.value)}
          className="bg-gray-800 border border-gray-600 rounded px-3 py-1.5 text-sm text-white w-32 focus:border-cyan-500 focus:outline-none"
          min="1"
          max="65535"
          disabled={globalIsScanning}
        />
        <button
          onClick={handleCustomPortScan}
          disabled={
            globalIsScanning ||
            !customPort ||
            parseInt(customPort) < 1 ||
            parseInt(customPort) > 65535
          }
          className="btn-oblivion text-sm px-3 py-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Test Port
        </button>
      </div>
    </div>
  );
};

export default PortScan;
