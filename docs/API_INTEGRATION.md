# API Integration Guide

## Overview

This document describes how the Real Estate Platform integrates with backend APIs.

## Base Configuration

### Environment Files

**Development** (`src/environments/environment.ts`):
```typescript
apiUrl: 'http://localhost:3000/api'
wsUrl: 'ws://localhost:3000'
```

**Production** (`src/environments/environment.prod.ts`):
```typescript
apiUrl: 'https://api.realestate-platform.com/api'
wsUrl: 'wss://api.realestate-platform.com'
```

## Authentication

### Login
```typescript
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "manager"
  }
}
```

### Token Refresh
```typescript
POST /auth/refresh
Authorization: Bearer <token>

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Logout
```typescript
POST /auth/logout
Authorization: Bearer <token>
```

## Properties API

### Get All Properties
```typescript
GET /properties
Authorization: Bearer <token>
Query Parameters:
  - page: number (default: 1)
  - limit: number (default: 20)
  - status: 'available' | 'occupied' | 'maintenance'
  - type: 'residential' | 'commercial' | 'industrial'
  - minPrice: number
  - maxPrice: number
  - location: string

Response:
{
  "data": [
    {
      "id": "prop-123",
      "name": "Sunset Apartments",
      "type": "residential",
      "status": "occupied",
      "address": {...},
      "price": 250000,
      "occupancyRate": 85,
      "monthlyRevenue": 12500,
      "annualRevenue": 150000,
      "roi": 8.5
    }
  ],
  "total": 150,
  "page": 1,
  "limit": 20
}
```

### Get Property by ID
```typescript
GET /properties/:id
Authorization: Bearer <token>

Response:
{
  "id": "prop-123",
  "name": "Sunset Apartments",
  "type": "residential",
  "status": "occupied",
  "address": {...},
  "price": 250000,
  "size": 1200,
  "yearBuilt": 2015,
  "occupancyRate": 85,
  "photos": [...],
  "tenants": [...],
  "workOrders": [...]
}
```

### Create Property
```typescript
POST /properties
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Property",
  "type": "residential",
  "address": {...},
  "price": 300000,
  "size": 1500,
  "yearBuilt": 2020
}

Response:
{
  "id": "prop-456",
  "name": "New Property",
  ...
}
```

### Update Property
```typescript
PUT /properties/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Property Name",
  "price": 320000
}

Response:
{
  "id": "prop-123",
  "name": "Updated Property Name",
  ...
}
```

### Delete Property
```typescript
DELETE /properties/:id
Authorization: Bearer <token>

Response:
{
  "message": "Property deleted successfully"
}
```

## Tenants API

### Get All Tenants
```typescript
GET /tenants
Authorization: Bearer <token>
Query Parameters:
  - page: number
  - limit: number
  - search: string

Response:
{
  "data": [
    {
      "id": "tenant-123",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane@example.com",
      "phone": "+1234567890",
      "propertyId": "prop-123",
      "leaseStatus": "active"
    }
  ],
  "total": 75,
  "page": 1,
  "limit": 20
}
```

### Get Tenant by ID
```typescript
GET /tenants/:id
Authorization: Bearer <token>

Response:
{
  "id": "tenant-123",
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "phone": "+1234567890",
  "address": {...},
  "emergencyContact": {...},
  "leases": [...],
  "payments": [...],
  "documents": [...]
}
```

## Leases API

### Get Leases
```typescript
GET /leases
Authorization: Bearer <token>
Query Parameters:
  - tenantId: string
  - propertyId: string
  - status: 'active' | 'expired' | 'terminated'

Response:
{
  "data": [
    {
      "id": "lease-123",
      "tenantId": "tenant-123",
      "propertyId": "prop-123",
      "startDate": "2024-01-01",
      "endDate": "2024-12-31",
      "monthlyRent": 1500,
      "status": "active"
    }
  ]
}
```

## Payments API

### Get Payments
```typescript
GET /payments
Authorization: Bearer <token>
Query Parameters:
  - tenantId: string
  - leaseId: string
  - status: 'paid' | 'pending' | 'overdue'

