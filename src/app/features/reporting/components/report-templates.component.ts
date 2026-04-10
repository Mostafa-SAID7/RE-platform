import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/ui';

@Component({
  selector: 'app-report-templates',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mb-8">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Pre-built Templates</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div *ngFor="let template of templates" class="bg-white dark:bg-gray-900 rounded-lg shadow dark:shadow-lg p-6 cursor-pointer hover:shadow-lg dark:hover:shadow-xl transition border border-gray-200 dark:border-gray-800">
          <h3 class="font-semibold text-gray-900 dark:text-white">{{ template.title }}</h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm mt-2">{{ template.description }}</p>
          <app-button label="Generate" variant="primary" [fullWidth]="true" class="mt-4"></app-button>
        </div>
      </div>
    </div>
  `
})
export class ReportTemplatesComponent {
  templates = [
    {
      title: 'Occupancy Report',
      description: 'View occupancy metrics and trends'
    },
    {
      title: 'Revenue Report',
      description: 'Detailed revenue analysis'
    },
    {
      title: 'Maintenance Report',
      description: 'Work order and maintenance summary'
    },
    {
      title: 'Tenant Report',
      description: 'Tenant information and leases'
    }
  ];
}
