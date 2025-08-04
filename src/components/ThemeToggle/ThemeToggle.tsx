import React from 'react';
import { useTheme } from '../../context/GlobalContext';

interface ThemeToggleProps {
  showLabel?: boolean;
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  showLabel = false, 
  className = '' 
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showLabel && (
        <span className="text-sm text-gray-400">
          {theme === 'dark' ? 'Dark' : 'Light'}
        </span>
      )}
      
      <button
        onClick={toggleTheme}
        className="p-2 text-gray-400 hover:text-cyan-400 hover:bg-gray-800 rounded-lg transition-all duration-200 group"
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        <div className="relative w-5 h-5">
          {/* Sun icon for dark mode (switch to light) */}
          <svg 
            className={`absolute inset-0 w-full h-full transition-all duration-300 ${
              theme === 'dark' 
                ? 'opacity-100 rotate-0 scale-100' 
                : 'opacity-0 rotate-90 scale-75'
            }`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
            />
          </svg>
          
          {/* Moon icon for light mode (switch to dark) */}
          <svg 
            className={`absolute inset-0 w-full h-full transition-all duration-300 ${
              theme === 'light' 
                ? 'opacity-100 rotate-0 scale-100' 
                : 'opacity-0 -rotate-90 scale-75'
            }`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
            />
          </svg>
        </div>
        
        {/* Subtle glow effect on hover */}
        <div className="absolute inset-0 bg-cyan-400/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10"></div>
      </button>
    </div>
  );
};

export default ThemeToggle;