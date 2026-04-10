# Architecture Overview

## System Architecture

The Real Estate Analytics & Property Management Platform follows a modern Angular architecture with clear separation of concerns.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Presentation Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Dashboard   │  │  Properties  │  │   Tenants    │      │
│  │  Components  │  │  Components  │  │  Components  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Financials  │  │ Work Orders  │  │   Reports    │      │
│  │  Components  │  │  Components  │  │  Components  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    State Management Layer                    │
│                         (NgRx Store)                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Auth   │  │Properties│  │ Tenants  │  │Financials│   │
│  │  Store   │  │  Store   │  │  Store   │  │  Store   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      Service Layer                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    Auth      │  │   Property   │  │    Tenant    │      │
│  │   Service    │  │   Service    │  │   Service    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Financial   │  │ Work Order   │  │   Realtime   │      │
│  │   Service    │  │   Service    │  │   Service    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Communication Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │     HTTP     │  │  WebSocket   │  │ Interceptors │      │
│  │    Client    │  │  Connection  │  │   (Auth)     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                       Backend API                            │
│                    (REST + WebSocket)                        │
└─────────────────────────────────────────────────────────────┘
```

## Core Architectural Patterns

### 1. Feature-Based Module Organization
Each feature is self-contained with its own components, services, and state management.

### 2. Standalone Components
All components use Angular 18 standalone architecture for better tree-shaking and lazy loading.

### 3. Reactive State Management
NgRx Store provides centralized, immutable state with predictable state transitions.

### 4. Signals for Local State
Angular Signals handle component-level reactive state for optimal performance.

### 5. OnPush Change Detection
All components use OnPush strategy to minimize change detection cycles.

## Data Flow

### Read Flow (Query)
```
Component → Selector → Store → State → Component Update
```

### Write Flow (Command)
```
Component → Action → Effect → API → Success/Failure Action → Reducer → Store Update
```

### Real-time Updates
```
WebSocket → Realtime Service → NgRx Action → Reducer → Store → Component
```

## Key Design Decisions

### State Management
- **NgRx Store**: Global application state
- **Signals**: Component-local reactive state
- **RxJS**: Async operations and event streams

### Performance Optimization
- Lazy loading for all feature modules
- Virtual scrolling for large lists
- Image lazy loading
- Debounced search (300ms)
- OnPush change detection
- TrackBy functions for *ngFor

### Security
- JWT tokens stored in localStorage
- HTTP interceptors for automatic token attachment
- Route guards for authentication/authorization
- Role-based access control (RBAC)

### Accessibility
- WCAG 2.2 Level AA compliance
- Keyboard navigation support
- ARIA labels and live regions
- Screen reader compatibility
- High contrast ratios

## Technology Stack Rationale

### Angular 18
- Standalone components for better modularity
- Signals for fine-grained reactivity
- Improved performance with esbuild
- Strong TypeScript support

### NgRx
- Predictable state management
- Time-travel debugging
- DevTools integration
- Scalable for large applications

### Tailwind CSS
- Utility-first approach
- Rapid development
- Consistent design system
- Small production bundle

### Leaflet
- Open-source mapping library
- Extensive plugin ecosystem
- Lightweight and performant
- Customizable markers and layers

### Chart.js
- Simple and flexible charting
- Responsive by default
- Good documentation
- Wide browser support

## Folder Structure Rationale

```
src/app/
├── core/              # Singleton services (auth, logging, error handling)
├── features/          # Feature modules (dashboard, properties, etc.)
├── shared/            # Reusable components, directives, pipes
├── models/            # TypeScript interfaces and types
├── services/          # Application-wide services
├── guards/            # Route guards
└── interceptors/      # HTTP interceptors
```

This structure promotes:
- Clear separation of concerns
- Easy navigation and discovery
- Scalability for large teams
- Reusability of components

## Build and Deployment

### Development
- esbuild for fast compilation
- Source maps enabled
- Hot module replacement
- Named chunks for debugging

### Production
- Minification and optimization
- Critical CSS inlining
- Output hashing for cache busting
- Tree-shaking for smaller bundles
- Lazy loading for code splitting

## Future Enhancements

- Progressive Web App (PWA) support
- Offline mode with service workers
- Advanced caching strategies
- Server-side rendering (SSR)
- Micro-frontend architecture
