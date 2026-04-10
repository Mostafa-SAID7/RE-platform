import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NotificationsState } from './notifications.reducer';

export const selectNotificationsState = createFeatureSelector<NotificationsState>('notifications');

export const selectAllNotifications = createSelector(
  selectNotificationsState,
  (state: NotificationsState) => state.items
);

export const selectNotifications = createSelector(
  selectNotificationsState,
  (state: NotificationsState) => state.items
);

export const selectNotificationsTotal = createSelector(
  selectNotificationsState,
  (state: NotificationsState) => state.total
);

export const selectUnreadCount = createSelector(
  selectNotificationsState,
  (state: NotificationsState) => state.unreadCount
);

export const selectNotificationsIsLoading = createSelector(
  selectNotificationsState,
  (state: NotificationsState) => state.isLoading
);

export const selectNotificationsError = createSelector(
  selectNotificationsState,
  (state: NotificationsState) => state.error
);

export const selectUnreadNotifications = createSelector(
  selectAllNotifications,
  (notifications) => notifications.filter((n) => !n.read)
);

export const selectNotificationById = (id: string) =>
  createSelector(
    selectAllNotifications,
    (notifications) => notifications.find((n) => n.id === id) || null
  );

export const selectNotificationsByType = (type: string) =>
  createSelector(
    selectAllNotifications,
    (notifications) => notifications.filter((n) => n.type === type)
  );

export const selectNotificationsBySeverity = (severity: string) =>
  createSelector(
    selectAllNotifications,
    (notifications) => notifications.filter((n) => n.severity === severity)
  );
