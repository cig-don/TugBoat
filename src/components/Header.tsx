// src/components/Header.tsx

import { useEffect, useState } from "react";
import { useTheme, usePorts } from "../context/GlobalContext";
import { usePortScanner } from "../hooks/usePortScanner";
import SettingsPanel from "./Settings/SettingsPanel";
import packageJson from "../../package.json";

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { isScanning, lastScanTime } = usePorts();
  const { quickScan } = usePortScanner();
  const [showSettings, setShowSettings] = useState(false);

  // Initialize theme on document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.className = theme; // Add theme as class to html element
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleRefreshClick = () => {
    quickScan();
  };

  const handleSettingsClick = () => {
    setShowSettings(!showSettings);
  };

  return (
    <>
      <header className="backdrop-blur-sm border-b px-6 py-4" 
              style={{ 
                backgroundColor: 'var(--bg-secondary)', 
                borderColor: 'var(--bg-tertiary)' 
              }}>
        <div className="flex items-center justify-between">
          {/* Left side - Logo and title */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center p-1">
                <img 
                  src="/src/assets/tugboat-logo-mono.svg" 
                  alt="TugBoat Logo" 
                  className="w-full h-full text-white"
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
              </div>
            </div>
            
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                TugBoat
                <span className="text-sm font-normal" style={{ color: 'var(--accent-primary)' }}>Port Scanner</span>
              </h1>
              <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                <span>v{packageJson.version}</span>
                {lastScanTime && (
                  <span>Last scan: {new Date(lastScanTime).toLocaleTimeString()}</span>
                )}
              </div>
            </div>
          </div>

          {/* Right side - Controls */}
          <div className="flex items-center gap-4">
            {/* Scanning indicator */}
            {isScanning && (
              <div className="flex items-center gap-2" style={{ color: 'var(--accent-primary)' }}>
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--accent-primary)' }}></div>
                <span className="text-sm">Scanning...</span>
              </div>
            )}

            {/* Refresh button */}
            <button
              onClick={handleRefreshClick}
              className="p-2 rounded-lg transition-colors duration-200"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--accent-primary)';
                e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              title="Refresh ports"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>

            {/* Settings button */}
            <button
              onClick={handleSettingsClick}
              className="p-2 rounded-lg transition-colors duration-200"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--accent-primary)';
                e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              title="Settings"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg transition-colors duration-200"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--accent-primary)';
                e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Settings Panel */}
      <SettingsPanel 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
    </>
  );
};

export default Header;
