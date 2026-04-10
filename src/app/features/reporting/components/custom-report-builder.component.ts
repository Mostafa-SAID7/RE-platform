import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
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
    CalendarModule,
    SelectModule,
    ButtonModule,
    CardModule,
    MetricsSelectorComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p-card class="mb-8">
      <ng-template pTemplate="header">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Custom Report Builder</h2>
      </ng-template>
      <form [formGroup]="form" class="space-y-4">
        <!-- Date Range Picker -->
        <fieldset class="border-0 p-0 m-0">
          <legend class="sr-only">Date Range</legend>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex flex-col">
              <label for="startDate" class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start Date</label>
              <p-calendar
                id="startDate"
                formControlName="startDate"
                [showIcon]="true"
                dateFormat="mm/dd/yy">
              </p-calendar>
            </div>
            <div class="flex flex-col">
              <label for="endDate" class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">End Date</label>
              <p-calendar
                id="endDate"
                formControlName="endDate"
                [showIcon]="true"
                dateFormat="mm/dd/yy">
              </p-calendar>
            </div>
          </div>
        </fieldset>

        <div class="flex flex-col">
          <label for="properties" class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Properties</label>
          <p-select
            id="properties"
            formControlName="properties"
            [options]="propertyOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Select properties">
          </p-select>
        </div>

        <!-- Metrics Selection -->
        <app-metrics-selector
          [selectedMetrics]="selectedMetrics"
          (metricsChange)="onMetricsChange($event)">
        </app-metrics-selector>

        <!-- Action Buttons -->
        <div class="flex gap-4 pt-4">
          <p-button
            label="Preview"
            icon="pi pi-eye"
            severity="secondary"
            (click)="onPreview()">
          </p-button>
          <p-button
            label="Generate Report"
            icon="pi pi-download"
            severity="success"
            (click)="onGenerate()">
          </p-button>
        </div>
      </form>
    </p-card>
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
