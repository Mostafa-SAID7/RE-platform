import { createReducer, on } from '@ngrx/store';
import * as UIActions from './ui.actions';

export interface UIState {
  language: 'en' | 'ar';
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  isLoading: boolean;
  openModals: { [key: string]: any };
  notification: {
    message: string | null;
    type: 'success' | 'error' | 'warning' | 'info' | null;
    visible: boolean;
  };
  currentPage: number;
  pageSize: number;
}

export const initialUIState: UIState = {
  language: 'en',
  theme: 'light',
  sidebarOpen: true,
  isLoading: false,
  openModals: {},
  notification: {
    message: null,
    type: null,
    visible: false
  },
  currentPage: 1,
  pageSize: 20
};

export const uiReducer = createReducer(
  initialUIState,
  // Language
  on(UIActions.setLanguage, (state, { language }) => ({
    ...state,
    language
  })),
  // Theme
  on(UIActions.setTheme, (state, { theme }) => ({
    ...state,
    theme
  })),
  // Sidebar
  on(UIActions.toggleSidebar, (state) => ({
    ...state,
    sidebarOpen: !state.sidebarOpen
  })),
  on(UIActions.setSidebarOpen, (state, { isOpen }) => ({
    ...state,
    sidebarOpen: isOpen
  })),
  // Loading
  on(UIActions.setLoading, (state, { isLoading }) => ({
    ...state,
    isLoading
  })),
  // Modal
  on(UIActions.openModal, (state, { modalId, data }) => ({
    ...state,
    openModals: {
      ...state.openModals,
      [modalId]: data || true
    }
  })),
  on(UIActions.closeModal, (state, { modalId }) => {
    const { [modalId]: _, ...rest } = state.openModals;
    return {
      ...state,
      openModals: rest
    };
  }),
  // Notification
  on(UIActions.showNotification, (state, { message, notificationType }) => ({
    ...state,
    notification: {
      message,
      type: notificationType,
      visible: true
    }
  })),
  on(UIActions.hideNotification, (state) => ({
    ...state,
    notification: {
      message: null,
      type: null,
      visible: false
    }
  })),
  // Pagination
  on(UIActions.setPage, (state, { page }) => ({
    ...state,
    currentPage: page
  })),
  on(UIActions.setPageSize, (state, { pageSize }) => ({
    ...state,
    pageSize,
    currentPage: 1
  }))
);
