import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Property } from '../../../models/property.model';

@Component({
  selector: 'app-property-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg hover:shadow-lg dark:hover:shadow-xl transition-all duration-200 overflow-hidden cursor-pointer border border-gray-200 dark:border-gray-700"
         (click)="selectProperty()">
      <!-- Image -->
      <div class="relative h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <img *ngIf="property.photos && property.photos.length > 0"
             [src]="property.photos[0]?.url"
             alt="Property"
             class="w-full h-full object-cover">
        <div *ngIf="!property.photos || property.photos.length === 0"
             class="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600">
          <span class="text-4xl">🏠</span>
        </div>
        
        <!-- Status Badge -->
        <div class="absolute top-3 right-3">
          <span class="px-3 py-1 rounded-full text-xs font-semibold"
                [ngClass]="getStatusClass()">
            {{ property.status | titlecase }}
          </span>
        </div>
      </div>

      <!-- Content -->
      <div class="p-4">
        <!-- Address -->
        <h3 class="font-semibold text-gray-900 dark:text-white truncate">
          {{ property.address.street }}
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {{ property.address.city }}, {{ property.address.state }}
        </p>

        <!-- Property Details -->
        <div class="grid grid-cols-2 gap-2 mt-3 text-sm">
          <div>
            <p class="text-gray-600 dark:text-gray-400">Type</p>
            <p class="font-semibold text-gray-900 dark:text-white">{{ property.type | titlecase }}</p>
          </div>
          <div>
            <p class="text-gray-600 dark:text-gray-400">Size</p>
            <p class="font-semibold text-gray-900 dark:text-white">{{ property.sizeSqft | number }} sqft</p>
          </div>
        </div>

        <!-- Financial Metrics -->
        <div class="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-sm">
          <div>
            <p class="text-gray-600 dark:text-gray-400">Monthly Revenue</p>
            <p class="font-semibold text-green-600 dark:text-green-400">
              {{ property.monthlyRevenue | currency }}
            </p>
          </div>
          <div>
            <p class="text-gray-600 dark:text-gray-400">ROI</p>
            <p class="font-semibold" [ngClass]="property.roi >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
              {{ property.roi | number: '1.1-1' }}%
            </p>
          </div>
        </div>

        <!-- Checkbox for bulk selection -->
        <div class="mt-4 flex items-center">
          <input type="checkbox"
                 [id]="'select-' + property.id"
                 [checked]="isSelected"
                 (change)="toggleSelection($event)"
                 (click)="$event.stopPropagation()"
                 class="w-4 h-4 text-blue-600 dark:text-blue-400 rounded accent-blue-600 dark:accent-blue-400">
          <label [for]="'select-' + property.id" class="ml-2 text-sm text-gray-600 dark:text-gray-400">Select for bulk action</label>
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
export class PropertyCardComponent {
  @Input() property!: Property;
  @Input() isSelected: boolean = false;
  @Output() propertySelected = new EventEmitter<Property>();
  @Output() selectionChanged = new EventEmitter<boolean>();

  selectProperty(): void {
    this.propertySelected.emit(this.property);
  }

  toggleSelection(event: Event): void {
    event.stopPropagation();
    this.selectionChanged.emit(!this.isSelected);
  }

  getStatusClass(): string {
    const statusMap = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      maintenance: 'bg-yellow-100 text-yellow-800'
    };
    return statusMap[this.property.status as keyof typeof statusMap] || 'bg-gray-100 text-gray-800';
  }
}
