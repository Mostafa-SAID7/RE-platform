import { createReducer, on } from '@ngrx/store';
import { Notification } from '../../models/notification.model';
import * as NotificationsActions from './notifications.actions';

export interface NotificationsState {
  items: Notification[];
  total: number;
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

export const initialNotificationsState: NotificationsState = {
  items: [],
  total: 0,
  unreadCount: 0,
  isLoading: false,
  error: null
};

export const notificationsReducer = createReducer(
  initialNotificationsState,
  // Load Notifications
  on(NotificationsActions.loadNotifications, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(NotificationsActions.loadNotificationsSuccess, (state, { notifications, total, unreadCount }) => ({
    ...state,
    items: notifications,
    total,
    unreadCount,
    isLoading: false,
    error: null
  })),
  on(NotificationsActions.loadNotificationsFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),
  // Add Notification
  on(NotificationsActions.addNotification, (state, { notification }) => ({
    ...state,
    items: [notification, ...state.items],
    total: state.total + 1,
    unreadCount: state.unreadCount + 1
  })),
  // Mark as Read
  on(NotificationsActions.markAsRead, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(NotificationsActions.markNotificationAsRead, (state, { id }) => ({
    ...state,
    items: state.items.map((n) =>
      n.id === id ? { ...n, read: true } : n
    ),
    unreadCount: Math.max(0, state.unreadCount - 1)
  })),
  on(NotificationsActions.markAsReadSuccess, (state, { id }) => ({
    ...state,
    items: state.items.map((n) =>
      n.id === id ? { ...n, read: true } : n
    ),
    unreadCount: Math.max(0, state.unreadCount - 1),
    isLoading: false,
    error: null
  })),
  on(NotificationsActions.markAsReadFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),
  // Mark All as Read
  on(NotificationsActions.markAllAsRead, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(NotificationsActions.markAllAsReadSuccess, (state) => ({
    ...state,
    items: state.items.map((n) => ({ ...n, read: true })),
    unreadCount: 0,
    isLoading: false,
    error: null
  })),
  on(NotificationsActions.markAllAsReadFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),
  // Delete Notification
  on(NotificationsActions.deleteNotification, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(NotificationsActions.dismissNotification, (state, { id }) => {
    const notification = state.items.find((n) => n.id === id);
    return {
      ...state,
      items: state.items.filter((n) => n.id !== id),
      total: state.total - 1,
      unreadCount: notification && !notification.read ? state.unreadCount - 1 : state.unreadCount
    };
  }),
  on(NotificationsActions.deleteNotificationSuccess, (state, { id }) => {
    const notification = state.items.find((n) => n.id === id);
    return {
      ...state,
      items: state.items.filter((n) => n.id !== id),
      total: state.total - 1,
      unreadCount: notification && !notification.read ? state.unreadCount - 1 : state.unreadCount,
      isLoading: false,
      error: null
    };
  }),
  on(NotificationsActions.deleteNotificationFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),
  // Clear All Notifications
  on(NotificationsActions.clearAllNotifications, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(NotificationsActions.clearAllNotificationsSuccess, (state) => ({
    ...state,
    items: [],
    total: 0,
    unreadCount: 0,
    isLoading: false,
    error: null
  })),
  on(NotificationsActions.clearAllNotificationsFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  }))
);
