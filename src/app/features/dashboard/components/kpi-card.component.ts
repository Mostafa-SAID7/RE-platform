import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6 transition-colors duration-200 border border-gray-200 dark:border-gray-700">
      <div class="flex justify-between items-start">
        <div>
          <p class="text-gray-600 dark:text-gray-400 text-sm font-medium">{{ label }}</p>
          <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">{{ formattedValue }}</p>
          <p class="text-sm mt-2" [ngClass]="trendClass">
            <span [ngClass]="trendIconClass">{{ trendIcon }}</span>
            {{ trendText }}
          </p>
        </div>
        <div class="text-3xl" [ngClass]="iconColorClass">
          {{ icon }}
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
export class KpiCardComponent {
  @Input() label: string = '';
  @Input() value: number = 0;
  @Input() icon: string = '';
  @Input() trend: number = 0;
  @Input() format: 'number' | 'currency' | 'percent' = 'number';
  @Input() borderColor: 'blue' | 'green' | 'orange' | 'red' = 'blue';

  get formattedValue(): string {
    switch (this.format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 0
        }).format(this.value);
      case 'percent':
        return `${this.value.toFixed(1)}%`;
      default:
        return new Intl.NumberFormat('en-US').format(this.value);
    }
  }

  get trendIcon(): string {
    if (this.trend > 0) return '↑';
    if (this.trend < 0) return '↓';
    return '→';
  }

  get trendText(): string {
    const absValue = Math.abs(this.trend);
    if (this.trend > 0) return `+${absValue.toFixed(1)}% vs last month`;
    if (this.trend < 0) return `${absValue.toFixed(1)}% vs last month`;
    return 'No change vs last month';
  }

  get trendClass(): string {
    if (this.trend > 0) return 'text-green-600 dark:text-green-400';
    if (this.trend < 0) return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  }

  get trendIconClass(): string {
    if (this.trend > 0) return 'text-green-600 dark:text-green-400';
    if (this.trend < 0) return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  }

  get borderColorClass(): string {
    const colorMap = {
      blue: 'border-blue-500',
      green: 'border-green-500',
      orange: 'border-orange-500',
      red: 'border-red-500'
    };
    return colorMap[this.borderColor];
  }

  get iconColorClass(): string {
    const colorMap = {
      blue: 'text-blue-500',
      green: 'text-green-500',
      orange: 'text-orange-500',
      red: 'text-red-500'
    };
    return colorMap[this.borderColor];
  }
}
