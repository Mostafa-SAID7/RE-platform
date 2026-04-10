import { createAction, props } from '@ngrx/store';

export interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  roi: number;
}

export interface FinancialData {
  summary: FinancialSummary;
  breakdown: any;
  cashFlow: any;
  projections: any;
}

// Load Financial Summary
export const loadFinancialSummary = createAction(
  '[Financials] Load Financial Summary',
  props<{ startDate?: Date; endDate?: Date; propertyIds?: string[] }>()
);

export const loadFinancialSummarySuccess = createAction(
  '[Financials] Load Financial Summary Success',
  props<{ summary: FinancialSummary }>()
);

export const loadFinancialSummaryFailure = createAction(
  '[Financials] Load Financial Summary Failure',
  props<{ error: string }>()
);

// Load Revenue Breakdown
export const loadRevenueBreakdown = createAction(
  '[Financials] Load Revenue Breakdown',
  props<{ startDate?: Date; endDate?: Date; groupBy?: string }>()
);

export const loadRevenueBreakdownSuccess = createAction(
  '[Financials] Load Revenue Breakdown Success',
  props<{ breakdown: any }>()
);

export const loadRevenueBreakdownFailure = createAction(
  '[Financials] Load Revenue Breakdown Failure',
  props<{ error: string }>()
);

// Load Expense Breakdown
export const loadExpenseBreakdown = createAction(
  '[Financials] Load Expense Breakdown',
  props<{ startDate?: Date; endDate?: Date; groupBy?: string }>()
);

export const loadExpenseBreakdownSuccess = createAction(
  '[Financials] Load Expense Breakdown Success',
  props<{ breakdown: any }>()
);

export const loadExpenseBreakdownFailure = createAction(
  '[Financials] Load Expense Breakdown Failure',
  props<{ error: string }>()
);

// Load Cash Flow
export const loadCashFlow = createAction(
  '[Financials] Load Cash Flow',
  props<{ startDate?: Date; endDate?: Date; interval?: string }>()
);

export const loadCashFlowSuccess = createAction(
  '[Financials] Load Cash Flow Success',
  props<{ cashFlow: any }>()
);

export const loadCashFlowFailure = createAction(
  '[Financials] Load Cash Flow Failure',
  props<{ error: string }>()
);

// Load ROI Data
export const loadRoiData = createAction(
  '[Financials] Load ROI Data',
  props<{ propertyIds?: string[] }>()
);

export const loadRoiDataSuccess = createAction(
  '[Financials] Load ROI Data Success',
  props<{ roiData: any }>()
);

export const loadRoiDataFailure = createAction(
  '[Financials] Load ROI Data Failure',
  props<{ error: string }>()
);

// Load Projections
export const loadProjections = createAction(
  '[Financials] Load Projections',
  props<{ months?: number }>()
);

export const loadProjectionsSuccess = createAction(
  '[Financials] Load Projections Success',
  props<{ projections: any }>()
);

export const loadProjectionsFailure = createAction(
  '[Financials] Load Projections Failure',
  props<{ error: string }>()
);

// Update Time Range
export const updateTimeRange = createAction(
  '[Financials] Update Time Range',
  props<{ startDate: Date; endDate: Date }>()
);

// Update Selected Properties
export const updateSelectedProperties = createAction(
  '[Financials] Update Selected Properties',
  props<{ propertyIds: string[] }>()
);
