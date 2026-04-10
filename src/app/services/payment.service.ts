import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment } from '../models/payment.model';
import { environment } from '../../environments/environment';

export interface PaymentFilters {
  page?: number;
  limit?: number;
  status?: string;
  leaseId?: string;
  tenantId?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface PaymentListResponse {
  data: Payment[];
  total: number;
  page: number;
  limit: number;
}

export interface MarkPaidRequest {
  transactionId?: string;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/payments`;

  /**
   * Get all payments with optional filtering and pagination
   */
  getPayments(filters?: PaymentFilters): Observable<PaymentListResponse> {
    let params = new HttpParams();

    if (filters) {
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.limit) params = params.set('limit', filters.limit.toString());
      if (filters.status) params = params.set('status', filters.status);
      if (filters.leaseId) params = params.set('leaseId', filters.leaseId);
      if (filters.tenantId) params = params.set('tenantId', filters.tenantId);
      if (filters.startDate) params = params.set('startDate', filters.startDate.toISOString());
      if (filters.endDate) params = params.set('endDate', filters.endDate.toISOString());
    }

    return this.http.get<PaymentListResponse>(this.apiUrl, { params });
  }

  /**
   * Get a single payment by ID
   */
  getPayment(id: string): Observable<Payment> {
    return this.http.get<Payment>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new payment
   */
  createPayment(payment: Partial<Payment>): Observable<Payment> {
    return this.http.post<Payment>(this.apiUrl, payment);
  }

  /**
   * Update an existing payment
   */
  updatePayment(id: string, updates: Partial<Payment>): Observable<Payment> {
    return this.http.put<Payment>(`${this.apiUrl}/${id}`, updates);
  }

  /**
   * Get overdue payments
   */
  getOverduePayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/overdue`);
  }

  /**
   * Mark a payment as paid
   */
  markAsPaid(id: string, request: MarkPaidRequest): Observable<Payment> {
    return this.http.post<Payment>(`${this.apiUrl}/${id}/mark-paid`, request);
  }
}
