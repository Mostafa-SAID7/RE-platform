import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ButtonComponent, SelectComponent } from '../../../shared/ui';
import { MetricsSelectorComponent } from './metrics-selector.component';

interface PropertyOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-custom-report-builder',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ButtonComponent,
    SelectComponent,
    MetricsSelectorComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white dark:bg-gray-900 rounded-lg shadow dark:shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-800 transition-colors duration-200">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Custom Report Builder</h2>
      <form [formGroup]="form" class="space-y-4">
        <!-- Date Range Picker -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex flex-col relative">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start Date</label>
            <div class="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus-within:ring-2 focus-within:ring-blue-500 dark:focus-within:ring-blue-400">
              <input 
                matInput 
                [matDatepicker]="startPicker" 
                formControlName="startDate"
                class="flex-1 bg-transparent text-gray-900 dark:text-white outline-none"
                placeholder="Select start date">
              <mat-datepicker-toggle [for]="startPicker" class="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"></mat-datepicker-toggle>
              <mat-datepicker #startPicker="matDatepicker"></mat-datepicker>
            </div>
          </div>
          <div class="flex flex-col relative">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">End Date</label>
            <div class="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus-within:ring-2 focus-within:ring-blue-500 dark:focus-within:ring-blue-400">
              <input 
                matInput 
                [matDatepicker]="endPicker" 
                formControlName="endDate"
                class="flex-1 bg-transparent text-gray-900 dark:text-white outline-none"
                placeholder="Select end date">
              <mat-datepicker-toggle [for]="endPicker" class="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"></mat-datepicker-toggle>
              <mat-datepicker #endPicker="matDatepicker"></mat-datepicker>
            </div>
          </div>
        </div>

        <app-select
          id="properties"
          label="Properties"
          placeholder="Select properties"
          formControlName="properties"
          [options]="propertyOptions">
        </app-select>

        <!-- Metrics Selection -->
        <app-metrics-selector
          [selectedMetrics]="selectedMetrics"
          (metricsChange)="onMetricsChange($event)">
        </app-metrics-selector>

        <!-- Action Buttons -->
        <div class="flex gap-4 pt-4">
          <app-button
            label="Preview"
            variant="secondary"
            (click)="onPreview()">
          </app-button>
          <app-button
            label="Generate Report"
            variant="success"
            (click)="onGenerate()">
          </app-button>
        </div>
      </form>
    </div>
  `
})
export class CustomReportBuilderComponent {
  @Input() form!: FormGroup;
  @Input() propertyOptions: PropertyOption[] = [];
  @Input() selectedMetrics: string[] = [];
  @Output() preview = new EventEmitter<void>();
  @Output() generate = new EventEmitter<void>();

  onMetricsChange(metrics: string[]): void {
    this.selectedMetrics = metrics;
  }

  onPreview(): void {
    if (this.form.valid) {
      this.preview.emit();
    }
  }

  onGenerate(): void {
    if (this.form.valid) {
      this.generate.emit();
    }
  }
}
