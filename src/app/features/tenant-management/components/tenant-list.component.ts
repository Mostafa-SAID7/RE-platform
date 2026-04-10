import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tenant } from '../../../models/tenant.model';

@Component({
  selector: 'app-tenant-list',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white dark:bg-gray-900 rounded-lg shadow-md dark:shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800 transition-colors duration-200">
      <table class="w-full">
        <thead class="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <tr>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Name</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Email</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Phone</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">City</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr *ngFor="let tenant of tenants" class="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <td class="px-6 py-4 text-sm text-gray-900 dark:text-white">{{ tenant.name }}</td>
            <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{{ tenant.email }}</td>
            <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{{ tenant.phone }}</td>
            <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{{ tenant.address.city }}</td>
            <td class="px-6 py-4 text-sm">
              <button (click)="viewTenant(tenant)"
                      class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors">
                View
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div *ngIf="tenants.length === 0" class="text-center py-12">
        <p class="text-gray-500 dark:text-gray-400">No tenants found</p>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class TenantListComponent {
  @Input() tenants: Tenant[] = [];
  @Output() tenantSelected = new EventEmitter<Tenant>();

  viewTenant(tenant: Tenant): void {
    this.tenantSelected.emit(tenant);
  }
}
