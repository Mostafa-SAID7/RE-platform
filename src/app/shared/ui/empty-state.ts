import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col items-center justify-center py-12 px-4">
      <div class="text-center">
        <!-- Icon -->
        <div class="mb-4 flex justify-center">
          <svg *ngIf="icon === 'search'" class="h-16 w-16 text-gray-400 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <svg *ngIf="icon === 'inbox'" class="h-16 w-16 text-gray-400 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <svg *ngIf="icon === 'folder'" class="h-16 w-16 text-gray-400 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          <svg *ngIf="icon === 'chart'" class="h-16 w-16 text-gray-400 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <svg *ngIf="icon === 'users'" class="h-16 w-16 text-gray-400 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 8.048M12 4.354L8.646 7.708m6.708 0L15.354 7.708M9 20h6a2 2 0 002-2v-1a6 6 0 00-12 0v1a2 2 0 002 2z" />
          </svg>
        </div>

        <!-- Title -->
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {{ title }}
        </h3>

        <!-- Description -->
        <p *ngIf="description" class="text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
          {{ description }}
        </p>

        <!-- Action Button -->
        <app-button
          *ngIf="actionLabel"
          [label]="actionLabel"
          variant="primary"
          (click)="onAction()"
        ></app-button>
      </div>
    </div>
  `,
  styles: []
})
export class EmptyStateComponent {
  @Input() title: string = 'No data found';
  @Input() description: string = '';
  @Input() icon: 'search' | 'inbox' | 'folder' | 'chart' | 'users' = 'inbox';
  @Input() actionLabel: string = '';
  @Output() action = new EventEmitter<void>();

  onAction(): void {
    this.action.emit();
  }
}
