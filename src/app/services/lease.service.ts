import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lease } from '../models/lease.model';
import { environment } from '../../environments/environment';

export interface LeaseFilters {
  page?: number;
  limit?: number;
  status?: string;
  propertyId?: string;
  tenantId?: string;
  expiringWithinDays?: number;
}

export interface LeaseListResponse {
  data: Lease[];
  total: number;
  page: number;
  limit: number;
}

export interface RenewLeaseRequest {
  endDate: Date;
  monthlyRent: number;
}

@Injectable({
  providedIn: 'root'
})
export class LeaseService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/leases`;

  /**
   * Get all leases with optional filtering and pagination
   */
  getLeases(filters?: LeaseFilters): Observable<LeaseListResponse> {
    let params = new HttpParams();

    if (filters) {
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.limit) params = params.set('limit', filters.limit.toString());
      if (filters.status) params = params.set('status', filters.status);
      if (filters.propertyId) params = params.set('propertyId', filters.propertyId);
      if (filters.tenantId) params = params.set('tenantId', filters.tenantId);
      if (filters.expiringWithinDays) params = params.set('expiringWithinDays', filters.expiringWithinDays.toString());
    }

    return this.http.get<LeaseListResponse>(this.apiUrl, { params });
  }

  /**
   * Get a single lease by ID
   */
  getLease(id: string): Observable<Lease> {
    return this.http.get<Lease>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new lease
   */
  createLease(lease: Partial<Lease>): Observable<Lease> {
    return this.http.post<Lease>(this.apiUrl, lease);
  }

  /**
   * Update an existing lease
   */
  updateLease(id: string, updates: Partial<Lease>): Observable<Lease> {
    return this.http.put<Lease>(`${this.apiUrl}/${id}`, updates);
  }

  /**
   * Delete a lease
   */
  deleteLease(id: string): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/${id}`);
  }

  /**
   * Renew a lease
   */
  renewLease(id: string, request: RenewLeaseRequest): Observable<Lease> {
    return this.http.post<Lease>(`${this.apiUrl}/${id}/renew`, request);
  }

  /**
   * Get leases expiring soon
   */
  getExpiringLeases(days: number = 30): Observable<Lease[]> {
    const params = new HttpParams().set('days', days.toString());
    return this.http.get<Lease[]>(`${this.apiUrl}/expiring-soon`, { params });
  }
}
