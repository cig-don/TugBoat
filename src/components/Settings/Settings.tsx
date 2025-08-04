import React from 'react';
import { useSettings, useTheme } from '../../context/GlobalContext';
import { DEFAULT_PORT_RANGES, DEFAULT_SCAN_SETTINGS } from '../../data/config';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings } = useSettings();
  const { theme, toggleTheme } = useTheme();

  if (!isOpen) return null;

  const handleAutoRefreshToggle = () => {
    updateSettings({ autoRefresh: !settings.autoRefresh });
  };

  const handleRefreshIntervalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSettings({ refreshInterval: parseInt(e.target.value) });
  };

  const handleNotificationsToggle = () => {
    updateSettings({ enableNotifications: !settings.enableNotifications });
  };

  const resetToDefaults = () => {
    updateSettings(DEFAULT_SCAN_SETTINGS);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Settings Content */}
        <div className="space-y-6">
          {/* Appearance Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
              Appearance
            </h3>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-white font-medium">Theme</label>
                <p className="text-gray-400 text-sm">Choose between light and dark mode</p>
              </div>
              <button
                onClick={toggleTheme}
                className="btn-oblivion-outline"
              >
                {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </button>
            </div>
          </div>

          {/* Scanning Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
              Scanning
            </h3>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-white font-medium">Auto Refresh</label>
                <p className="text-gray-400 text-sm">Automatically scan ports at regular intervals</p>
              </div>
              <button
                onClick={handleAutoRefreshToggle}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.autoRefresh ? 'bg-cyan-500' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.autoRefresh ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-white font-medium">Refresh Interval</label>
                <p className="text-gray-400 text-sm">How often to automatically scan ports</p>
              </div>
              <select
                value={settings.refreshInterval}
                onChange={handleRefreshIntervalChange}
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                disabled={!settings.autoRefresh}
              >
                <option value={10}>10 seconds</option>
                <option value={30}>30 seconds</option>
                <option value={60}>1 minute</option>
                <option value={300}>5 minutes</option>
                <option value={600}>10 minutes</option>
              </select>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
              Notifications
            </h3>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-white font-medium">Enable Notifications</label>
                <p className="text-gray-400 text-sm">Get notified when port status changes</p>
              </div>
              <button
                onClick={handleNotificationsToggle}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.enableNotifications ? 'bg-cyan-500' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.enableNotifications ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Port Ranges Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
              Port Ranges
            </h3>
            
            <div className="bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-300 text-sm mb-3">Default scanning ranges:</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {DEFAULT_PORT_RANGES.map(([start, end], index) => (
                  <div key={index} className="text-cyan-400 font-mono">
                    {start} - {end}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-700">
          <button
            onClick={resetToDefaults}
            className="btn-oblivion-outline"
          >
            Reset to Defaults
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              className="btn-oblivion"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;