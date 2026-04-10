import { Injectable, inject, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { RealtimeService } from './realtime.service';
import { NotificationService } from './notification.service';
import { Notification } from '../models/notification.model';
import * as PropertiesActions from '../store/properties/properties.actions';
import * as TenantsActions from '../store/tenants/tenants.actions';
import * as FinancialsActions from '../store/financials/financials.actions';
import * as NotificationsActions from '../store/notifications/notifications.actions';

interface LatencyMetrics {
  propertyUpdates: number[];
  occupancyChanges: number[];
  paymentUpdates: number[];
  workOrderUpdates: number[];
}

@Injectable({
  providedIn: 'root'
})
export class RealtimeEventHandlerService implements OnDestroy {
  private realtimeService = inject(RealtimeService);
  private notificationService = inject(NotificationService);
  private store = inject(Store);

  private destroy$ = new Subject<void>();
  private latencyMetrics: LatencyMetrics = {
    propertyUpdates: [],
    occupancyChanges: [],
    paymentUpdates: [],
    workOrderUpdates: []
  };

  constructor() {
    this.initializeEventHandlers();
  }

  /**
   * Initialize all event handlers
   */
  private initializeEventHandlers(): void {
    // Handle property updates
    this.realtimeService.propertyUpdate$
      .pipe(
        tap(message => this.handlePropertyUpdate(message)),
        takeUntil(this.destroy$)
      )
      .subscribe();

    // Handle occupancy changes
    this.realtimeService.occupancyChange$
      .pipe(
        tap(message => this.handleOccupancyChange(message)),
        takeUntil(this.destroy$)
      )
      .subscribe();

    // Handle payment received
    this.realtimeService.paymentReceived$
      .pipe(
        tap(message => this.handlePaymentReceived(message)),
        takeUntil(this.destroy$)
      )
      .subscribe();

    // Handle work order status changes
    this.realtimeService.workOrderStatus$
      .pipe(
        tap(message => this.handleWorkOrderStatus(message)),
        takeUntil(this.destroy$)
      )
      .subscribe();

    // Handle alerts
    this.realtimeService.alert$
      .pipe(
        tap(message => this.handleAlert(message)),
        takeUntil(this.destroy$)
      )
      .subscribe();

    // Handle notifications
    this.realtimeService.notification$
      .pipe(
        tap(message => this.handleNotification(message)),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  /**
   * Handle property update message
   */
  private handlePropertyUpdate(message: any): void {
    const startTime = performance.now();

    // Dispatch action to update property in store
    this.store.dispatch(PropertiesActions.updatePropertySuccess({
      property: {
        id: message.propertyId,
        ...message.changes
      }
    }));

    this.recordLatency('propertyUpdates', startTime);
  }

  /**
   * Handle occupancy change message
   */
  private handleOccupancyChange(message: any): void {
    const startTime = performance.now();

    // Dispatch action to update occupancy in store
    this.store.dispatch(PropertiesActions.updatePropertySuccess({
      property: {
        id: message.propertyId,
        occupancyRate: message.occupancyRate
      } as any
    }));

    // Show notification for significant occupancy changes
    if (message.occupancyRate < 70) {
      this.showCriticalNotification(
        'Low Occupancy Alert',
        `Property ${message.propertyId} occupancy is below 70%`,
        'occupancy_alert'
      );
    }

    this.recordLatency('occupancyChanges', startTime);
  }

  /**
   * Handle payment received message
   */
  private handlePaymentReceived(message: any): void {
    const startTime = performance.now();

    // Dispatch action to update financial data
    this.store.dispatch(FinancialsActions.loadFinancialSummary({}));

    // Show success notification
    this.showNotification(
      'Payment Received',
      `Payment of $${message.amount} received for lease ${message.leaseId}`,
      'success',
      'payment_received'
    );

    this.recordLatency('paymentUpdates', startTime);
  }

  /**
   * Handle work order status change message
   */
  private handleWorkOrderStatus(message: any): void {
    const startTime = performance.now();

    // Show notification based on status
    const statusMessages: Record<string, string> = {
      'assigned': 'Work order assigned to vendor',
      'in_progress': 'Work order is in progress',
      'completed': 'Work order completed',
      'cancelled': 'Work order cancelled'
    };

    const statusMessage = statusMessages[message.status] || 'Work order status updated';

    this.showNotification(
      'Work Order Update',
      `${statusMessage}: ${message.workOrderId}`,
      'info',
      'workorder_status'
    );

    this.recordLatency('workOrderUpdates', startTime);
  }

  /**
   * Handle alert message
   */
  private handleAlert(message: any): void {
    const alert = message.alert;

    // Show critical alerts as notifications
    if (alert.severity === 'error' || alert.severity === 'warning') {
      this.showCriticalNotification(
        alert.type,
        alert.message,
        'maintenance_alert'
      );
    }
  }

  /**
   * Handle notification message
   */
  private handleNotification(message: any): void {
    const notification = message.notification;

    // Create notification object
    const notif: Notification = {
      id: notification.id,
      userId: '', // Will be set by backend
      type: notification.type as any,
      title: notification.title,
      message: notification.message,
      severity: 'info',
      read: false,
      createdAt: new Date()
    };

    // Dispatch action to add notification to store
    this.store.dispatch(NotificationsActions.addNotification({ notification: notif }));

    // Show in-app notification
    this.notificationService.showNotification(notif);
  }

  /**
   * Show a notification
   */
  private showNotification(
    title: string,
    message: string,
    severity: 'info' | 'warning' | 'error' | 'success',
    type: string
  ): void {
    const notification: Notification = {
      id: `notif-${Date.now()}`,
      userId: '',
      type: type as any,
      title,
      message,
      severity,
      read: false,
      createdAt: new Date()
    };

    this.notificationService.showNotification(notification);
    this.store.dispatch(NotificationsActions.addNotification({ notification }));
  }

  /**
   * Show a critical notification
   */
  private showCriticalNotification(
    title: string,
    message: string,
    type: string
  ): void {
    this.showNotification(title, message, 'warning', type);
  }

  /**
   * Record latency metric
   */
  private recordLatency(metric: keyof LatencyMetrics, startTime: number): void {
    const latency = performance.now() - startTime;
    this.latencyMetrics[metric].push(latency);

    // Keep only last 100 measurements
    if (this.latencyMetrics[metric].length > 100) {
      this.latencyMetrics[metric].shift();
    }
  }

  /**
   * Get average latency for a metric
   */
  getAverageLatency(metric: keyof LatencyMetrics): number {
    const measurements = this.latencyMetrics[metric];
    if (measurements.length === 0) return 0;

    const sum = measurements.reduce((a, b) => a + b, 0);
    return sum / measurements.length;
  }

  /**
   * Get all latency metrics
   */
  getLatencyMetrics(): LatencyMetrics {
    return {
      propertyUpdates: [...this.latencyMetrics.propertyUpdates],
      occupancyChanges: [...this.latencyMetrics.occupancyChanges],
      paymentUpdates: [...this.latencyMetrics.paymentUpdates],
      workOrderUpdates: [...this.latencyMetrics.workOrderUpdates]
    };
  }

  /**
   * Connect to real-time updates
   */
  connect(): void {
    this.realtimeService.connect();
  }

  /**
   * Disconnect from real-time updates
   */
  disconnect(): void {
    this.realtimeService.disconnect();
  }

  /**
   * Subscribe to channels
   */
  subscribeToChannels(channels: string[]): void {
    this.realtimeService.subscribe(channels);
  }

  /**
   * Unsubscribe from channels
   */
  unsubscribeFromChannels(channels: string[]): void {
    this.realtimeService.unsubscribe(channels);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.disconnect();
  }
}
