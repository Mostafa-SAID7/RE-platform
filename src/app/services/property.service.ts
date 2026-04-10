import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Property, PropertyPhoto } from '../models/property.model';
import { environment } from '../../environments/environment';

export interface PropertyFilters {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
  location?: string;
  minOccupancy?: number;
  maxOccupancy?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface PropertyListResponse {
  data: Property[];
  total: number;
  page: number;
  limit: number;
}

export interface FinancialSummary {
  propertyId: string;
  monthlyRevenue: number;
  annualRevenue: number;
  expenses: number;
  roi: number;
  occupancyRate: number;
}

export interface OccupancyHistory {
  date: Date;
  occupancyRate: number;
}

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/properties`;

  /**
   * Get all properties with optional filtering and pagination
   */
  getProperties(filters?: PropertyFilters): Observable<PropertyListResponse> {
    let params = new HttpParams();

    if (filters) {
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.limit) params = params.set('limit', filters.limit.toString());
      if (filters.status) params = params.set('status', filters.status);
      if (filters.type) params = params.set('type', filters.type);
      if (filters.location) params = params.set('location', filters.location);
      if (filters.minOccupancy !== undefined) params = params.set('minOccupancy', filters.minOccupancy.toString());
      if (filters.maxOccupancy !== undefined) params = params.set('maxOccupancy', filters.maxOccupancy.toString());
      if (filters.minPrice !== undefined) params = params.set('minPrice', filters.minPrice.toString());
      if (filters.maxPrice !== undefined) params = params.set('maxPrice', filters.maxPrice.toString());
      if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
      if (filters.sortOrder) params = params.set('sortOrder', filters.sortOrder);
      if (filters.search) params = params.set('search', filters.search);
    }

    return this.http.get<PropertyListResponse>(this.apiUrl, { params });
  }

  /**
   * Get a single property by ID
   */
  getProperty(id: string): Observable<Property> {
    return this.http.get<Property>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new property
   */
  createProperty(property: Partial<Property>): Observable<Property> {
    return this.http.post<Property>(this.apiUrl, property);
  }

  /**
   * Update an existing property
   */
  updateProperty(id: string, updates: Partial<Property>): Observable<Property> {
    return this.http.put<Property>(`${this.apiUrl}/${id}`, updates);
  }

  /**
   * Delete a property
   */
  deleteProperty(id: string): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/${id}`);
  }

  /**
   * Bulk update properties
   */
  bulkUpdateProperties(propertyIds: string[], updates: Partial<Property>): Observable<{ updated: number }> {
    return this.http.patch<{ updated: number }>(`${this.apiUrl}/bulk-update`, {
      propertyIds,
      updates
    });
  }

  /**
   * Get financial summary for a property
   */
  getFinancialSummary(id: string, startDate?: Date, endDate?: Date): Observable<FinancialSummary> {
    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate.toISOString());
    if (endDate) params = params.set('endDate', endDate.toISOString());

    return this.http.get<FinancialSummary>(`${this.apiUrl}/${id}/financial-summary`, { params });
  }

  /**
   * Get occupancy history for a property
   */
  getOccupancyHistory(id: string, months?: number): Observable<OccupancyHistory[]> {
    let params = new HttpParams();
    if (months) params = params.set('months', months.toString());

    return this.http.get<OccupancyHistory[]>(`${this.apiUrl}/${id}/occupancy-history`, { params });
  }

  /**
   * Upload a photo for a property
   */
  uploadPhoto(id: string, file: File, caption?: string): Observable<PropertyPhoto> {
    const formData = new FormData();
    formData.append('file', file);
    if (caption) formData.append('caption', caption);

    return this.http.post<PropertyPhoto>(`${this.apiUrl}/${id}/photos`, formData);
  }

  /**
   * Delete a property photo
   */
  deletePhoto(id: string, photoId: string): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/${id}/photos/${photoId}`);
  }
}
