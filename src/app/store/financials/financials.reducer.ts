import { createReducer, on } from '@ngrx/store';
import * as FinancialsActions from './financials.actions';

export interface FinancialsState {
  summary: FinancialsActions.FinancialSummary | null;
  revenueBreakdown: any;
  expenseBreakdown: any;
  cashFlow: any;
  roiData: any;
  projections: any;
  startDate: Date | null;
  endDate: Date | null;
  selectedPropertyIds: string[];
  isLoading: boolean;
  error: string | null;
}

export const initialFinancialsState: FinancialsState = {
  summary: null,
  revenueBreakdown: null,
  expenseBreakdown: null,
  cashFlow: null,
  roiData: null,
  projections: null,
  startDate: null,
  endDate: null,
  selectedPropertyIds: [],
  isLoading: false,
  error: null
};

export const financialsReducer = createReducer(
  initialFinancialsState,
  // Load Financial Summary
  on(FinancialsActions.loadFinancialSummary, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(FinancialsActions.loadFinancialSummarySuccess, (state, { summary }) => ({
    ...state,
    summary,
    isLoading: false,
    error: null
  })),
  on(FinancialsActions.loadFinancialSummaryFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),
  // Load Revenue Breakdown
  on(FinancialsActions.loadRevenueBreakdown, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(FinancialsActions.loadRevenueBreakdownSuccess, (state, { breakdown }) => ({
    ...state,
    revenueBreakdown: breakdown,
    isLoading: false,
    error: null
  })),
  on(FinancialsActions.loadRevenueBreakdownFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),
  // Load Expense Breakdown
  on(FinancialsActions.loadExpenseBreakdown, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(FinancialsActions.loadExpenseBreakdownSuccess, (state, { breakdown }) => ({
    ...state,
    expenseBreakdown: breakdown,
    isLoading: false,
    error: null
  })),
  on(FinancialsActions.loadExpenseBreakdownFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),
  // Load Cash Flow
  on(FinancialsActions.loadCashFlow, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(FinancialsActions.loadCashFlowSuccess, (state, { cashFlow }) => ({
    ...state,
    cashFlow,
    isLoading: false,
    error: null
  })),
  on(FinancialsActions.loadCashFlowFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),
  // Load ROI Data
  on(FinancialsActions.loadRoiData, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(FinancialsActions.loadRoiDataSuccess, (state, { roiData }) => ({
    ...state,
    roiData,
    isLoading: false,
    error: null
  })),
  on(FinancialsActions.loadRoiDataFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),
  // Load Projections
  on(FinancialsActions.loadProjections, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(FinancialsActions.loadProjectionsSuccess, (state, { projections }) => ({
    ...state,
    projections,
    isLoading: false,
    error: null
  })),
  on(FinancialsActions.loadProjectionsFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),
  // Update Time Range
  on(FinancialsActions.updateTimeRange, (state, { startDate, endDate }) => ({
    ...state,
    startDate,
    endDate
  })),
  // Update Selected Properties
  on(FinancialsActions.updateSelectedProperties, (state, { propertyIds }) => ({
    ...state,
    selectedPropertyIds: propertyIds
  }))
);
