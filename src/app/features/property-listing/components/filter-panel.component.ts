import { Component, Output, EventEmitter, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';

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
  imports: [CommonModule, FormsModule, InputNumberModule, CheckboxModule, ButtonModule],
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
      <fieldset class="border-0 p-0 m-0 mb-6">
        <legend class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price Range</legend>
        <div class="flex flex-col sm:flex-row gap-2">
          <p-inputNumber
            [(ngModel)]="minPrice"
            placeholder="Min price"
            [useGrouping]="false"
            class="flex-1">
          </p-inputNumber>
          <p-inputNumber
            [(ngModel)]="maxPrice"
            placeholder="Max price"
            [useGrouping]="false"
            class="flex-1">
          </p-inputNumber>
        </div>
      </fieldset>

      <!-- Property Type -->
      <fieldset class="border-0 p-0 m-0 mb-6">
        <legend class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Property Type</legend>
        <div class="space-y-2">
          <div class="flex items-center">
            <p-checkbox
              [(ngModel)]="selectedTypes"
              value="residential"
              [binary]="false">
            </p-checkbox>
            <label class="ml-2 text-sm text-gray-700 dark:text-gray-300">Residential</label>
          </div>
          <div class="flex items-center">
            <p-checkbox
              [(ngModel)]="selectedTypes"
              value="commercial"
              [binary]="false">
            </p-checkbox>
            <label class="ml-2 text-sm text-gray-700 dark:text-gray-300">Commercial</label>
          </div>
          <div class="flex items-center">
            <p-checkbox
              [(ngModel)]="selectedTypes"
              value="mixed-use"
              [binary]="false">
            </p-checkbox>
            <label class="ml-2 text-sm text-gray-700 dark:text-gray-300">Mixed-Use</label>
          </div>
        </div>
      </fieldset>

      <!-- Occupancy Status -->
      <fieldset class="border-0 p-0 m-0 mb-6">
        <legend class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Occupancy Status</legend>
        <div class="space-y-2">
          <div class="flex items-center">
            <p-checkbox
              [(ngModel)]="selectedStatuses"
              value="occupied"
              [binary]="false">
            </p-checkbox>
            <label class="ml-2 text-sm text-gray-700 dark:text-gray-300">Occupied</label>
          </div>
          <div class="flex items-center">
            <p-checkbox
              [(ngModel)]="selectedStatuses"
              value="vacant"
              [binary]="false">
            </p-checkbox>
            <label class="ml-2 text-sm text-gray-700 dark:text-gray-300">Vacant</label>
          </div>
          <div class="flex items-center">
            <p-checkbox
              [(ngModel)]="selectedStatuses"
              value="maintenance"
              [binary]="false">
            </p-checkbox>
            <label class="ml-2 text-sm text-gray-700 dark:text-gray-300">Maintenance</label>
          </div>
        </div>
      </fieldset>

      <!-- Apply Button -->
      <p-button
        label="Apply Filters"
        icon="pi pi-check"
        (click)="applyFilters()"
        class="w-full">
      </p-button>
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
