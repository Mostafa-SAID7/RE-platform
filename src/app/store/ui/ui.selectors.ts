import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UIState } from './ui.reducer';

export const selectUIState = createFeatureSelector<UIState>('ui');

export const selectLanguage = createSelector(
  selectUIState,
  (state: UIState) => state.language
);

export const selectTheme = createSelector(
  selectUIState,
  (state: UIState) => state.theme
);

export const selectSidebarOpen = createSelector(
  selectUIState,
  (state: UIState) => state.sidebarOpen
);

export const selectIsLoading = createSelector(
  selectUIState,
  (state: UIState) => state.isLoading
);

export const selectOpenModals = createSelector(
  selectUIState,
  (state: UIState) => state.openModals
);

export const selectModalOpen = (modalId: string) =>
  createSelector(
    selectOpenModals,
    (modals) => modalId in modals
  );

export const selectModalData = (modalId: string) =>
  createSelector(
    selectOpenModals,
    (modals) => modals[modalId] || null
  );

export const selectNotification = createSelector(
  selectUIState,
  (state: UIState) => state.notification
);

export const selectNotificationVisible = createSelector(
  selectNotification,
  (notification) => notification.visible
);

export const selectCurrentPage = createSelector(
  selectUIState,
  (state: UIState) => state.currentPage
);

export const selectPageSize = createSelector(
  selectUIState,
  (state: UIState) => state.pageSize
);
