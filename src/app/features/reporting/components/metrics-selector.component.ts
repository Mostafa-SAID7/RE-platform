import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';

interface Metric {
  id: string;
  label: string;
}

@Component({
  selector: 'app-metrics-selector',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CheckboxModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <fieldset class="border-0 p-0 m-0">
      <legend class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Metrics</legend>
      <div class="space-y-2">
        <div *ngFor="let metric of metrics" class="flex items-center">
          <p-checkbox
            [formControl]="getMetricControl(metric.id)"
            [binary]="true">
          </p-checkbox>
          <label class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ metric.label }}</label>
        </div>
      </div>
    </fieldset>
  `
})
export class MetricsSelectorComponent {
  @Input() selectedMetrics: string[] = [];
  @Output() metricsChange = new EventEmitter<string[]>();

  private fb = new FormBuilder();
  metricsForm: FormGroup;

  metrics: Metric[] = [
    { id: 'revenue', label: 'Revenue' },
    { id: 'expenses', label: 'Expenses' },
    { id: 'occupancy', label: 'Occupancy' },
    { id: 'roi', label: 'ROI' }
  ];

  constructor() {
    this.metricsForm = this.fb.group({
      revenue: [false],
      expenses: [false],
      occupancy: [false],
      roi: [false]
    });

    this.metricsForm.valueChanges.subscribe(() => {
      const selected = Object.keys(this.metricsForm.value).filter(key => this.metricsForm.value[key]);
      this.metricsChange.emit(selected);
    });
  }

  getMetricControl(metricId: string): FormControl {
    return this.metricsForm.get(metricId) as FormControl;
  }
}
