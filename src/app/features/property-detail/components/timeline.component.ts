import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  type: 'maintenance' | 'occupancy' | 'payment' | 'lease' | 'other';
  icon: string;
}

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white rounded-lg shadow-md p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-6">Activity Timeline</h3>

      <div *ngIf="events.length === 0" class="text-center py-8">
        <p class="text-gray-500">No activity recorded</p>
      </div>

      <div *ngIf="events.length > 0" class="space-y-6">
        <div *ngFor="let event of events; let last = last" class="flex gap-4">
          <!-- Timeline dot and line -->
          <div class="flex flex-col items-center">
            <div class="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                 [ngClass]="getEventColorClass(event.type)">
              {{ event.icon }}
            </div>
            <div *ngIf="!last" class="w-0.5 h-12 bg-gray-300 mt-2"></div>
          </div>

          <!-- Event content -->
          <div class="flex-1 pt-1">
            <h4 class="font-semibold text-gray-900">{{ event.title }}</h4>
            <p class="text-sm text-gray-600 mt-1">{{ event.description }}</p>
            <p class="text-xs text-gray-500 mt-2">
              {{ event.timestamp | date: 'short' }}
            </p>
          </div>
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
export class TimelineComponent {
  @Input() events: TimelineEvent[] = [];

  getEventColorClass(type: string): string {
    const colorMap = {
      maintenance: 'bg-orange-100 text-orange-600',
      occupancy: 'bg-blue-100 text-blue-600',
      payment: 'bg-green-100 text-green-600',
      lease: 'bg-purple-100 text-purple-600',
      other: 'bg-gray-100 text-gray-600'
    };
    return colorMap[type as keyof typeof colorMap] || colorMap.other;
  }
}
