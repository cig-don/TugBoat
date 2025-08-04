# Port Scanner Dashboard - Product Requirements Document

## Project Directives

- Always read PLANNING.md at the start of every new conversation
- Check TASKS.md before starting your work
- Mark completed tasks immediately after completion
- Add newly discovered tasks to TASKS.md
- Always assume a separate terminal will be used to test/view the code changes.

## Project Overview

A localhost port monitoring dashboard inspired by the Oblivion UI probe/sentry interface. The application will scan and display active development ports in a futuristic, grid-based interface with real-time status updates.

## Technical Stack

- **Frontend**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (with dark/light mode support)
- **Backend**: Node.js Express server for system-level port scanning
- **Platform**: macOS development environment

## Core Architecture

### Frontend Components

- **Main Dashboard**: Grid-based port display inspired by Oblivion probe interface
- **Port Scanner Service**: HTTP testing and service identification
- **Settings Panel**: Configuration for port ranges and scan intervals
- **Theme Toggle**: Dark/light mode switching

### Backend Service

- **Port Detection**: Uses `netstat` or `lsof` for system-level port discovery
- **API Endpoints**: RESTful endpoints for port data and configuration
- **Real-time Updates**: WebSocket or polling mechanism for live status

## Feature Requirements

### Phase 1: Core Functionality

#### Port Scanning

- [ ] Scan all active localhost ports (system-wide)
- [ ] Scan specific port list (configurable development ports)
- [ ] Default port ranges: 3000-3010, 4000-4010, 5000-5010, 8000-8010, 9000-9010
- [ ] Manual port range input
- [ ] Refresh on-demand and auto-refresh (configurable intervals)

#### Service Detection

- [ ] HTTP response testing for web services
- [ ] Basic service type identification:
  - React/Vite dev servers (detect via response headers/content)
  - Next.js applications
  - Express/API servers
  - Database admin interfaces (phpMyAdmin, Adminer, etc.)
  - Static file servers
  - Unknown/Generic services

#### Dashboard Display

- [ ] Grid layout inspired by Oblivion probe interface
- [ ] Each port displayed as a card/tile with:
  - Port number (prominent display)
  - Service status indicator (online/offline/testing)
  - Service type icon/label
  - Response time/health indicator
  - Last checked timestamp
- [ ] Color coding:
  - **Online Web Services**: Bright blue/cyan glow
  - **Online Unknown Services**: Dim blue/gray
  - **Offline/Unreachable**: Dark gray with red accent
  - **Testing/Loading**: Pulsing animation
- [ ] Hover effects with detailed service information
- [ ] Click to open service in browser (for HTTP services)

### Phase 2: Enhanced Features

#### Advanced Service Detection

- [ ] Custom service name assignment
- [ ] Service health monitoring (beyond just HTTP response)
- [ ] Process name detection (if possible from system info)
- [ ] Response time monitoring and history

#### UI Enhancements

- [ ] Search/filter functionality
- [ ] Sort options (port number, service type, status)
- [ ] Favorites/pinned services
- [ ] Compact vs detailed view modes
- [ ] Sound notifications for service status changes

#### Configuration

- [ ] Save/load port configurations
- [ ] Custom scan intervals per service
- [ ] Exclude specific ports from scanning
- [ ] Export port status reports

## Design Specifications

### Visual Theme

- **Primary**: Dark mode by default (matching Oblivion aesthetic)
- **Color Palette**:
  - Background: Dark gray/black (#0f1419, #1a1f2e)
  - Active services: Cyan/electric blue (#00d4ff, #64b5f6)
  - Inactive services: Muted gray (#4a5568)
  - Error states: Red accent (#ef4444)
  - Success states: Green accent (#10b981)
- **Typography**: Monospace for port numbers, clean sans-serif for labels
- **Lighting**: Subtle glow effects on active services

### Layout Structure

```
Header: [App Title] [Theme Toggle] [Settings] [Refresh Controls]
Main Grid: [Port Cards in responsive grid layout]
Footer: [Status bar with scan info and connection status]
```

### Port Card Design

```
┌─────────────────┐
│     :3000       │ ← Port number (large, prominent)
│   ●  React App  │ ← Status indicator + Service type
│   127ms         │ ← Response time
│   2:34 PM       │ ← Last checked
└─────────────────┘
```

## API Specifications

### Backend Endpoints

#### GET /api/ports

Returns all active ports on the system

```json
{
  "ports": [
    {
      "port": 3000,
      "pid": 12345,
      "process": "node",
      "state": "LISTEN",
      "protocol": "tcp"
    }
  ],
  "timestamp": "2025-08-03T14:30:00Z"
}
```

#### GET /api/ports/test/:port

Tests HTTP connectivity to specific port

```json
{
  "port": 3000,
  "status": "online",
  "responseTime": 127,
  "serviceType": "react-dev",
  "headers": {...},
  "timestamp": "2025-08-03T14:30:00Z"
}
```

#### POST /api/ports/scan

Triggers scan of specified port range

```json
{
  "range": [3000, 3010],
  "scanType": "http" // or "system" or "both"
}
```

### WebSocket Events (Optional)

- `port:status-change` - Real-time port status updates
- `scan:complete` - Scan completion notifications
- `service:detected` - New service detection

## Development Setup

### Project Structure

```
port-scanner/
├── src/
│   ├── components/
│   │   ├── Dashboard/
│   │   ├── PortCard/
│   │   ├── Settings/
│   │   └── ThemeToggle/
│   ├── services/
│   │   ├── portScanner.ts
│   │   └── httpTester.ts
│   ├── hooks/
│   ├── types/
│   └── utils/
├── server/
│   ├── routes/
│   ├── services/
│   └── index.js
└── docs/
```

### Development Commands

- `npm run dev` - Start frontend development server
- `npm run server` - Start backend API server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Success Metrics

### Functional Requirements

- [ ] Successfully detects all active localhost ports
- [ ] Accurately identifies common development services
- [ ] Responsive grid layout works on different screen sizes
- [ ] Theme switching works properly
- [ ] Real-time updates reflect actual port status changes

### Performance Requirements

- [ ] Initial port scan completes within 3 seconds
- [ ] HTTP service tests complete within 1 second per port
- [ ] UI updates smoothly without blocking interactions
- [ ] Memory usage remains reasonable during continuous scanning

### User Experience

- [ ] Intuitive interface requiring minimal learning
- [ ] Visual feedback for all user actions
- [ ] Reliable service detection with minimal false positives
- [ ] Fast access to running development services

## Future Considerations

- Integration with Docker container port mapping
- Remote server monitoring capabilities
- Service dependency mapping
- Performance metrics tracking
- Integration with development workflow tools

## Memory Log

- Added PLANNING.md and TASKS.md files
- UI clean up and prep
- Add scanning and port components to the dashboard
- Updated Progress Bar to be inline with DashboardHeader
- Scan updates
- Added PortRadar component
- UI/mode fixes and port config updates
- Added cluster port icon, mouse over and modal selection display

---

**Note**: This PRD focuses on localhost development use cases. The Oblivion-inspired UI should balance aesthetic appeal with functional clarity for developer productivity.