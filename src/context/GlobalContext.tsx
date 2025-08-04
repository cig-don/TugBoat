import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { PortCardData, ScanSettings, ServiceStatus } from '../types/port';

// Global app state interface
interface GlobalState {
  // Port scanning state
  ports: PortCardData[];
  isScanning: boolean;
  lastScanTime: string | null;
  scanError: string | null;
  
  // UI state
  theme: 'dark' | 'light';
  viewMode: 'grid' | 'list' | 'compact';
  searchQuery: string;
  sortBy: 'port' | 'status' | 'type' | 'responseTime';
  sortOrder: 'asc' | 'desc';
  
  // Settings
  settings: ScanSettings;
  
  // Selection and interaction
  selectedPorts: number[];
  favoritePorts: number[];
  
  // Real-time updates
  isConnected: boolean;
  autoRefreshEnabled: boolean;
}

// Action types for state management
type GlobalAction =
  | { type: 'SET_PORTS'; payload: PortCardData[] }
  | { type: 'UPDATE_PORT_STATUS'; payload: { port: number; status: ServiceStatus } }
  | { type: 'SET_SCANNING'; payload: boolean }
  | { type: 'SET_SCAN_ERROR'; payload: string | null }
  | { type: 'SET_LAST_SCAN_TIME'; payload: string }
  | { type: 'SET_THEME'; payload: 'dark' | 'light' }
  | { type: 'SET_VIEW_MODE'; payload: 'grid' | 'list' | 'compact' }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_SORT'; payload: { sortBy: string; sortOrder: 'asc' | 'desc' } }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<ScanSettings> }
  | { type: 'TOGGLE_PORT_SELECTION'; payload: number }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'TOGGLE_FAVORITE'; payload: number }
  | { type: 'SET_CONNECTION_STATUS'; payload: boolean }
  | { type: 'TOGGLE_AUTO_REFRESH' }
  | { type: 'RESET_STATE' };

// Default settings
const defaultSettings: ScanSettings = {
  autoRefresh: true,
  refreshInterval: 30,
  defaultPortRanges: [
    [3000, 3010],
    [4000, 4010],
    [5000, 5010],
    [8000, 8010],
    [9000, 9010]
  ],
  excludedPorts: [],
  enableNotifications: true,
  theme: 'dark'
};

// Initial state
const initialState: GlobalState = {
  ports: [],
  isScanning: false,
  lastScanTime: null,
  scanError: null,
  theme: 'dark',
  viewMode: 'grid',
  searchQuery: '',
  sortBy: 'port',
  sortOrder: 'asc',
  settings: defaultSettings,
  selectedPorts: [],
  favoritePorts: [],
  isConnected: false,
  autoRefreshEnabled: true
};

// Reducer function
function globalReducer(state: GlobalState, action: GlobalAction): GlobalState {
  switch (action.type) {
    case 'SET_PORTS':
      return {
        ...state,
        ports: action.payload,
        lastScanTime: new Date().toISOString()
      };
      
    case 'UPDATE_PORT_STATUS':
      return {
        ...state,
        ports: state.ports.map(port =>
          port.port === action.payload.port
            ? { ...port, ...action.payload.status }
            : port
        )
      };
      
    case 'SET_SCANNING':
      return {
        ...state,
        isScanning: action.payload,
        scanError: action.payload ? null : state.scanError
      };
      
    case 'SET_SCAN_ERROR':
      return {
        ...state,
        scanError: action.payload,
        isScanning: false
      };
      
    case 'SET_LAST_SCAN_TIME':
      return {
        ...state,
        lastScanTime: action.payload
      };
      
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload,
        settings: {
          ...state.settings,
          theme: action.payload
        }
      };
      
    case 'SET_VIEW_MODE':
      return {
        ...state,
        viewMode: action.payload
      };
      
    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.payload
      };
      
    case 'SET_SORT':
      return {
        ...state,
        sortBy: action.payload.sortBy as any,
        sortOrder: action.payload.sortOrder
      };
      
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload
        }
      };
      
    case 'TOGGLE_PORT_SELECTION':
      const isSelected = state.selectedPorts.includes(action.payload);
      return {
        ...state,
        selectedPorts: isSelected
          ? state.selectedPorts.filter(port => port !== action.payload)
          : [...state.selectedPorts, action.payload]
      };
      
    case 'CLEAR_SELECTION':
      return {
        ...state,
        selectedPorts: []
      };
      
    case 'TOGGLE_FAVORITE':
      const isFavorite = state.favoritePorts.includes(action.payload);
      return {
        ...state,
        favoritePorts: isFavorite
          ? state.favoritePorts.filter(port => port !== action.payload)
          : [...state.favoritePorts, action.payload],
        ports: state.ports.map(port =>
          port.port === action.payload
            ? { ...port, isFavorite: !isFavorite }
            : port
        )
      };
      
    case 'SET_CONNECTION_STATUS':
      return {
        ...state,
        isConnected: action.payload
      };
      
    case 'TOGGLE_AUTO_REFRESH':
      return {
        ...state,
        autoRefreshEnabled: !state.autoRefreshEnabled,
        settings: {
          ...state.settings,
          autoRefresh: !state.autoRefreshEnabled
        }
      };
      
    case 'RESET_STATE':
      return initialState;
      
    default:
      return state;
  }
}

