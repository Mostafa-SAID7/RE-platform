# Getting Started Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher (comes with Node.js)
- **Angular CLI**: Version 18.x
- **Git**: For version control

### Verify Installation

```bash
node --version    # Should be 18.x or higher
npm --version     # Should be 9.x or higher
ng version        # Should be 18.x
```

### Install Angular CLI

If you don't have Angular CLI installed:

```bash
npm install -g @angular/cli@18
```

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Mostafa-SAID7/real-estate-platform.git
cd real-estate-platform
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required dependencies including:
- Angular 18 framework
- NgRx for state management
- Tailwind CSS for styling
- Leaflet for maps
- Chart.js for visualizations
- And more...

### 3. Environment Configuration

The project comes with pre-configured environment files:

**Development** (`src/environments/environment.ts`):
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  wsUrl: 'ws://localhost:3000',
  enableDebugTools: true,
  logLevel: 'debug',
  features: {
    realTimeUpdates: true,
    analytics: false,
    notifications: true,
  },
};
```

**Production** (`src/environments/environment.prod.ts`):
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.realestate-platform.com/api',
  wsUrl: 'wss://api.realestate-platform.com',
  enableDebugTools: false,
  logLevel: 'error',
  features: {
    realTimeUpdates: true,
    analytics: true,
    notifications: true,
  },
};
```

Update these files with your actual API endpoints.

## Running the Application

### Development Server

```bash
npm start
```

Or:

```bash
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any source files.

### Development Server with Custom Port

```bash
ng serve --port 4300
```

### Development Server with Host Binding

```bash
ng serve --host 0.0.0.0
```

## Building the Application

### Development Build

```bash
npm run build
```

Or:

```bash
ng build
```

The build artifacts will be stored in the `dist/` directory.

### Production Build

```bash
npm run build -- --configuration production
```

Or:

```bash
ng build --configuration production
```

Production build includes:
- Minification
- Optimization
- Tree-shaking
- Output hashing
- Critical CSS inlining

## Testing

### Run Unit Tests

```bash
npm test
```

Or:

```bash
ng test
```

### Run Tests with Coverage

```bash
ng test --code-coverage
```

Coverage reports will be generated in the `coverage/` directory.

### Run Tests in Headless Mode

```bash
ng test --browsers=ChromeHeadless --watch=false
```

## Code Quality

### Linting

```bash
ng lint
```

### Format Code

If you have Prettier configured:

```bash
npm run format
```

## Project Structure Overview

```
real-estate-platform/
├── src/
│   ├── app/
│   │   ├── core/              # Core services and guards
│   │   ├── features/          # Feature modules
│   │   ├── shared/            # Shared components
│   │   ├── models/            # TypeScript interfaces
│   │   ├── services/          # Application services
│   │   ├── guards/            # Route guards
│   │   └── interceptors/      # HTTP interceptors
│   ├── environments/          # Environment configs
│   ├── styles.css             # Global styles
│   └── main.ts                # Application entry point
├── docs/                      # Documentation
├── angular.json               # Angular CLI configuration
├── package.json               # Dependencies
├── tailwind.config.js         # Tailwind configuration
└── tsconfig.json              # TypeScript configuration
```

## Common Commands

| Command | Description |
|---------|-------------|
| `npm start` | Start development server |
| `npm run build` | Build for development |
| `npm run build -- --configuration production` | Build for production |
| `npm test` | Run unit tests |
| `ng generate component <name>` | Generate a new component |
| `ng generate service <name>` | Generate a new service |
| `ng generate module <name>` | Generate a new module |

## Generating Components

### Generate a Standalone Component

```bash
ng generate component features/dashboard/components/kpi-card --standalone
```

### Generate a Service

```bash
ng generate service services/property
```

### Generate a Guard

```bash
ng generate guard guards/auth
```

### Generate an Interceptor

```bash
ng generate interceptor interceptors/auth
```

## Troubleshooting

### Port Already in Use

If port 4200 is already in use:

```bash
ng serve --port 4300
```

### Clear npm Cache

If you encounter dependency issues:

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

Ensure you're using TypeScript 5.5:

```bash
npm install typescript@~5.5.2 --save-dev
```

### Build Errors

Try cleaning the build cache:

```bash
rm -rf .angular
ng build
```

## Next Steps

1. Review the [Architecture Documentation](ARCHITECTURE.md)
2. Check the [Requirements](specs/requirements.md)
3. Explore the [Design Document](specs/design.md)
4. Follow the [Implementation Tasks](specs/tasks.md)

## Getting Help

- Check the [Angular Documentation](https://angular.dev)
- Review [NgRx Documentation](https://ngrx.io)
- Explore [Tailwind CSS Docs](https://tailwindcss.com)
- Visit [Leaflet Documentation](https://leafletjs.com)
- Read [Chart.js Documentation](https://www.chartjs.org)

## Contributing

Please read our contributing guidelines before submitting pull requests.

---

Happy coding! 🚀
