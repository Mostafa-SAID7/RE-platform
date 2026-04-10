import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ReportRecord {
  name: string;
  type: string;
  generated: string;
}

@Component({
  selector: 'app-report-history',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white dark:bg-gray-900 rounded-lg shadow dark:shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800 transition-colors duration-200">
      <div class="p-6 border-b border-gray-200 dark:border-gray-800">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Report History</h2>
      </div>
      <table class="w-full">
        <thead class="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <tr>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Report Name</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Type</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Generated</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr *ngFor="let report of reports" class="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <td class="px-6 py-4 text-sm text-gray-900 dark:text-white">{{ report.name }}</td>
            <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{{ report.type }}</td>
            <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{{ report.generated }}</td>
            <td class="px-6 py-4 text-sm">
              <button class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-4 transition-colors">Download</button>
              <button class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class ReportHistoryComponent {
  reports: ReportRecord[] = [
    {
      name: 'Q4 2024 Revenue Report',
      type: 'Revenue',
      generated: 'Dec 15, 2024'
    }
  ];
}
