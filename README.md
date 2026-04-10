# Real Estate Analytics & Property Management Platform

A comprehensive property management platform built with Angular 18, featuring real-time analytics, interactive maps, tenant management, and financial reporting.

![Angular](https://img.shields.io/badge/Angular-18.2-red?logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)
![NgRx](https://img.shields.io/badge/NgRx-18.1-purple?logo=ngrx)
![License](https://img.shields.io/badge/License-MIT-green)

## 🚀 Features

### 📊 Dashboard & Analytics
- Real-time KPI cards (properties, occupancy rate, revenue, ROI)
- Interactive property distribution charts (by type and location)
- 30-day trend indicators
- Critical alerts system
- Quick-access navigation

### 🏢 Property Management
- Advanced property listings with virtual scrolling
- Multi-filter search (price, location, status, type, occupancy)
- Bulk actions (status updates, export)
- Detailed property views with photo galleries
- Interactive maps with Leaflet integration
- Property clustering and heat maps

### 👥 Tenant Management
- Comprehensive tenant profiles
- Lease tracking with renewal alerts
- Payment history and overdue tracking
- Document management
- Communication logs

### 💰 Financial Analytics
- Revenue and expense breakdowns
- ROI calculations per property
- Cash flow analysis
- Year-over-year comparisons
- 12-month revenue projections
- Export to PDF/Excel

### 🔧 Work Order Management
- Priority-based work order queue
- Vendor assignment and tracking
- Status updates with notifications
- Cost tracking and budget management
- Photo and note attachments

### 📈 Reporting
- Pre-built report templates
- Custom report builder
- Scheduled report generation
- Export to PDF, Excel, CSV
- Report history and download

### 🌐 Multi-Language Support
- English (LTR) and Arabic (RTL)
- Locale-aware formatting
- Language switcher without page reload
- Persistent language preferences

### ♿ Accessibility
- WCAG 2.2 Level AA compliant
- Full keyboard navigation
- Screen reader support
- High contrast ratios
- ARIA labels and live regions

## 🛠️ Tech Stack

- **Framework**: Angular 18 (Standalone Components, Signals)
- **State Management**: NgRx (Store, Effects)
- **Styling**: Tailwind CSS
- **Maps**: Leaflet
- **Charts**: Chart.js
- **Build Tool**: esbuild (via Angular CLI)
- **Language**: TypeScript 5.5 (Strict Mode)

## 📋 Prerequisites

- Node.js 18+ and npm
- Angular CLI 18+
- Git

## 🚀 Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/Mostafa-SAID7/real-estate-platform.git
cd real-estate-platform

# Install dependencies
npm install

# Start development server
npm start
```

The application will be available at `http://localhost:4200`

### Build

```bash
# Development build
npm run build

# Production build
npm run build -- --configuration production
```

### Testing

```bash
# Run unit tests
npm test

# Run tests with coverage
npm test -- --code-coverage
```

## 📁 Project Structure

```
real-estate-platform/
├── src/
│   ├── app/
│   │   ├── core/              # Singleton services, guards, interceptors
│   │   ├── features/          # Feature modules
│   │   │   ├── dashboard/
│   │   │   ├── properties/
│   │   │   ├── tenants/
│   │   │   ├── financials/
│   │   │   ├── work-orders/
│   │   │   └── reports/
│   │   ├── shared/            # Shared components, directives, pipes
│   │   ├── models/            # TypeScript interfaces
│   │   ├── services/          # Application services
│   │   ├── guards/            # Route guards
│   │   └── interceptors/      # HTTP interceptors
│   ├── environments/          # Environment configurations
│   └── styles.css             # Global styles
├── docs/                      # Documentation
│   ├── specs/                 # Requirements, design, tasks
│   ├── screenshots/           # Application screenshots
│   └── CONFIGURATION.md       # Configuration guide
└── README.md
```

## 📚 Documentation

- [Requirements](docs/specs/requirements.md) - Detailed functional requirements
- [Design](docs/specs/design.md) - Technical design and architecture
- [Tasks](docs/specs/tasks.md) - Implementation plan and task breakdown
- [Configuration](docs/CONFIGURATION.md) - Project configuration details

## 🖼️ Screenshots

See the [screenshots folder](docs/screenshots/) for application previews.

## 🎯 Performance Targets

- Dashboard load time: < 1.5 seconds
- Lighthouse Performance score: 95+
- Bundle size reduction: 48%
- Filter response time: < 300ms

## 🔐 Security

- JWT-based authentication
- Role-based access control (Admin, Manager, Viewer)
- HTTP interceptors for token management
- Secure WebSocket connections (WSS)

## 🌍 Browser Support

- Chrome 120+
- Firefox 121+
- Safari 17+
- Edge 120+

## 📄 License

This project is licensed under the MIT License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or support, please contact [Mostafa SAID](https://github.com/Mostafa-SAID7)

---

Built with ❤️ using Angular 18
