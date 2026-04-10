import { Component, Output, EventEmitter, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputComponent, CheckboxComponent, ButtonComponent } from '../../../shared/ui';

export interface PropertyFilters {
  priceRange: { min: number; max: number };
  locations: string[];
  statuses: string[];
  types: string[];
  occupancyMin: number;
}

@Component({
  selector: 'app-filter-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, InputComponent, CheckboxComponent, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white dark:bg-gray-900 rounded-lg shadow-md dark:shadow-lg p-6 border border-gray-200 dark:border-gray-800 transition-colors duration-200">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
        <button (click)="clearFilters()"
                class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
          Clear All
        </button>
      </div>

      <!-- Price Range -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price Range</label>
        <div class="flex flex-col sm:flex-row gap-2">
          <app-input
            id="minPrice"
            type="number"
            placeholder="Min price"
            [(ngModel)]="minPrice"
            class="flex-1">
          </app-input>
          <app-input
            id="maxPrice"
            type="number"
            placeholder="Max price"
            [(ngModel)]="maxPrice"
            class="flex-1">
          </app-input>
        </div>
      </div>

      <!-- Property Type -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Property Type</label>
        <div class="space-y-2">
          <app-checkbox
            id="residential"
            label="Residential"
            [(ngModel)]="selectedTypes"
            value="residential">
          </app-checkbox>
          <app-checkbox
            id="commercial"
            label="Commercial"
            [(ngModel)]="selectedTypes"
            value="commercial">
          </app-checkbox>
          <app-checkbox
            id="mixed-use"
            label="Mixed-Use"
            [(ngModel)]="selectedTypes"
            value="mixed-use">
          </app-checkbox>
        </div>
      </div>

      <!-- Occupancy Status -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Occupancy Status</label>
        <div class="space-y-2">
          <app-checkbox
            id="occupied"
            label="Occupied"
            [(ngModel)]="selectedStatuses"
            value="occupied">
          </app-checkbox>
          <app-checkbox
            id="vacant"
            label="Vacant"
            [(ngModel)]="selectedStatuses"
            value="vacant">
          </app-checkbox>
          <app-checkbox
            id="maintenance"
            label="Maintenance"
            [(ngModel)]="selectedStatuses"
            value="maintenance">
          </app-checkbox>
        </div>
      </div>

      <!-- Apply Button -->
      <app-button
        label="Apply Filters"
        variant="primary"
        [fullWidth]="true"
        (click)="applyFilters()">
      </app-button>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class FilterPanelComponent {
  @Output() filtersApplied = new EventEmitter<PropertyFilters>();
  @Output() filtersCleared = new EventEmitter<void>();

  minPrice = signal<number>(0);
  maxPrice = signal<number>(10000000);
  selectedTypes = signal<string[]>([]);
  selectedStatuses = signal<string[]>([]);

  applyFilters(): void {
    const filters: PropertyFilters = {
      priceRange: {
        min: this.minPrice(),
        max: this.maxPrice()
      },
      types: this.selectedTypes(),
      statuses: this.selectedStatuses(),
      locations: [],
      occupancyMin: 0
    };
    this.filtersApplied.emit(filters);
  }

  clearFilters(): void {
    this.minPrice.set(0);
    this.maxPrice.set(10000000);
    this.selectedTypes.set([]);
    this.selectedStatuses.set([]);
    this.filtersCleared.emit();
  }
}
