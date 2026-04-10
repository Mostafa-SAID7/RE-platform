import { Component, OnInit, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { FinancialService } from '../../services/financial.service';
import { selectFinancialSummary, selectFinancialsIsLoading } from '../../store/financials/financials.selectors';
import { loadFinancialSummary } from '../../store/financials/financials.actions';
import { SelectComponent, ButtonComponent } from '../../shared/ui';

@Component({
  selector: 'app-financial-analytics',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SelectComponent, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-6 bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors duration-200">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Financial Analytics</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-2">Comprehensive financial metrics and analysis</p>
        </div>

        <!-- Period Selector -->
        <div class="bg-white dark:bg-gray-900 rounded-lg shadow dark:shadow-lg p-6 mb-6 border border-gray-200 dark:border-gray-800 transition-colors duration-200">
          <form [formGroup]="periodForm" class="flex gap-4 items-end">
            <div class="flex-1">
              <app-select
                id="period"
                label="Period"
                formControlName="period"
                [options]="periodOptions">
              </app-select>
            </div>
            <app-button
              label="Load Data"
              variant="primary"
              (click)="loadMetrics()">
            </app-button>
          </form>
        </div>

        <!-- Summary Metrics -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div class="bg-white dark:bg-gray-900 rounded-lg shadow dark:shadow-lg p-6 border border-gray-200 dark:border-gray-800 transition-colors duration-200">
            <h3 class="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Revenue</h3>
            <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">{{ totalRevenue() | currency }}</p>
            <p class="text-green-600 dark:text-green-400 text-sm mt-2">+12% from last period</p>
          </div>
          <div class="bg-white dark:bg-gray-900 rounded-lg shadow dark:shadow-lg p-6 border border-gray-200 dark:border-gray-800 transition-colors duration-200">
            <h3 class="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Expenses</h3>
            <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">{{ totalExpenses() | currency }}</p>
            <p class="text-red-600 dark:text-red-400 text-sm mt-2">+5% from last period</p>
          </div>
          <div class="bg-white dark:bg-gray-900 rounded-lg shadow dark:shadow-lg p-6 border border-gray-200 dark:border-gray-800 transition-colors duration-200">
            <h3 class="text-gray-600 dark:text-gray-400 text-sm font-medium">Net Profit</h3>
            <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">{{ netProfit() | currency }}</p>
            <p class="text-green-600 dark:text-green-400 text-sm mt-2">+18% from last period</p>
          </div>
        </div>

        <!-- Charts Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-white dark:bg-gray-900 rounded-lg shadow dark:shadow-lg p-6 border border-gray-200 dark:border-gray-800 transition-colors duration-200">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue Breakdown</h2>
            <div class="h-64 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
              <p class="text-gray-500 dark:text-gray-400">Revenue chart placeholder</p>
            </div>
          </div>
          <div class="bg-white dark:bg-gray-900 rounded-lg shadow dark:shadow-lg p-6 border border-gray-200 dark:border-gray-800 transition-colors duration-200">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Expense Breakdown</h2>
            <div class="h-64 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
              <p class="text-gray-500 dark:text-gray-400">Expense chart placeholder</p>
            </div>
          </div>
        </div>

        <!-- ROI and Cash Flow -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div class="bg-white dark:bg-gray-900 rounded-lg shadow dark:shadow-lg p-6 border border-gray-200 dark:border-gray-800 transition-colors duration-200">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">ROI by Property</h2>
            <div class="h-64 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
              <p class="text-gray-500 dark:text-gray-400">ROI chart placeholder</p>
            </div>
          </div>
          <div class="bg-white dark:bg-gray-900 rounded-lg shadow dark:shadow-lg p-6 border border-gray-200 dark:border-gray-800 transition-colors duration-200">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cash Flow Analysis</h2>
            <div class="h-64 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
              <p class="text-gray-500 dark:text-gray-400">Cash flow chart placeholder</p>
            </div>
          </div>
        </div>

        <!-- Export Section -->
        <div class="bg-white dark:bg-gray-900 rounded-lg shadow dark:shadow-lg p-6 mt-6 border border-gray-200 dark:border-gray-800 transition-colors duration-200">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Export Report</h2>
          <div class="flex gap-4">
            <app-button label="Export as PDF" variant="success" (click)="exportPDF()"></app-button>
            <app-button label="Export as Excel" variant="primary" (click)="exportExcel()"></app-button>
            <app-button label="Export as CSV" variant="secondary" (click)="exportCSV()"></app-button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class FinancialAnalyticsComponent implements OnInit {
  private store = inject(Store);
  private fb = inject(FormBuilder);
  private financialService = inject(FinancialService);

  periodForm: FormGroup;
  financialMetrics$: Observable<any>;
  isLoading$: Observable<boolean>;

  // Signals for metrics
  totalRevenue = signal<number>(0);
  totalExpenses = signal<number>(0);
  netProfit = computed(() => this.totalRevenue() - this.totalExpenses());

  periodOptions = [
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  constructor() {
    this.periodForm = this.fb.group({
      period: ['month']
    });

    this.financialMetrics$ = this.store.select(selectFinancialSummary);
    this.isLoading$ = this.store.select(selectFinancialsIsLoading);
  }

  ngOnInit(): void {
    this.loadMetrics();
    this.financialMetrics$.subscribe(metrics => {
      if (metrics) {
        this.totalRevenue.set(metrics.totalRevenue || 0);
        this.totalExpenses.set(metrics.totalExpenses || 0);
      }
    });
  }

  loadMetrics(): void {
    const period = this.periodForm.get('period')?.value || 'month';
    this.store.dispatch(loadFinancialSummary({}));
  }

  exportPDF(): void {
    console.log('Export as PDF');
  }

  exportExcel(): void {
    console.log('Export as Excel');
  }

  exportCSV(): void {
    console.log('Export as CSV');
  }
}
