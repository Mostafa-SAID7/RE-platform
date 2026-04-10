import { createAction, props } from '@ngrx/store';
import { Notification } from '../../models/notification.model';

// Load Notifications
export const loadNotifications = createAction(
  '[Notifications] Load Notifications',
  props<{ page?: number; limit?: number; read?: boolean }>()
);

export const loadNotificationsSuccess = createAction(
  '[Notifications] Load Notifications Success',
  props<{ notifications: Notification[]; total: number; unreadCount: number }>()
);

export const loadNotificationsFailure = createAction(
  '[Notifications] Load Notifications Failure',
  props<{ error: string }>()
);

// Add Notification
export const addNotification = createAction(
  '[Notifications] Add Notification',
  props<{ notification: Notification }>()
);

// Mark as Read
export const markAsRead = createAction(
  '[Notifications] Mark as Read',
  props<{ id: string }>()
);

export const markAsReadSuccess = createAction(
  '[Notifications] Mark as Read Success',
  props<{ id: string }>()
);

export const markAsReadFailure = createAction(
  '[Notifications] Mark as Read Failure',
  props<{ error: string }>()
);

// Mark Notification as Read (alias)
export const markNotificationAsRead = createAction(
  '[Notifications] Mark Notification as Read',
  props<{ id: string }>()
);

// Mark All as Read
export const markAllAsRead = createAction('[Notifications] Mark All as Read');

export const markAllAsReadSuccess = createAction(
  '[Notifications] Mark All as Read Success',
  props<{ updated: number }>()
);

export const markAllAsReadFailure = createAction(
  '[Notifications] Mark All as Read Failure',
  props<{ error: string }>()
);

// Delete Notification
export const deleteNotification = createAction(
  '[Notifications] Delete Notification',
  props<{ id: string }>()
);

export const deleteNotificationSuccess = createAction(
  '[Notifications] Delete Notification Success',
  props<{ id: string }>()
);

export const deleteNotificationFailure = createAction(
  '[Notifications] Delete Notification Failure',
  props<{ error: string }>()
);

// Dismiss Notification (alias for delete)
export const dismissNotification = createAction(
  '[Notifications] Dismiss Notification',
  props<{ id: string }>()
);

// Clear All Notifications
export const clearAllNotifications = createAction(
  '[Notifications] Clear All Notifications'
);

export const clearAllNotificationsSuccess = createAction(
  '[Notifications] Clear All Notifications Success'
);

export const clearAllNotificationsFailure = createAction(
  '[Notifications] Clear All Notifications Failure',
  props<{ error: string }>()
);
