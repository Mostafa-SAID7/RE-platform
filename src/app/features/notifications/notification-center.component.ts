import { Component, OnInit, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectNotifications, selectUnreadCount } from '../../store/notifications/notifications.selectors';
import { markNotificationAsRead, dismissNotification } from '../../store/notifications/notifications.actions';

@Component({
  selector: 'app-notification-center',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-6 bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors duration-200">
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-2">Unread: {{ (unreadCount$ | async) || 0 }}</p>
        </div>

        <!-- Notification Filters -->
        <div class="bg-white dark:bg-gray-900 rounded-lg shadow dark:shadow-lg p-4 mb-6 flex gap-4 border border-gray-200 dark:border-gray-800 transition-colors duration-200 flex-wrap">
          <button class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">All</button>
          <button class="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">Unread</button>
          <button class="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">Lease Expiration</button>
          <button class="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">Payment Overdue</button>
          <button class="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">Maintenance</button>
        </div>

        <!-- Notifications List -->
        <div class="space-y-4">
          <div *ngFor="let notification of (notifications$ | async)" 
               [ngClass]="{'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500': !notification.read, 'bg-white dark:bg-gray-900': notification.read}"
               class="rounded-lg shadow dark:shadow-lg p-6 hover:shadow-lg dark:hover:shadow-xl transition border border-gray-200 dark:border-gray-800">
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <h3 class="font-semibold text-gray-900 dark:text-white">{{ notification.title }}</h3>
                <p class="text-gray-600 dark:text-gray-400 mt-2">{{ notification.message }}</p>
                <div class="flex gap-4 mt-4">
                  <span class="text-xs text-gray-500 dark:text-gray-400">{{ notification.createdAt | date:'short' }}</span>
                  <span [ngClass]="getTypeClass(notification.type)" class="text-xs px-2 py-1 rounded">
                    {{ notification.type }}
                  </span>
                </div>
              </div>
              <div class="flex gap-2 ml-4">
                <button *ngIf="!notification.read" 
                        (click)="markAsRead(notification.id)"
                        class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 text-sm transition-colors">Mark as read</button>
                <button (click)="dismiss(notification.id)" class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 text-sm transition-colors">Dismiss</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="(notifications$ | async)?.length === 0" class="text-center py-12">
          <p class="text-gray-500 dark:text-gray-400">No notifications</p>
        </div>
      </div>
    </div>
  `
})
export class NotificationCenterComponent implements OnInit {
  private store = inject(Store);

  notifications$: Observable<any[]>;
  unreadCount$: Observable<number>;

  constructor() {
    this.notifications$ = this.store.select(selectNotifications);
    this.unreadCount$ = this.store.select(selectUnreadCount);
  }

  ngOnInit(): void {
    // Load notifications on init
  }

  markAsRead(notificationId: string): void {
    this.store.dispatch(markNotificationAsRead({ id: notificationId }));
  }

  dismiss(notificationId: string): void {
    this.store.dispatch(dismissNotification({ id: notificationId }));
  }

  getTypeClass(type: string): string {
    const classes: { [key: string]: string } = {
      'lease-expiration': 'bg-yellow-100 text-yellow-800',
      'payment-overdue': 'bg-red-100 text-red-800',
      'maintenance-alert': 'bg-orange-100 text-orange-800',
      'occupancy-alert': 'bg-blue-100 text-blue-800'
    };
    return classes[type] || 'bg-gray-100 text-gray-800';
  }
}
