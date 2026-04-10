import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertyPhoto } from '../../../models/property.model';

@Component({
  selector: 'app-photo-gallery',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white rounded-lg shadow-md p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Photo Gallery</h3>

      <!-- Main Photo -->
      <div class="mb-4 rounded-lg overflow-hidden bg-gray-200 h-96">
        <img *ngIf="selectedPhoto()"
             [src]="selectedPhoto()!.url"
             alt="Property photo"
             class="w-full h-full object-cover">
        <div *ngIf="!selectedPhoto()"
             class="w-full h-full flex items-center justify-center text-gray-400">
          <span class="text-6xl">📷</span>
        </div>
      </div>

      <!-- Thumbnails -->
      <div *ngIf="photos.length > 0" class="grid grid-cols-6 gap-2 mb-4">
        <button *ngFor="let photo of photos"
                (click)="selectPhoto(photo)"
                class="relative rounded-lg overflow-hidden border-2"
                [ngClass]="selectedPhoto()?.id === photo.id ? 'border-blue-500' : 'border-gray-300'">
          <img [src]="photo.url"
               alt="Thumbnail"
               class="w-full h-16 object-cover">
        </button>
      </div>

      <!-- Upload Section -->
      <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input type="file"
               #fileInput
               (change)="onFileSelected($event)"
               accept="image/*"
               class="hidden">
        <button (click)="fileInput.click()"
                class="text-blue-600 hover:text-blue-800 font-medium">
          + Upload Photo
        </button>
        <p class="text-sm text-gray-600 mt-2">Click to select an image</p>
      </div>

      <!-- Delete Button -->
      <div *ngIf="selectedPhoto()" class="mt-4">
        <button (click)="deletePhoto()"
                class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
          Delete Selected Photo
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class PhotoGalleryComponent implements OnInit {
  @Input() photos: PropertyPhoto[] = [];
  @Output() photoUploaded = new EventEmitter<File>();
  @Output() photoDeleted = new EventEmitter<string>();

  selectedPhoto = signal<PropertyPhoto | null>(null);

  ngOnInit(): void {
    if (this.photos && this.photos.length > 0) {
      this.selectedPhoto.set(this.photos[0] || null);
    }
  }

  selectPhoto(photo: PropertyPhoto): void {
    this.selectedPhoto.set(photo);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.photoUploaded.emit(input.files[0]);
    }
  }

  deletePhoto(): void {
    const photo = this.selectedPhoto();
    if (photo) {
      this.photoDeleted.emit(photo.id);
    }
  }
}
