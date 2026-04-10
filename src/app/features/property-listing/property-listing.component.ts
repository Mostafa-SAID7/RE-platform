import { Component, OnInit, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { debounceTime, Subject } from 'rxjs';
import { PropertyCardComponent } from './components/property-card.component';
import { FilterPanelComponent, PropertyFilters } from './components/filter-panel.component';
import { Property } from '../../models/property.model';
import { InputComponent, EmptyStateComponent } from '../../shared/ui';

@Component({
  selector: 'app-property-listing',
  standalone: true,
  imports: [CommonModule, FormsModule, PropertyCardComponent, FilterPanelComponent, InputComponent, EmptyStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-4 md:p-6 bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors duration-200">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Property Listings</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">Manage and view all properties in your portfolio</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
        <!-- Sidebar Filters -->
        <div class="lg:col-span-1">
          <app-filter-panel
            (filtersApplied)="applyFilters($event)"
            (filtersCleared)="clearFilters()">
          </app-filter-panel>
        </div>

        <!-- Main Content -->
        <div class="lg:col-span-3">
          <!-- Search and Controls -->
          <div class="bg-white dark:bg-gray-900 rounded-lg shadow-md dark:shadow-lg p-4 mb-6 border border-gray-200 dark:border-gray-800 transition-colors duration-200">
            <div class="flex gap-4 mb-4 flex-col md:flex-row">
              <app-input
                id="search"
                type="text"
                placeholder="Search by address or property name..."
                [(ngModel)]="searchQuery"
                (valueChange)="onSearchChange($event)"
                class="flex-1">
              </app-input>
              
              <select [(ngModel)]="sortField"
                      (ngModelChange)="applySorting($event)"
                      class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors">
                <option value="address">Sort by Address</option>
                <option value="price">Sort by Price</option>
                <option value="occupancy">Sort by Occupancy</option>
                <option value="revenue">Sort by Revenue</option>
                <option value="roi">Sort by ROI</option>
              </select>
            </div>

            <!-- Results Info -->
            <div class="flex justify-between items-center flex-col md:flex-row gap-2">
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Showing {{ filteredProperties().length }} of {{ properties().length }} properties
              </p>
              <div *ngIf="hasActiveFilters()" class="flex gap-2">
                <span class="text-sm text-blue-600 dark:text-blue-400">Filters active</span>
                <button (click)="clearFilters()"
                        class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline transition-colors">
                  Clear all
                </button>
              </div>
            </div>
          </div>

          <!-- Bulk Actions -->
          <div *ngIf="selectedProperties().size > 0"
               class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 transition-colors duration-200">
            <div class="flex justify-between items-center flex-col md:flex-row gap-4">
              <p class="text-sm font-medium text-blue-900 dark:text-blue-200">
                {{ selectedProperties().size }} properties selected
              </p>
              <div class="flex gap-2 flex-wrap">
                <button (click)="exportSelected('csv')"
                        class="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-md text-sm hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                  Export CSV
                </button>
                <button (click)="exportSelected('excel')"
                        class="px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-md text-sm hover:bg-green-700 dark:hover:bg-green-600 transition-colors">
                  Export Excel
                </button>
              </div>
            </div>
          </div>

          <!-- Properties Grid or Empty State -->
          <div *ngIf="filteredProperties().length > 0; else noProperties" class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <app-property-card
              *ngFor="let property of filteredProperties(); trackBy: trackByPropertyId"
              [property]="property"
              [isSelected]="selectedProperties().has(property.id)"
              (propertySelected)="navigateToDetail($event)"
              (selectionChanged)="togglePropertySelection(property.id)">
            </app-property-card>
          </div>

          <ng-template #noProperties>
            <app-empty-state
              title="No properties found"
              description="Try adjusting your filters or search criteria"
              icon="folder"
              actionLabel="Clear filters"
              (action)="clearFilters()">
            </app-empty-state>
          </ng-template>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class PropertyListingComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);

  // Signals
  properties = signal<Property[]>([]);
  filteredProperties = signal<Property[]>([]);
  selectedProperties = signal<Set<string>>(new Set());
  searchQuery = signal<string>('');
  sortField = signal<string>('address');
  currentFilters = signal<PropertyFilters>({
    priceRange: { min: 0, max: 10000000 },
    locations: [],
    statuses: [],
    types: [],
    occupancyMin: 0
  });

  private searchSubject = new Subject<string>();

  // Computed
  hasActiveFilters = computed(() => {
    const filters = this.currentFilters();
    return filters.locations.length > 0 || 
           filters.statuses.length > 0 || 
           filters.types.length > 0 ||
           this.searchQuery().length > 0;
  });

  ngOnInit(): void {
    this.loadProperties();
    this.setupSearchDebounce();
  }

  private loadProperties(): void {
    this.store.select(state => (state as any).properties?.items || [])
      .subscribe(properties => {
        this.properties.set(properties);
        this.applyFiltersAndSort();
      });
  }

  private setupSearchDebounce(): void {
    this.searchSubject.pipe(
      debounceTime(300)
    ).subscribe(() => {
      this.applyFiltersAndSort();
    });
  }

  onSearchChange(query: string): void {
    this.searchQuery.set(query);
    this.searchSubject.next(query);
  }

  applyFilters(filters: PropertyFilters): void {
    this.currentFilters.set(filters);
    this.applyFiltersAndSort();
  }

  clearFilters(): void {
    this.searchQuery.set('');
    this.currentFilters.set({
      priceRange: { min: 0, max: 10000000 },
      locations: [],
      statuses: [],
      types: [],
      occupancyMin: 0
    });
    this.selectedProperties.set(new Set());
    this.applyFiltersAndSort();
  }

  private applyFiltersAndSort(): void {
    let filtered = this.properties();

    // Apply search
    if (this.searchQuery().length > 0) {
      const query = this.searchQuery().toLowerCase();
      filtered = filtered.filter(p =>
        p.address?.street?.toLowerCase().includes(query) ||
        p.address?.city?.toLowerCase().includes(query)
      );
    }

    // Apply filters
    const filters = this.currentFilters();
    if (filters.types.length > 0) {
      filtered = filtered.filter(p => filters.types.includes(p.type));
    }
    if (filters.statuses.length > 0) {
      filtered = filtered.filter(p => filters.statuses.includes(p.status));
    }

    // Apply sorting
    filtered = this.sortProperties(filtered);

    this.filteredProperties.set(filtered);
  }

  private sortProperties(props: Property[]): Property[] {
    const field = this.sortField();
    const sorted = [...props];

    switch (field) {
      case 'price':
        sorted.sort((a, b) => 0); // No price field in model
        break;
      case 'occupancy':
        sorted.sort((a, b) => (b.occupancyRate || 0) - (a.occupancyRate || 0));
        break;
      case 'revenue':
        sorted.sort((a, b) => (b.monthlyRevenue || 0) - (a.monthlyRevenue || 0));
        break;
      case 'roi':
        sorted.sort((a, b) => (b.roi || 0) - (a.roi || 0));
        break;
      default:
        sorted.sort((a, b) => 
          (a.address?.street || '').localeCompare(b.address?.street || '')
        );
    }

    return sorted;
  }

  applySorting(field: string): void {
    this.sortField.set(field);
    this.applyFiltersAndSort();
  }

  togglePropertySelection(propertyId: string): void {
    const selected = new Set(this.selectedProperties());
    if (selected.has(propertyId)) {
      selected.delete(propertyId);
    } else {
      selected.add(propertyId);
    }
    this.selectedProperties.set(selected);
  }

  exportSelected(format: 'csv' | 'excel'): void {
    const selected = Array.from(this.selectedProperties());
    const toExport = this.properties().filter(p => selected.includes(p.id));
    
    if (format === 'csv') {
      this.exportAsCSV(toExport);
    } else {
      this.exportAsExcel(toExport);
    }
  }

  private exportAsCSV(properties: Property[]): void {
    const headers = ['Address', 'Type', 'Status', 'Monthly Revenue', 'ROI'];
    const rows = properties.map(p => [
      `${p.address?.street}, ${p.address?.city}`,
      p.type,
      p.status,
      p.monthlyRevenue || 0,
      p.roi || 0
    ]);

    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `properties-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  }

  private exportAsExcel(properties: Property[]): void {
    // Placeholder for Excel export - would use xlsx library
    console.log('Excel export for', properties.length, 'properties');
  }

  navigateToDetail(property: Property): void {
    this.router.navigate(['/properties', property.id]);
  }

  trackByPropertyId(index: number, property: Property): string {
    return property.id;
  }
}
