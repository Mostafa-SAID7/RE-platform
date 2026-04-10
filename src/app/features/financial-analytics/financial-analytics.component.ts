import { Component, OnInit, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { FinancialService } from '../../services/financial.service';
import { selectFinancialSummary, selectFinancialsIsLoading } from '../../store/financials/financials.selectors';
import { loadFinancialSummary } from '../../store/financials/financials.actions';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-financial-analytics',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SelectModule, ButtonModule, CardModule],
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
        <p-card class="mb-6">
          <form [formGroup]="periodForm" class="flex gap-4 items-end">
            <div class="flex-1">
              <label for="period" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Period</label>
              <p-select
                id="period"
                formControlName="period"
                [options]="periodOptions"
                optionLabel="label"
                optionValue="value">
              </p-select>
            </div>
            <p-button
              label="Load Data"
              icon="pi pi-refresh"
              (click)="loadMetrics()">
            </p-button>
          </form>
        </p-card>

        <!-- Summary Metrics -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <p-card>
            <ng-template pTemplate="header">
              <div class="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Revenue</div>
            </ng-template>
            <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ totalRevenue() | currency }}</p>
            <p class="text-green-600 dark:text-green-400 text-sm mt-2">+12% from last period</p>
          </p-card>
          <p-card>
            <ng-template pTemplate="header">
              <div class="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Expenses</div>
            </ng-template>
            <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ totalExpenses() | currency }}</p>
            <p class="text-red-600 dark:text-red-400 text-sm mt-2">+5% from last period</p>
          </p-card>
          <p-card>
            <ng-template pTemplate="header">
              <div class="text-gray-600 dark:text-gray-400 text-sm font-medium">Net Profit</div>
            </ng-template>
            <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ netProfit() | currency }}</p>
            <p class="text-green-600 dark:text-green-400 text-sm mt-2">+18% from last period</p>
          </p-card>
        </div>

        <!-- Charts Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <p-card>
            <ng-template pTemplate="header">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Revenue Breakdown</h2>
            </ng-template>
            <div class="h-64 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
              <p class="text-gray-500 dark:text-gray-400">Revenue chart placeholder</p>
            </div>
          </p-card>
          <p-card>
            <ng-template pTemplate="header">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Expense Breakdown</h2>
            </ng-template>
            <div class="h-64 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
              <p class="text-gray-500 dark:text-gray-400">Expense chart placeholder</p>
            </div>
          </p-card>
        </div>

        <!-- ROI and Cash Flow -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <p-card>
            <ng-template pTemplate="header">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">ROI by Property</h2>
            </ng-template>
            <div class="h-64 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
              <p class="text-gray-500 dark:text-gray-400">ROI chart placeholder</p>
            </div>
          </p-card>
          <p-card>
            <ng-template pTemplate="header">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Cash Flow Analysis</h2>
            </ng-template>
            <div class="h-64 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
              <p class="text-gray-500 dark:text-gray-400">Cash flow chart placeholder</p>
            </div>
          </p-card>
        </div>

        <!-- Export Section -->
        <p-card class="mt-6">
          <ng-template pTemplate="header">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Export Report</h2>
          </ng-template>
          <div class="flex gap-4">
            <p-button label="Export as PDF" severity="success" (click)="exportPDF()"></p-button>
            <p-button label="Export as Excel" (click)="exportExcel()"></p-button>
            <p-button label="Export as CSV" severity="secondary" (click)="exportCSV()"></p-button>
          </div>
        </p-card>
      </div>
    </div>
  `
})
export class FinancialAnalyticsComponent implements OnInit {
  private store = inject(Store);
  private fb = inject(FormBuilder);

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
