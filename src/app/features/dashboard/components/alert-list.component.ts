import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Alert {
  id: string;
  type: 'occupancy' | 'maintenance' | 'payment' | 'lease';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  propertyId?: string;
  propertyAddress?: string;
  timestamp: Date;
}

@Component({
  selector: 'app-alert-list',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6 transition-colors duration-200">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Critical Alerts</h3>
        <span class="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs font-semibold px-3 py-1 rounded-full">
          {{ alerts.length }}
        </span>
      </div>

      <div *ngIf="alerts.length === 0" class="text-center py-8">
        <p class="text-gray-500 dark:text-gray-400">No critical alerts at this time</p>
      </div>

      <div *ngIf="alerts.length > 0" class="space-y-3">
        <div *ngFor="let alert of alerts" 
             class="flex items-start p-4 rounded-lg border-l-4 transition-colors duration-200"
             [ngClass]="getSeverityClass(alert.severity)">
          <div class="flex-shrink-0 mr-3">
            <span class="text-xl" [ngClass]="getIconClass(alert.type)">
              {{ getIcon(alert.type) }}
            </span>
          </div>
          <div class="flex-1">
            <h4 class="font-semibold text-gray-900 dark:text-white">{{ alert.title }}</h4>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ alert.message }}</p>
            <p *ngIf="alert.propertyAddress" class="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {{ alert.propertyAddress }}
            </p>
          </div>
          <button (click)="dismissAlert(alert.id)"
                  class="flex-shrink-0 ml-3 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  aria-label="Dismiss alert">
            ✕
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class AlertListComponent {
  @Input() alerts: Alert[] = [];
  @Output() alertDismissed = new EventEmitter<string>();

  dismissAlert(alertId: string): void {
    this.alertDismissed.emit(alertId);
  }

  getSeverityClass(severity: string): string {
    const classMap = {
      critical: 'bg-red-50 dark:bg-red-900/20 border-red-500 dark:border-red-600',
      warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500 dark:border-yellow-600',
      info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-600'
    };
    return classMap[severity as keyof typeof classMap] || classMap.info;
  }

  getIcon(type: string): string {
    const iconMap = {
      occupancy: '🏢',
      maintenance: '🔧',
      payment: '💰',
      lease: '📋'
    };
    return iconMap[type as keyof typeof iconMap] || '⚠️';
  }

  getIconClass(type: string): string {
    const classMap = {
      occupancy: 'text-orange-500',
      maintenance: 'text-red-500',
      payment: 'text-yellow-500',
      lease: 'text-blue-500'
    };
    return classMap[type as keyof typeof classMap] || 'text-gray-500';
  }
}