Response:
{
  "data": [
    {
      "id": "payment-123",
      "leaseId": "lease-123",
      "amount": 1500,
      "dueDate": "2024-04-01",
      "paidDate": "2024-04-02",
      "status": "paid",
      "method": "bank_transfer"
    }
  ]
}
```

## Work Orders API

### Get Work Orders
```typescript
GET /work-orders
Authorization: Bearer <token>
Query Parameters:
  - propertyId: string
  - status: 'pending' | 'assigned' | 'in_progress' | 'completed'
  - priority: 'low' | 'medium' | 'high' | 'urgent'

Response:
{
  "data": [
    {
      "id": "wo-123",
      "propertyId": "prop-123",
      "title": "Fix leaking faucet",
      "description": "Kitchen faucet is leaking",
      "priority": "high",
      "status": "assigned",
      "estimatedCost": 150,
      "vendorId": "vendor-123"
    }
  ]
}
```

### Create Work Order
```typescript
POST /work-orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "propertyId": "prop-123",
  "title": "Fix leaking faucet",
  "description": "Kitchen faucet is leaking",
  "priority": "high",
  "estimatedCost": 150
}

Response:
{
  "id": "wo-456",
  "workOrderNumber": "WO-2024-0456",
  ...
}
```

## Financial Analytics API

### Get Financial Summary
```typescript
GET /financials/summary
Authorization: Bearer <token>
Query Parameters:
  - period: 'month' | 'quarter' | 'year'
  - startDate: string (ISO 8601)
  - endDate: string (ISO 8601)

Response:
{
  "totalRevenue": 150000,
  "totalExpenses": 45000,
  "netProfit": 105000,
  "roi": 8.5,
  "revenueByProperty": [...],
  "expensesByCategory": [...]
}
```

### Get Revenue Breakdown
```typescript
GET /financials/revenue-breakdown
Authorization: Bearer <token>
Query Parameters:
  - period: 'month' | 'quarter' | 'year'

Response:
{
  "byProperty": [...],
  "byType": [...],
  "byLocation": [...]
}
```

## Reports API

### Generate Report
```typescript
POST /reports/generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "template": "occupancy" | "revenue" | "maintenance" | "tenant",
  "dateRange": {
    "start": "2024-01-01",
    "end": "2024-03-31"
  },
  "properties": ["prop-123", "prop-456"],
  "format": "pdf" | "excel" | "csv"
}

Response:
{
  "reportId": "report-123",
  "downloadUrl": "/reports/download/report-123",
  "expiresAt": "2024-04-15T00:00:00Z"
}
```

## WebSocket Events

### Connection
```typescript
const ws = new WebSocket('ws://localhost:3000');
ws.send(JSON.stringify({
  type: 'authenticate',
  token: 'Bearer <token>'
}));
```

### Subscribe to Property Updates
```typescript
ws.send(JSON.stringify({
  type: 'subscribe',
  channel: 'property-updates',
  propertyId: 'prop-123'
}));
```

### Incoming Events
```typescript
// Property Update
{
  "type": "property-update",
  "data": {
    "propertyId": "prop-123",
    "field": "occupancyRate",
    "value": 87
  }
}

// Payment Received
{
  "type": "payment-received",
  "data": {
    "paymentId": "payment-456",
    "amount": 1500,
    "tenantId": "tenant-123"
  }
}

// Work Order Status Change
{
  "type": "work-order-status",
  "data": {
    "workOrderId": "wo-123",
    "status": "completed"
  }
}
```

## Error Handling

### Error Response Format
```typescript
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### HTTP Status Codes
- `200 OK` - Successful request
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `422 Unprocessable Entity` - Validation error
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

## Rate Limiting

- **Limit**: 100 requests per minute per user
- **Header**: `X-RateLimit-Remaining`
- **Reset**: `X-RateLimit-Reset` (Unix timestamp)

## Pagination

All list endpoints support pagination:
```typescript
Query Parameters:
  - page: number (default: 1)
  - limit: number (default: 20, max: 100)

Response:
{
  "data": [...],
  "total": 150,
  "page": 1,
  "limit": 20,
  "totalPages": 8
}
```

## Filtering and Sorting

```typescript
Query Parameters:
  - sort: string (e.g., "price:asc", "createdAt:desc")
  - filter[field]: value
```

---

*Note: This is a reference API specification. Actual backend implementation may vary.*
