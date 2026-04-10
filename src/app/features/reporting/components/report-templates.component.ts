import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-report-templates',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mb-8">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Pre-built Templates</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <p-card *ngFor="let template of templates" class="cursor-pointer hover:shadow-lg transition">
          <ng-template pTemplate="header">
            <h3 class="font-semibold text-gray-900 dark:text-white">{{ template.title }}</h3>
          </ng-template>
          <p class="text-gray-600 dark:text-gray-400 text-sm">{{ template.description }}</p>
          <ng-template pTemplate="footer">
            <p-button label="Generate" icon="pi pi-download" class="w-full"></p-button>
          </ng-template>
        </p-card>
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
