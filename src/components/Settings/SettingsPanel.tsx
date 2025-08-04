import React, { useState } from 'react';
import { useSettings, useTheme } from '../../context/GlobalContext';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings, autoRefreshEnabled, toggleAutoRefresh } = useSettings();
  const { theme, toggleTheme } = useTheme();
  const [customPortRange, setCustomPortRange] = useState('');

  if (!isOpen) return null;

  const handleRefreshIntervalChange = (interval: number) => {
    updateSettings({ refreshInterval: interval });
  };

  const handleAddPortRange = () => {
    if (!customPortRange.trim()) return;
    
    const range = customPortRange.split('-').map(p => parseInt(p.trim()));
    if (range.length === 2 && !isNaN(range[0]) && !isNaN(range[1])) {
      const newRanges = [...settings.defaultPortRanges, [range[0], range[1]] as [number, number]];
      updateSettings({ defaultPortRanges: newRanges });
      setCustomPortRange('');
    }
  };

  const removePortRange = (index: number) => {
    const newRanges = settings.defaultPortRanges.filter((_, i) => i !== index);
    updateSettings({ defaultPortRanges: newRanges });
  };

  const handleExcludedPortsChange = (value: string) => {
    const ports = value.split(',').map(p => parseInt(p.trim())).filter(p => !isNaN(p));
    updateSettings({ excludedPorts: ports });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="border rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto" 
           style={{ 
             backgroundColor: 'var(--bg-secondary)', 
             borderColor: 'var(--bg-tertiary)' 
           }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Settings</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors hover:opacity-80"
            style={{ 
              color: 'var(--text-secondary)',
              ':hover': { 
                color: 'var(--text-primary)',
                backgroundColor: 'var(--bg-tertiary)'
              }
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Settings Content */}
        <div className="space-y-8">
          {/* Theme Settings */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Appearance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>Theme Mode</span>
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors hover:opacity-80"
                  style={{ backgroundColor: 'var(--bg-tertiary)' }}
                >
                  {theme === 'dark' ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                      <span style={{ color: 'var(--text-primary)' }}>Dark</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <span style={{ color: 'var(--text-primary)' }}>Light</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Scan Settings */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Scan Configuration</h3>
            <div className="space-y-4">
              {/* Auto Refresh */}
              <div className="flex items-center justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>Auto Refresh</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoRefreshEnabled}
                    onChange={toggleAutoRefresh}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                </label>
              </div>

              {/* Refresh Interval */}
              <div className="flex items-center justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>Refresh Interval (seconds)</span>
                <select
                  value={settings.refreshInterval}
                  onChange={(e) => handleRefreshIntervalChange(parseInt(e.target.value))}
                  className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  style={{
                    backgroundColor: 'var(--bg-tertiary)',
                    borderColor: 'var(--bg-primary)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <option value={5}>5 seconds</option>
                  <option value={10}>10 seconds</option>
                  <option value={30}>30 seconds</option>
                  <option value={60}>1 minute</option>
                  <option value={300}>5 minutes</option>
                </select>
              </div>

              {/* Notifications */}
              <div className="flex items-center justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>Enable Notifications</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enableNotifications}
                    onChange={(e) => updateSettings({ enableNotifications: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Port Range Settings */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Port Ranges</h3>
            <div className="space-y-4">
              {/* Current Port Ranges */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Default Scan Ranges
                </label>
                <div className="space-y-2">
                  {settings.defaultPortRanges.map((range, index) => (
                    <div key={index} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                      <span style={{ color: 'var(--text-primary)' }}>{range[0]} - {range[1]}</span>
                      <button
                        onClick={() => removePortRange(index)}
                        className="transition-colors hover:opacity-80"
                        style={{ color: '#ef4444' }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add New Range */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Add Port Range
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customPortRange}
                    onChange={(e) => setCustomPortRange(e.target.value)}
                    placeholder="e.g., 3000-3010"
                    className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    style={{
                      backgroundColor: 'var(--bg-tertiary)',
                      borderColor: 'var(--bg-primary)',
                      color: 'var(--text-primary)'
                    }}
                  />
                  <button
                    onClick={handleAddPortRange}
                    className="px-4 py-2 rounded-lg transition-colors hover:opacity-90"
                    style={{ 
                      backgroundColor: 'var(--accent-primary)',
                      color: 'white'
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Excluded Ports */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Excluded Ports (comma-separated)
                </label>
                <input
                  type="text"
                  value={settings.excludedPorts.join(', ')}
                  onChange={(e) => handleExcludedPortsChange(e.target.value)}
                  placeholder="e.g., 22, 80, 443"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  style={{
                    backgroundColor: 'var(--bg-tertiary)',
                    borderColor: 'var(--bg-primary)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-8 pt-6 border-t" style={{ borderColor: 'var(--bg-tertiary)' }}>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg transition-colors hover:opacity-90"
            style={{ 
              backgroundColor: 'var(--accent-primary)',
              color: 'white'
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;