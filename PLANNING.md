# TugBoat - Port Scanner Dashboard Planning Document

## Vision Statement

TugBoat is a localhost port monitoring dashboard that transforms mundane development port management into an engaging, Oblivion-inspired interface. The application serves as a mission control center for developers, providing real-time visibility into active development services with a futuristic aesthetic that makes monitoring ports feel like commanding a space station.

**Core Value Proposition**: Eliminate the friction of tracking multiple development services by providing instant visual status of all localhost ports with intelligent service detection and one-click access.

## Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        TugBoat Client                       │
│  ┌─────────────────┐  ┌──────────────────┐  ┌─────────────┐ │
│  │   Dashboard     │  │   Port Scanner   │  │   Settings  │ │
│  │   Grid View     │  │   Service        │  │   Panel     │ │
│  └─────────────────┘  └──────────────────┘  └─────────────┘ │
│                                │                            │
│                        ┌───────▼───────┐                   │
│                        │  HTTP Client  │                   │
│                        │  (Fetch API)  │                   │
│                        └───────────────┘                   │
└─────────────────────────────────┬───────────────────────────┘
                                  │ REST API / WebSocket
┌─────────────────────────────────▼───────────────────────────┐
│                      TugBoat Server                         │
│  ┌─────────────────┐  ┌──────────────────┐  ┌─────────────┐ │
│  │   Port Scanner  │  │   HTTP Tester    │  │   Service   │ │
│  │   (lsof/netstat)│  │   Service        │  │   Detector  │ │
│  └─────────────────┘  └──────────────────┘  └─────────────┘ │
│                                │                            │
│  ┌─────────────────┐  ┌────────▼────────┐   ┌─────────────┐ │
│  │   WebSocket     │  │   REST API      │   │   Config    │ │
│  │   Server        │  │   Routes        │   │   Manager   │ │
│  └─────────────────┘  └─────────────────┘   └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
                                  │
┌─────────────────────────────────▼───────────────────────────┐
│                     macOS System Layer                      │
│     netstat • lsof • HTTP requests • Process info          │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow Architecture

```
1. System Port Discovery:
   macOS System → lsof/netstat → Port Scanner Service → API → Client

2. HTTP Service Testing:
   Client Request → HTTP Tester → Target Service → Response Analysis → Client

3. Real-time Updates:
   Background Scanner → WebSocket → Client Dashboard Updates

4. User Interactions:
   Client → REST API → System Commands → Response → Client Update
```

## Technology Stack

### Frontend Stack

- **Framework**: React 18.2+ with TypeScript 5.0+
- **Build Tool**: Vite 5.0+ (fast dev server, HMR, optimized builds)
- **Styling**: Tailwind CSS 3.4+ with custom Oblivion theme
- **State Management**: React Context + useReducer (lightweight, no external deps)
- **HTTP Client**: Native Fetch API with custom hooks
- **Real-time**: WebSocket API or Server-Sent Events
- **Dev Tools**: React DevTools, TypeScript strict mode

### Backend Stack

- **Runtime**: Node.js 18+ LTS
- **Framework**: Express.js 4.18+ (minimal, fast)
- **WebSocket**: ws library or Socket.io (for real-time updates)
- **Process Execution**: Node.js child_process for system commands
- **CORS**: cors middleware for cross-origin requests
- **Logging**: Custom lightweight logger

### System Integration

- **Port Detection**: macOS `lsof` and `netstat` commands
- **HTTP Testing**: Node.js http/https modules
- **Process Info**: macOS process system calls
- **File System**: Node.js fs for configuration persistence

### Development Tools

- **Package Manager**: npm (consistent with Node.js ecosystem)
- **Linting**: ESLint with TypeScript rules
- **Formatting**: Prettier with Tailwind plugin
- **Type Checking**: TypeScript compiler with strict mode
- **Testing**: Vitest (Vite-native testing framework)
- **Git Hooks**: Husky for pre-commit validation

## Required Tools & Dependencies

### System Prerequisites

- **macOS**: 10.15+ (for lsof/netstat compatibility)
- **Node.js**: 18.17.0+ LTS (with npm 9+)
- **Git**: 2.30+ (for version control)
- **Terminal**: Access to system commands (lsof, netstat, ps)

### Development Environment Setup

```bash
# Core development tools
node --version    # >= 18.17.0
npm --version     # >= 9.0.0
git --version     # >= 2.30.0

# System command verification
lsof -v          # Port detection
netstat -h       # Alternative port detection
ps --version     # Process information
```

