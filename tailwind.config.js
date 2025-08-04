/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ["Orbitron", "monospace"],
        mono: ["JetBrains Mono", "Fira Code", "Monaco", "Consolas", "monospace"],
      },
      colors: {
        // Oblivion-inspired color palette
        oblivion: {
          bg: {
            primary: "#0f1419",
            secondary: "#1a1f2e", 
            tertiary: "#252a3a",
            glass: "rgba(15, 20, 25, 0.8)",
          },
          cyan: {
            50: "#e0f7ff",
            100: "#b3ecff",
            200: "#80deea",
            300: "#4dd0e1",
            400: "#26c6da",
            500: "#00d4ff", // Primary cyan
            600: "#00acc1",
            700: "#0097a7",
            800: "#00838f",
            900: "#006064",
          },
          blue: {
            400: "#64b5f6",
            500: "#42a5f5",
            600: "#2196f3",
          },
          gray: {
            50: "#f8fafc",
            100: "#f1f5f9",
            200: "#e2e8f0",
            300: "#cbd5e1",
            400: "#94a3b8",
            500: "#64748b",
            600: "#475569",
            700: "#334155",
            800: "#1e293b",
            900: "#0f172a",
          },
          red: {
            400: "#ef4444",
            500: "#dc2626",
          },
          green: {
            400: "#10b981",
            500: "#059669",
          },
          yellow: {
            400: "#fbbf24",
            500: "#f59e0b",
          },
        },
      },
      backgroundImage: {
        'oblivion-gradient': 'linear-gradient(135deg, #0f1419 0%, #1a1f2e 50%, #0f1419 100%)',
        'oblivion-glow': 'radial-gradient(circle at center, rgba(0, 212, 255, 0.1) 0%, transparent 70%)',
        'card-gradient': 'linear-gradient(145deg, rgba(26, 31, 46, 0.8) 0%, rgba(15, 20, 25, 0.8) 100%)',
      },
      boxShadow: {
        'oblivion-glow': '0 0 20px rgba(0, 212, 255, 0.3)',
        'oblivion-glow-lg': '0 0 40px rgba(0, 212, 255, 0.4)',
        'card-oblivion': '0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 212, 255, 0.1)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'scan': 'scan 2s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { 
            boxShadow: '0 0 5px rgba(0, 212, 255, 0.5), 0 0 10px rgba(0, 212, 255, 0.3)' 
          },
          '100%': { 
            boxShadow: '0 0 20px rgba(0, 212, 255, 0.8), 0 0 30px rgba(0, 212, 255, 0.5)' 
          },
        },
        scan: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
