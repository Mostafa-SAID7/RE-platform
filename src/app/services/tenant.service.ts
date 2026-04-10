import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tenant, TenantDocument } from '../models/tenant.model';
import { environment } from '../../environments/environment';

export interface TenantFilters {
  page?: number;
  limit?: number;
  search?: string;
  propertyId?: string;
}

export interface TenantListResponse {
  data: Tenant[];
  total: number;
  page: number;
  limit: number;
}

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/tenants`;

  /**
   * Get all tenants with optional filtering and pagination
   */
  getTenants(filters?: TenantFilters): Observable<TenantListResponse> {
    let params = new HttpParams();

    if (filters) {
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.limit) params = params.set('limit', filters.limit.toString());
      if (filters.search) params = params.set('search', filters.search);
      if (filters.propertyId) params = params.set('propertyId', filters.propertyId);
    }

    return this.http.get<TenantListResponse>(this.apiUrl, { params });
  }

  /**
   * Get a single tenant by ID
   */
  getTenant(id: string): Observable<Tenant> {
    return this.http.get<Tenant>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new tenant
   */
  createTenant(tenant: Partial<Tenant>): Observable<Tenant> {
    return this.http.post<Tenant>(this.apiUrl, tenant);
  }

  /**
   * Update an existing tenant
   */
  updateTenant(id: string, updates: Partial<Tenant>): Observable<Tenant> {
    return this.http.put<Tenant>(`${this.apiUrl}/${id}`, updates);
  }

  /**
   * Delete a tenant
   */
  deleteTenant(id: string): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/${id}`);
  }

  /**
   * Upload a document for a tenant
   */
  uploadDocument(id: string, file: File, type: string): Observable<TenantDocument> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return this.http.post<TenantDocument>(`${this.apiUrl}/${id}/documents`, formData);
  }

  /**
   * Send a reminder to a tenant
   */
  sendReminder(id: string, type: 'payment' | 'lease_renewal', message?: string): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${this.apiUrl}/${id}/send-reminder`, {
      type,
      message
    });
  }
}
