// src/data/icons.tsx - TugBoat Port Scanner Icons

import {
  Activity,
  AlertCircle,
  CheckCircle,
  Circle,
  Database,
  Globe,
  Loader2,
  MonitorSpeaker,
  Moon,
  Play,
  RefreshCw,
  Search,
  Server,
  Settings,
  Star,
  Sun,
  Wifi,
  WifiOff,
  Zap,
} from "lucide-react";

// Port Scanner specific icons
export const portScannerIcons = {
  // Status icons
  online: <CheckCircle className="w-full h-full text-cyan-400" />,
  offline: <Circle className="w-full h-full text-gray-500" />,
  testing: <Loader2 className="animate-spin w-full h-full text-yellow-400" />,
  error: <AlertCircle className="w-full h-full text-red-400" />,
  
  // Service type icons
  reactDev: <Zap className="w-full h-full text-cyan-400" />,
  nextjs: <Play className="w-full h-full text-white" />,
  expressApi: <Server className="w-full h-full text-green-400" />,
  staticServer: <Globe className="w-full h-full text-blue-400" />,
  databaseAdmin: <Database className="w-full h-full text-purple-400" />,
  unknown: <MonitorSpeaker className="w-full h-full text-gray-400" />,
  
  // Action icons
  refresh: <RefreshCw className="w-full h-full" />,
  search: <Search className="w-full h-full" />,
  settings: <Settings className="w-full h-full" />,
  activity: <Activity className="w-full h-full" />,
  
  // Connection status
  connected: <Wifi className="w-full h-full text-green-400" />,
  disconnected: <WifiOff className="w-full h-full text-red-400" />,
  
  // UI icons
  favorite: <Star className="w-full h-full text-yellow-400" />,
  favoriteFilled: <Star className="w-full h-full text-yellow-400 fill-current" />,
  
  // Theme icons
  moon: <Moon className="w-full h-full" />,
  sun: <Sun className="w-full h-full" />,
  
  // Loading
  loader: <Loader2 className="animate-spin w-full h-full" />,
} as const;

// Service type icon mapping
export const getServiceIcon = (serviceType: string) => {
  switch (serviceType) {
    case 'react-dev':
    case 'vite-dev':
      return portScannerIcons.reactDev;
    case 'nextjs':
      return portScannerIcons.nextjs;
    case 'express-api':
    case 'webpack-dev':
      return portScannerIcons.expressApi;
    case 'static-server':
      return portScannerIcons.staticServer;
    case 'database-admin':
      return portScannerIcons.databaseAdmin;
    default:
      return portScannerIcons.unknown;
  }
};

// Port status icon mapping
export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'online':
      return portScannerIcons.online;
    case 'offline':
      return portScannerIcons.offline;
    case 'testing':
      return portScannerIcons.testing;
    case 'error':
      return portScannerIcons.error;
    default:
      return portScannerIcons.offline;
  }
};

// Export individual icons for direct access
export const {
  online,
  offline,
  testing,
  error,
  reactDev,
  nextjs,
  expressApi,
  staticServer,
  databaseAdmin,
  unknown,
  refresh,
  search,
  settings,
  activity,
  connected,
  disconnected,
  favorite,
  favoriteFilled,
  moon,
  sun,
  loader,
} = portScannerIcons;
