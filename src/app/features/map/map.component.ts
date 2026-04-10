import { Component, OnInit, ChangeDetectionStrategy, inject, signal, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Property } from '../../models/property.model';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-6 bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors duration-200">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Property Map</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">View all properties on an interactive map</p>
      </div>

      <!-- Controls -->
      <div class="bg-white dark:bg-gray-900 rounded-lg shadow-md dark:shadow-lg p-4 mb-6 flex gap-4 border border-gray-200 dark:border-gray-800 transition-colors duration-200 flex-wrap">
        <button (click)="toggleMarkerView()"
                class="px-4 py-2 rounded-md transition-colors"
                [ngClass]="viewMode() === 'markers' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700'">
          Markers
        </button>
        <button (click)="toggleHeatmapView()"
                class="px-4 py-2 rounded-md transition-colors"
                [ngClass]="viewMode() === 'heatmap' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700'">
          Heatmap
        </button>
        <button (click)="centerMap()"
                class="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
          Center Map
        </button>
      </div>

      <!-- Map Container -->
      <div #mapContainer class="bg-white dark:bg-gray-900 rounded-lg shadow-md dark:shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800 transition-colors duration-200" style="height: 600px;">
        <!-- Map will be rendered here -->
      </div>

      <!-- Selected Property Info -->
      <div *ngIf="selectedProperty()" class="mt-6 bg-white dark:bg-gray-900 rounded-lg shadow-md dark:shadow-lg p-6 border border-gray-200 dark:border-gray-800 transition-colors duration-200">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Selected Property</h3>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Address</p>
            <p class="font-semibold text-gray-900 dark:text-white">{{ selectedProperty()!.address.street }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Status</p>
            <p class="font-semibold" [ngClass]="selectedProperty()!.status === 'active' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
              {{ selectedProperty()!.status | titlecase }}
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Monthly Revenue</p>
            <p class="font-semibold text-green-600 dark:text-green-400">{{ selectedProperty()!.monthlyRevenue | currency }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">ROI</p>
            <p class="font-semibold text-gray-900 dark:text-white">{{ selectedProperty()!.roi | number: '1.1-1' }}%</p>
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
export class MapComponent implements OnInit, AfterViewInit {
  private store = inject(Store);

  @ViewChild('mapContainer') mapContainer!: ElementRef;

  properties = signal<Property[]>([]);
  selectedProperty = signal<Property | null>(null);
  viewMode = signal<'markers' | 'heatmap'>('markers');

  private map: L.Map | null = null;
  private markers: L.Marker[] = [];
  private heatmapLayer: L.Layer | null = null;

  ngOnInit(): void {
    this.loadProperties();
  }

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  private loadProperties(): void {
    this.store.select(state => (state as any).properties?.items || [])
      .subscribe(properties => {
        this.properties.set(properties);
        if (this.map) {
          this.updateMapMarkers();
        }
      });
  }

  private initializeMap(): void {
    if (!this.mapContainer) return;

    // Initialize Leaflet map
    this.map = L.map(this.mapContainer.nativeElement).setView([39.8283, -98.5795], 4);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map);

    this.updateMapMarkers();
  }

  private updateMapMarkers(): void {
    if (!this.map) return;

    // Clear existing markers
    this.markers.forEach(marker => this.map!.removeLayer(marker));
    this.markers = [];

    // Add new markers
    this.properties().forEach(property => {
      if (property.coordinates?.lat && property.coordinates?.lng) {
        const marker = L.marker([property.coordinates.lat, property.coordinates.lng])
          .bindPopup(`
            <div class="p-2">
              <h4 class="font-semibold">${property.address?.street}</h4>
              <p class="text-sm">${property.status}</p>
            </div>
          `)
          .addTo(this.map!);

        marker.on('click', () => {
          this.selectedProperty.set(property);
        });

        this.markers.push(marker);
      }
    });

    // Fit bounds to all markers
    if (this.markers.length > 0) {
      const group = new L.FeatureGroup(this.markers);
      this.map.fitBounds(group.getBounds().pad(0.1));
    }
  }

  toggleMarkerView(): void {
    this.viewMode.set('markers');
    if (this.heatmapLayer && this.map) {
      this.map.removeLayer(this.heatmapLayer);
    }
    this.updateMapMarkers();
  }

  toggleHeatmapView(): void {
    this.viewMode.set('heatmap');
    // Heatmap implementation would go here
    // This would require leaflet-heat plugin
  }

  centerMap(): void {
    if (this.map && this.markers.length > 0) {
      const group = new L.FeatureGroup(this.markers);
      this.map.fitBounds(group.getBounds().pad(0.1));
    }
  }
}