// Context creation
const GlobalContext = createContext<{
  state: GlobalState;
  dispatch: React.Dispatch<GlobalAction>;
} | null>(null);

// Provider component
export function GlobalProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(globalReducer, initialState);

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
}

// Custom hook for consuming context
export function useGlobalContext() {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }
  return context;
}

// Convenience hooks for specific state slices
export function usePorts() {
  const { state, dispatch } = useGlobalContext();
  return {
    ports: state.ports,
    isScanning: state.isScanning,
    lastScanTime: state.lastScanTime,
    scanError: state.scanError,
    setPorts: (ports: PortCardData[]) => dispatch({ type: 'SET_PORTS', payload: ports }),
    updatePortStatus: (port: number, status: ServiceStatus) => 
      dispatch({ type: 'UPDATE_PORT_STATUS', payload: { port, status } }),
    setScanning: (scanning: boolean) => dispatch({ type: 'SET_SCANNING', payload: scanning }),
    setScanError: (error: string | null) => dispatch({ type: 'SET_SCAN_ERROR', payload: error })
  };
}

export function useTheme() {
  const { state, dispatch } = useGlobalContext();
  return {
    theme: state.theme,
    setTheme: (theme: 'dark' | 'light') => dispatch({ type: 'SET_THEME', payload: theme }),
    toggleTheme: () => dispatch({ 
      type: 'SET_THEME', 
      payload: state.theme === 'dark' ? 'light' : 'dark' 
    })
  };
}

export function useUI() {
  const { state, dispatch } = useGlobalContext();
  return {
    viewMode: state.viewMode,
    searchQuery: state.searchQuery,
    sortBy: state.sortBy,
    sortOrder: state.sortOrder,
    selectedPorts: state.selectedPorts,
    setViewMode: (mode: 'grid' | 'list' | 'compact') => 
      dispatch({ type: 'SET_VIEW_MODE', payload: mode }),
    setSearchQuery: (query: string) => dispatch({ type: 'SET_SEARCH_QUERY', payload: query }),
    setSort: (sortBy: string, sortOrder: 'asc' | 'desc') => 
      dispatch({ type: 'SET_SORT', payload: { sortBy, sortOrder } }),
    togglePortSelection: (port: number) => 
      dispatch({ type: 'TOGGLE_PORT_SELECTION', payload: port }),
    clearSelection: () => dispatch({ type: 'CLEAR_SELECTION' })
  };
}

export function useSettings() {
  const { state, dispatch } = useGlobalContext();
  return {
    settings: state.settings,
    updateSettings: (settings: Partial<ScanSettings>) => 
      dispatch({ type: 'UPDATE_SETTINGS', payload: settings }),
    autoRefreshEnabled: state.autoRefreshEnabled,
    toggleAutoRefresh: () => dispatch({ type: 'TOGGLE_AUTO_REFRESH' })
  };
}

export function useFavorites() {
  const { state, dispatch } = useGlobalContext();
  return {
    favoritePorts: state.favoritePorts,
    toggleFavorite: (port: number) => dispatch({ type: 'TOGGLE_FAVORITE', payload: port }),
    isFavorite: (port: number) => state.favoritePorts.includes(port)
  };
}

export function useConnection() {
  const { state, dispatch } = useGlobalContext();
  return {
    isConnected: state.isConnected,
    setConnectionStatus: (connected: boolean) => 
      dispatch({ type: 'SET_CONNECTION_STATUS', payload: connected })
  };
}