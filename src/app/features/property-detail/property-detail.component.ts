import { Component, OnInit, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { PhotoGalleryComponent } from './components/photo-gallery.component';
import { TimelineComponent, TimelineEvent } from './components/timeline.component';
import { Property } from '../../models/property.model';
import { PropertyService } from '../../services/property.service';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PhotoGalleryComponent, TimelineComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-6 bg-gray-50 min-h-screen">
      <!-- Header -->
      <div class="flex justify-between items-start mb-8">
        <div>
          <button (click)="goBack()"
                  class="text-blue-600 hover:text-blue-800 mb-2">
            ← Back to Listings
          </button>
          <h1 class="text-3xl font-bold text-gray-900">Property Details</h1>
        </div>
        <button (click)="toggleEdit()"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          {{ isEditing() ? 'Cancel' : 'Edit' }}
        </button>
      </div>

      <div *ngIf="property()" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Property Info Card -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">
              {{ property()!.address.street }}
            </h2>
            <p class="text-gray-600 mb-6">
              {{ property()!.address.city }}, {{ property()!.address.state }} {{ property()!.address.zipCode }}
            </p>

            <!-- Property Details Grid -->
            <div class="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p class="text-sm text-gray-600">Property Type</p>
                <p class="text-lg font-semibold text-gray-900">{{ property()!.type | titlecase }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Year Built</p>
                <p class="text-lg font-semibold text-gray-900">{{ property()!.yearBuilt }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Square Feet</p>
                <p class="text-lg font-semibold text-gray-900">{{ property()!.sizeSqft | number }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Status</p>
                <p class="text-lg font-semibold" [ngClass]="property()!.status === 'active' ? 'text-green-600' : 'text-red-600'">
                  {{ property()!.status | titlecase }}
                </p>
              </div>
            </div>

            <!-- Financial Metrics -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Financial Metrics</h3>
              <div class="grid grid-cols-2 gap-6">
                <div>
                  <p class="text-sm text-gray-600">Monthly Revenue</p>
                  <p class="text-2xl font-bold text-green-600">{{ property()!.monthlyRevenue | currency }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Annual Revenue</p>
                  <p class="text-2xl font-bold text-green-600">{{ (property()!.monthlyRevenue * 12) | currency }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">ROI</p>
                  <p class="text-2xl font-bold" [ngClass]="property()!.roi >= 0 ? 'text-green-600' : 'text-red-600'">
                    {{ property()!.roi | number: '1.1-1' }}%
                  </p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Occupancy Rate</p>
                  <p class="text-2xl font-bold text-gray-900">{{ property()!.occupancyRate | number: '1.1-1' }}%</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Photo Gallery -->
          <app-photo-gallery
            [photos]="property()!.photos || []"
            (photoUploaded)="uploadPhoto($event)"
            (photoDeleted)="deletePhoto($event)">
          </app-photo-gallery>

          <!-- Timeline -->
          <app-timeline
            [events]="timelineEvents()">
          </app-timeline>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Manager Info -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Manager</h3>
            <div class="space-y-3">
              <div>
                <p class="text-sm text-gray-600">Manager ID</p>
                <p class="font-semibold text-gray-900">{{ property()!.managerId }}</p>
              </div>
              <button class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Contact Manager
              </button>
            </div>
          </div>

          <!-- Owner Info -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Owner</h3>
            <div class="space-y-3">
              <div>
                <p class="text-sm text-gray-600">Owner ID</p>
                <p class="font-semibold text-gray-900">{{ property()!.ownerId }}</p>
              </div>
              <button class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Contact Owner
              </button>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div class="space-y-2">
              <button class="w-full px-4 py-2 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300 text-sm">
                Create Work Order
              </button>
              <button class="w-full px-4 py-2 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300 text-sm">
                View Maintenance History
              </button>
              <button class="w-full px-4 py-2 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300 text-sm">
                View Payment History
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="!property()" class="text-center py-12">
        <p class="text-gray-500">Loading property details...</p>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class PropertyDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(Store);
  private propertyService = inject(PropertyService);
  private fb = inject(FormBuilder);

  property = signal<Property | null>(null);
  isEditing = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  timelineEvents = signal<TimelineEvent[]>([]);
  propertyForm!: FormGroup;

  ngOnInit(): void {
    this.loadProperty();
  }

  private loadProperty(): void {
    const propertyId = this.route.snapshot.paramMap.get('id');
    if (propertyId) {
      this.store.select(state => {
        const props = (state as any).properties?.items || [];
        return props.find((p: Property) => p.id === propertyId);
      }).subscribe(property => {
        if (property) {
          this.property.set(property);
          this.generateTimeline(property);
        }
      });
    }
  }

  private generateTimeline(property: Property): void {
    const events: TimelineEvent[] = [
      {
        id: '1',
        title: 'Property Created',
        description: `Property added to portfolio`,
        timestamp: new Date(property.createdAt || new Date()),
        type: 'other',
        icon: '📝'
      }
    ];

    if (property.status === 'active') {
      events.push({
        id: '2',
        title: 'Property Active',
        description: 'Property is currently active',
        timestamp: new Date(),
        type: 'occupancy',
        icon: '👥'
      });
    }

    this.timelineEvents.set(events);
  }

  toggleEdit(): void {
    this.isEditing.set(!this.isEditing());
  }

  uploadPhoto(file: File): void {
    console.log('Uploading photo:', file.name);
    // Implementation would upload to backend
  }

  deletePhoto(photoId: string): void {
    console.log('Deleting photo:', photoId);
    // Implementation would delete from backend
  }

  goBack(): void {
    this.router.navigate(['/properties']);
  }
}
