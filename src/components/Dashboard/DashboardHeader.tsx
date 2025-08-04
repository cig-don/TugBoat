import React, { useState, useEffect } from "react";
import { usePorts } from "../../context/GlobalContext";
import { ScanProgress } from "../../services/portScanner";
import PortScan from "./PortScan";
import BackgroundProgressBar from "../ui/BackgroundProgressBar";

interface DashboardHeaderProps {
  scanProgress: ScanProgress | null;
  quickScan: () => Promise<void>;
  scanRange: (start: number, end: number) => Promise<void>;
  scanPorts: (ports: number[]) => Promise<void>;
  cancelScan: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  scanProgress, 
  quickScan,
  scanRange,
  scanPorts,
  cancelScan 
}) => {
  const { isScanning: globalIsScanning, scanError } = usePorts();

  const progressPercentage = scanProgress ? scanProgress.percentage : 0;

  // Debug logging
  console.log(
    "DashboardHeader - globalIsScanning:",
    globalIsScanning,
    "scanProgress:",
    scanProgress,
    "progressPercentage:",
    progressPercentage
  );

  return (
    <div className="mb-8">
      <div className="relative flex items-center justify-between mb-4 p-2">
        <BackgroundProgressBar percentage={progressPercentage} isScanning={globalIsScanning} />

        <h1 className="text-3xl font-bold text-white relative z-10">
          Ports
          {globalIsScanning && scanProgress && (
            <span className="text-cyan-400 text-lg ml-3">
              {scanProgress.percentage}%
            </span>
          )}
        </h1>

        <PortScan 
          quickScan={quickScan}
          scanRange={scanRange}
          scanPorts={scanPorts}
          cancelScan={cancelScan}
        />
      </div>

      {/* Error Messages */}
      {scanError && (
        <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 text-red-200 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <strong>Scan Error:</strong> {scanError}
            </div>
            <button
              onClick={() => {/* TODO: implement clearError */}}
              className="text-red-300 hover:text-red-100 ml-4"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;
