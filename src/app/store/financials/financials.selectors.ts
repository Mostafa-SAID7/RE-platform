import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FinancialsState } from './financials.reducer';

export const selectFinancialsState = createFeatureSelector<FinancialsState>('financials');

export const selectFinancialSummary = createSelector(
  selectFinancialsState,
  (state: FinancialsState) => state.summary
);

export const selectRevenueBreakdown = createSelector(
  selectFinancialsState,
  (state: FinancialsState) => state.revenueBreakdown
);

export const selectExpenseBreakdown = createSelector(
  selectFinancialsState,
  (state: FinancialsState) => state.expenseBreakdown
);

export const selectCashFlow = createSelector(
  selectFinancialsState,
  (state: FinancialsState) => state.cashFlow
);

export const selectRoiData = createSelector(
  selectFinancialsState,
  (state: FinancialsState) => state.roiData
);

export const selectProjections = createSelector(
  selectFinancialsState,
  (state: FinancialsState) => state.projections
);

export const selectFinancialsTimeRange = createSelector(
  selectFinancialsState,
  (state: FinancialsState) => ({
    startDate: state.startDate,
    endDate: state.endDate
  })
);

export const selectSelectedPropertyIds = createSelector(
  selectFinancialsState,
  (state: FinancialsState) => state.selectedPropertyIds
);

export const selectFinancialsIsLoading = createSelector(
  selectFinancialsState,
  (state: FinancialsState) => state.isLoading
);

export const selectFinancialsError = createSelector(
  selectFinancialsState,
  (state: FinancialsState) => state.error
);

export const selectTotalRevenue = createSelector(
  selectFinancialSummary,
  (summary) => summary?.totalRevenue || 0
);

export const selectTotalExpenses = createSelector(
  selectFinancialSummary,
  (summary) => summary?.totalExpenses || 0
);

export const selectNetProfit = createSelector(
  selectFinancialSummary,
  (summary) => summary?.netProfit || 0
);

export const selectAverageRoi = createSelector(
  selectFinancialSummary,
  (summary) => summary?.roi || 0
);
