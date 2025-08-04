// src/components/Footer.tsx

import { usePorts, useConnection } from "../context/GlobalContext";

const Footer = () => {
  const { ports, isScanning, lastScanTime } = usePorts();
  const { isConnected } = useConnection();

  const onlinePorts = ports.filter((p) => p.status === "online").length;
  const totalPorts = ports.length;

  return (
    <footer className="backdrop-blur-sm border-t px-6 py-3" 
            style={{ 
              backgroundColor: 'var(--bg-secondary)', 
              borderColor: 'var(--bg-tertiary)' 
            }}>
      <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-tertiary)' }}>
        {/* Left side - Status info */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-green-400" : "bg-red-400"
              }`}
            ></div>
            <span>{isConnected ? "Connected" : "Disconnected"}</span>
          </div>

          <div className="flex items-center gap-2">
            <span>Ports:</span>
            <span className="font-medium" style={{ color: 'var(--accent-primary)' }}>{onlinePorts}</span>
            <span>/</span>
            <span style={{ color: 'var(--text-primary)' }}>{totalPorts}</span>
            <span>online</span>
          </div>

          {isScanning && (
            <div className="flex items-center gap-2" style={{ color: 'var(--accent-primary)' }}>
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--accent-primary)' }}></div>
              <span>Scanning...</span>
            </div>
          )}
        </div>

        {/* Right side - App info */}
        <div className="flex items-center gap-6">
          {lastScanTime && (
            <span>
              Last scan: {new Date(lastScanTime).toLocaleTimeString()}
            </span>
          )}

          <span style={{ color: 'var(--text-tertiary)' }}>&copy; Gone3D 2025</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
