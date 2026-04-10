import { Component, OnInit, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { debounceTime, Subject } from 'rxjs';
import { TenantListComponent } from './components/tenant-list.component';
import { Tenant } from '../../models/tenant.model';
import { InputComponent, ButtonComponent, EmptyStateComponent } from '../../shared/ui';

@Component({
  selector: 'app-tenant-management',
  standalone: true,
  imports: [CommonModule, FormsModule, TenantListComponent, InputComponent, ButtonComponent, EmptyStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-6 bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors duration-200">
      <!-- Header -->
      <div class="flex justify-between items-start mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Tenant Management</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-2">Manage all tenants and their information</p>
        </div>
        <app-button
          label="+ Add Tenant"
          variant="primary"
          (click)="addTenant()">
        </app-button>
      </div>

      <!-- Search and Filters -->
      <div class="bg-white dark:bg-gray-900 rounded-lg shadow-md dark:shadow-lg p-4 mb-6 border border-gray-200 dark:border-gray-800 transition-colors duration-200">
        <app-input
          id="search"
          type="text"
          placeholder="Search by name, email, or city..."
          [(ngModel)]="searchQuery"
          (valueChange)="onSearchChange($event)">
        </app-input>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-3">
          Showing {{ filteredTenants().length }} of {{ tenants().length }} tenants
        </p>
      </div>

      <!-- Tenant List or Empty State -->
      <div *ngIf="filteredTenants().length > 0; else noTenants">
        <app-tenant-list
          [tenants]="filteredTenants()"
          (tenantSelected)="viewTenantDetail($event)">
        </app-tenant-list>
      </div>

      <ng-template #noTenants>
        <app-empty-state
          title="No tenants found"
          description="Start by adding a new tenant to your portfolio"
          icon="users"
          actionLabel="Add Tenant"
          (action)="addTenant()">
        </app-empty-state>
      </ng-template>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class TenantManagementComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);

  // Signals
  tenants = signal<Tenant[]>([]);
  filteredTenants = signal<Tenant[]>([]);
  searchQuery = signal<string>('');

  private searchSubject = new Subject<string>();

  ngOnInit(): void {
    this.loadTenants();
    this.setupSearchDebounce();
  }

  private loadTenants(): void {
    this.store.select(state => (state as any).tenants?.items || [])
      .subscribe(tenants => {
        this.tenants.set(tenants);
        this.applyFilters();
      });
  }

  private setupSearchDebounce(): void {
    this.searchSubject.pipe(
      debounceTime(300)
    ).subscribe(() => {
      this.applyFilters();
    });
  }

  onSearchChange(query: string): void {
    this.searchQuery.set(query);
    this.searchSubject.next(query);
  }

  applyFilters(): void {
    let filtered = this.tenants();

    // Apply search
    if (this.searchQuery().length > 0) {
      const query = this.searchQuery().toLowerCase();
      filtered = filtered.filter(t =>
        t.name?.toLowerCase().includes(query) ||
        t.email?.toLowerCase().includes(query) ||
        t.address?.city?.toLowerCase().includes(query)
      );
    }

    this.filteredTenants.set(filtered);
  }

  viewTenantDetail(tenant: Tenant): void {
    this.router.navigate(['/tenants', tenant.id]);
  }

  addTenant(): void {
    this.router.navigate(['/tenants/new']);
  }
}