### Frontend Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.0.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^8.45.0",
    "postcss": "^8.4.0",
    "prettier": "^3.0.0",
    "tailwindcss": "^3.4.0",
    "vite": "^5.0.0",
    "vitest": "^1.0.0"
  }
}
```

### Backend Dependencies

```json
{
  "dependencies": {
    "express": "^4.18.0",
    "cors": "^2.8.5",
    "ws": "^8.13.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.0",
    "@types/cors": "^2.8.0",
    "@types/ws": "^8.5.0",
    "@types/node": "^20.0.0",
    "nodemon": "^3.0.0",
    "tsx": "^4.0.0"
  }
}
```

### VS Code Extensions (Recommended)

- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- TypeScript Importer
- Prettier - Code formatter
- ESLint
- Auto Rename Tag
- Bracket Pair Colorizer

## Project Structure

```
tugboat/
├── .vscode/                    # VS Code settings
│   ├── settings.json          # Project-specific VS Code config
│   └── extensions.json        # Recommended extensions
├── client/                     # Frontend React application
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── Dashboard/     # Main grid dashboard
│   │   │   ├── PortCard/      # Individual port display
│   │   │   ├── Settings/      # Configuration panel
│   │   │   ├── ThemeToggle/   # Dark/light mode switch
│   │   │   └── Common/        # Shared UI components
│   │   ├── hooks/             # Custom React hooks
│   │   │   ├── usePortScanner.ts
│   │   │   ├── useWebSocket.ts
│   │   │   └── useTheme.ts
│   │   ├── services/          # API communication
│   │   │   ├── api.ts         # REST API client
│   │   │   └── websocket.ts   # WebSocket client
│   │   ├── types/             # TypeScript definitions
│   │   │   ├── port.ts        # Port-related types
│   │   │   └── api.ts         # API response types
│   │   ├── utils/             # Utility functions
│   │   │   ├── formatters.ts  # Data formatting
│   │   │   └── constants.ts   # App constants
│   │   ├── styles/            # Global styles
│   │   │   └── globals.css    # Tailwind imports
│   │   ├── App.tsx            # Root component
│   │   ├── main.tsx           # React entry point
│   │   └── vite-env.d.ts      # Vite type definitions
│   ├── index.html             # HTML template
│   ├── package.json           # Frontend dependencies
│   ├── tailwind.config.js     # Tailwind configuration
│   ├── tsconfig.json          # TypeScript config
│   └── vite.config.ts         # Vite configuration
├── server/                     # Backend Node.js application
│   ├── src/
│   │   ├── routes/            # Express route handlers
│   │   │   ├── ports.ts       # Port scanning endpoints
│   │   │   └── health.ts      # Health check endpoints
│   │   ├── services/          # Business logic
│   │   │   ├── portScanner.ts # System port detection
│   │   │   ├── httpTester.ts  # HTTP service testing
│   │   │   ├── serviceDetector.ts # Service type identification
│   │   │   └── websocket.ts   # WebSocket server
│   │   ├── types/             # Shared TypeScript types
│   │   │   └── port.ts        # Port data structures
│   │   ├── utils/             # Utility functions
│   │   │   ├── logger.ts      # Logging utilities
│   │   │   └── config.ts      # Configuration management
│   │   ├── middleware/        # Express middleware
│   │   │   ├── cors.ts        # CORS configuration
│   │   │   └── errorHandler.ts # Error handling
│   │   └── index.ts           # Server entry point
│   ├── package.json           # Backend dependencies
│   └── tsconfig.json          # TypeScript config
├── shared/                     # Shared code between client/server
│   └── types/                 # Common TypeScript definitions
├── docs/                       # Project documentation
│   ├── CLAUDE.md              # Project requirements (existing)
│   ├── PLANNING.md            # This file
│   ├── TASKS.md               # Task tracking
│   └── API.md                 # API documentation
├── .gitignore                 # Git ignore rules
├── .prettierrc                # Prettier configuration
├── .eslintrc.js               # ESLint configuration
├── package.json               # Root package.json (workspaces)
├── README.md                  # Project overview
└── tsconfig.json              # Root TypeScript config
```

## Development Workflow

### Environment Setup

1. **Initial Setup**:
   ```bash
   git clone <repository>
   cd tugboat
   npm install                    # Install root dependencies
   npm run setup                  # Setup client and server
   ```

2. **Development Mode**:
   ```bash
   npm run dev                    # Start both client and server
   # OR run separately:
   npm run dev:client            # Start frontend only
   npm run dev:server            # Start backend only
   ```

3. **Build & Test**:
   ```bash
   npm run build                 # Build for production
   npm run test                  # Run all tests
   npm run lint                  # Lint all code
   npm run typecheck            # TypeScript validation
   ```

### Code Quality Standards

- **TypeScript**: Strict mode enabled, no `any` types
- **ESLint**: React hooks rules, TypeScript recommended
- **Prettier**: Consistent code formatting
- **Commits**: Conventional commit messages
- **Testing**: Unit tests for utilities, integration tests for APIs

### Development Commands

```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:client\" \"npm run dev:server\"",
    "dev:client": "cd client && npm run dev",
    "dev:server": "cd server && npm run dev",
    "build": "npm run build:client && npm run build:server",
    "build:client": "cd client && npm run build",
    "build:server": "cd server && npm run build",
    "test": "npm run test:client && npm run test:server",
    "lint": "npm run lint:client && npm run lint:server",
    "typecheck": "npm run typecheck:client && npm run typecheck:server",
    "setup": "npm run setup:client && npm run setup:server",
    "clean": "rm -rf client/dist server/dist node_modules client/node_modules server/node_modules"
  }
}
```

## Success Criteria

### Technical Milestones

1. **MVP (Phase 1)**:
   - [ ] System port detection working
   - [ ] Basic HTTP service testing
   - [ ] Grid dashboard with port cards
   - [ ] Real-time status updates
   - [ ] Theme switching

2. **Enhanced Features (Phase 2)**:
   - [ ] Advanced service detection
   - [ ] Configuration persistence
   - [ ] Performance monitoring
   - [ ] Search and filtering
   - [ ] Export capabilities

### Performance Targets

- **Port Scan Speed**: < 3 seconds for full system scan
- **HTTP Test Speed**: < 1 second per port
- **UI Responsiveness**: 60fps animations, < 100ms interactions
- **Memory Usage**: < 100MB total (client + server)
- **Bundle Size**: < 500KB gzipped frontend bundle

### User Experience Goals

- **Learning Curve**: Usable within 30 seconds of first launch
- **Visual Clarity**: Port status immediately obvious at a glance
- **Accessibility**: Keyboard navigation, screen reader compatible
- **Reliability**: 99%+ accuracy in service detection
- **Developer Joy**: Make port monitoring feel engaging, not tedious

---

This planning document serves as the architectural foundation for TugBoat development. All implementation decisions should align with these technical choices and success criteria.