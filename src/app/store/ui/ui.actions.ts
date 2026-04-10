import { createAction, props } from '@ngrx/store';

// Language
export const setLanguage = createAction(
  '[UI] Set Language',
  props<{ language: 'en' | 'ar' }>()
);

// Theme
export const setTheme = createAction(
  '[UI] Set Theme',
  props<{ theme: 'light' | 'dark' }>()
);

// Sidebar
export const toggleSidebar = createAction('[UI] Toggle Sidebar');

export const setSidebarOpen = createAction(
  '[UI] Set Sidebar Open',
  props<{ isOpen: boolean }>()
);

// Loading
export const setLoading = createAction(
  '[UI] Set Loading',
  props<{ isLoading: boolean }>()
);

// Modal
export const openModal = createAction(
  '[UI] Open Modal',
  props<{ modalId: string; data?: any }>()
);

export const closeModal = createAction(
  '[UI] Close Modal',
  props<{ modalId: string }>()
);

// Notification
export const showNotification = createAction(
  '[UI] Show Notification',
  props<{ message: string; notificationType: 'success' | 'error' | 'warning' | 'info'; duration?: number }>()
);

export const hideNotification = createAction('[UI] Hide Notification');

// Pagination
export const setPage = createAction(
  '[UI] Set Page',
  props<{ page: number }>()
);

export const setPageSize = createAction(
  '[UI] Set Page Size',
  props<{ pageSize: number }>()
);
