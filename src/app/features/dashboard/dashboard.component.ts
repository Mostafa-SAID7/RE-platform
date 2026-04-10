import { Component, OnInit, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { KpiCardComponent } from './components/kpi-card.component';
import { ChartComponent } from './components/chart.component';
import { AlertListComponent, Alert } from './components/alert-list.component';
import { Property } from '../../models/property.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, KpiCardComponent, ChartComponent, AlertListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-4 md:p-6 bg-white dark:bg-gray-950 min-h-screen transition-colors duration-200">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">Welcome back! Here's your portfolio overview.</p>
      </div>

      <!-- KPI Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <app-kpi-card
          label="Total Properties"
          [value]="propertyCount()"
          icon="🏢"
          [trend]="propertyTrend()"
          format="number"
          borderColor="blue">
        </app-kpi-card>

        <app-kpi-card
          label="Occupancy Rate"
          [value]="occupancyRate()"
          icon="👥"
          [trend]="occupancyTrend()"
          format="percent"
          borderColor="green">
        </app-kpi-card>

        <app-kpi-card
          label="Total Revenue"
          [value]="totalRevenue()"
          icon="💰"
          [trend]="revenueTrend()"
          format="currency"
          borderColor="orange">
        </app-kpi-card>

        <app-kpi-card
          label="ROI"
          [value]="roi()"
          icon="📈"
          [trend]="roiTrend()"
          format="percent"
          borderColor="green">
        </app-kpi-card>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <app-chart
          title="Property Distribution by Type"
          type="doughnut"
          [labels]="propertyTypeLabels()"
          [data]="propertyTypeData()"
          [backgroundColor]="propertyTypeColors()">
        </app-chart>

        <app-chart
          title="Property Distribution by Location"
          type="bar"
          [labels]="locationLabels()"
          [data]="locationData()"
          [backgroundColor]="locationColors()">
        </app-chart>
      </div>

      <!-- Alerts Section -->
      <div class="mb-8">
        <app-alert-list
          [alerts]="alerts()"
          (alertDismissed)="dismissAlert($event)">
        </app-alert-list>
      </div>

      <!-- Quick Access Navigation -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button (click)="navigateTo('/properties')"
                class="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6 hover:shadow-lg dark:hover:shadow-xl transition-shadow text-left border border-gray-200 dark:border-gray-700">
          <div class="text-3xl mb-2">🏠</div>
          <h3 class="font-semibold text-gray-900 dark:text-white">Property Listings</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">View and manage all properties</p>
        </button>

        <button (click)="navigateTo('/tenants')"
                class="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6 hover:shadow-lg dark:hover:shadow-xl transition-shadow text-left border border-gray-200 dark:border-gray-700">
          <div class="text-3xl mb-2">👥</div>
          <h3 class="font-semibold text-gray-900 dark:text-white">Tenant Management</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage tenants and leases</p>
        </button>

        <button (click)="navigateTo('/map')"
                class="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6 hover:shadow-lg dark:hover:shadow-xl transition-shadow text-left border border-gray-200 dark:border-gray-700">
          <div class="text-3xl mb-2">📊</div>
          <h3 class="font-semibold text-gray-900 dark:text-white">Property Map</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">View properties on a map</p>
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class DashboardComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);

  // Signals for dashboard data
  properties = signal<Property[]>([]);
  alerts = signal<Alert[]>([]);
  propertyTrend = signal<number>(2.5);
  occupancyTrend = signal<number>(1.2);
  revenueTrend = signal<number>(3.8);
  roiTrend = signal<number>(2.1);

  // Computed signals
  propertyCount = computed(() => this.properties().length);
  
  occupancyRate = computed(() => {
    const props = this.properties();
    if (props.length === 0) return 0;
    const totalOccupancy = props.reduce((sum, p) => sum + (p.occupancyRate || 0), 0);
    return totalOccupancy / props.length;
  });

  totalRevenue = computed(() => {
    return this.properties().reduce((sum, p) => sum + (p.monthlyRevenue || 0), 0);
  });

  roi = computed(() => {
    const props = this.properties();
    if (props.length === 0) return 0;
    const totalRoi = props.reduce((sum, p) => sum + (p.roi || 0), 0);
    return totalRoi / props.length;
  });

  propertyTypeLabels = computed(() => {
    const types = new Set(this.properties().map(p => p.type));
    return Array.from(types);
  });

  propertyTypeData = computed(() => {
    const types = new Set(this.properties().map(p => p.type));
    return Array.from(types).map(type => 
      this.properties().filter(p => p.type === type).length
    );
  });

  propertyTypeColors = computed(() => [
    '#3B82F6', '#10B981', '#F59E0B'
  ]);

  locationLabels = computed(() => {
    const locations = new Set(this.properties().map(p => p.address?.city || 'Unknown'));
    return Array.from(locations).slice(0, 10);
  });

  locationData = computed(() => {
    const locations = new Set(this.properties().map(p => p.address?.city || 'Unknown'));
    return Array.from(locations).slice(0, 10).map(location =>
      this.properties().filter(p => p.address?.city === location).length
    );
  });

  locationColors = computed(() => [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#06B6D4'
  ]);

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    // Subscribe to properties from store
    this.store.select(state => (state as any).properties?.items || [])
      .subscribe(properties => {
        this.properties.set(properties);
        this.generateAlerts(properties);
      });
  }

  private generateAlerts(properties: Property[]): void {
    const newAlerts: Alert[] = [];

    // Check for inactive properties
    properties.forEach(prop => {
      if (prop.status === 'inactive') {
        newAlerts.push({
          id: `status-${prop.id}`,
          type: 'occupancy',
          severity: 'critical',
          title: 'Inactive Property',
          message: 'This property is currently inactive',
          propertyId: prop.id,
          propertyAddress: `${prop.address?.street}, ${prop.address?.city}`,
          timestamp: new Date()
        });
      }
    });

    this.alerts.set(newAlerts.slice(0, 5)); // Show top 5 alerts
  }

  dismissAlert(alertId: string): void {
    const currentAlerts = this.alerts();
    this.alerts.set(currentAlerts.filter(a => a.id !== alertId));
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
