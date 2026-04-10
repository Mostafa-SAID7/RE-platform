import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WorkOrder, WorkOrderPhoto, WorkOrderNote } from '../models/work-order.model';
import { environment } from '../../environments/environment';

export interface WorkOrderFilters {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  propertyId?: string;
  vendorId?: string;
}

export interface WorkOrderListResponse {
  data: WorkOrder[];
  total: number;
  page: number;
  limit: number;
}

export interface UpdateStatusRequest {
  status: string;
  notes?: string;
}

export interface AddNoteRequest {
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class WorkOrderService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/work-orders`;

  /**
   * Get all work orders with optional filtering and pagination
   */
  getWorkOrders(filters?: WorkOrderFilters): Observable<WorkOrderListResponse> {
    let params = new HttpParams();

    if (filters) {
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.limit) params = params.set('limit', filters.limit.toString());
      if (filters.status) params = params.set('status', filters.status);
      if (filters.priority) params = params.set('priority', filters.priority);
      if (filters.propertyId) params = params.set('propertyId', filters.propertyId);
      if (filters.vendorId) params = params.set('vendorId', filters.vendorId);
    }

    return this.http.get<WorkOrderListResponse>(this.apiUrl, { params });
  }

  /**
   * Get a single work order by ID
   */
  getWorkOrder(id: string): Observable<WorkOrder> {
    return this.http.get<WorkOrder>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new work order
   */
  createWorkOrder(workOrder: Partial<WorkOrder>): Observable<WorkOrder> {
    return this.http.post<WorkOrder>(this.apiUrl, workOrder);
  }

  /**
   * Update an existing work order
   */
  updateWorkOrder(id: string, updates: Partial<WorkOrder>): Observable<WorkOrder> {
    return this.http.put<WorkOrder>(`${this.apiUrl}/${id}`, updates);
  }

  /**
   * Delete a work order
   */
  deleteWorkOrder(id: string): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/${id}`);
  }

  /**
   * Update work order status
   */
  updateStatus(id: string, request: UpdateStatusRequest): Observable<WorkOrder> {
    return this.http.patch<WorkOrder>(`${this.apiUrl}/${id}/status`, request);
  }

  /**
   * Upload a photo for a work order
   */
  uploadPhoto(id: string, file: File, caption?: string): Observable<WorkOrderPhoto> {
    const formData = new FormData();
    formData.append('file', file);
    if (caption) formData.append('caption', caption);

    return this.http.post<WorkOrderPhoto>(`${this.apiUrl}/${id}/photos`, formData);
  }

  /**
   * Add a note to a work order
   */
  addNote(id: string, request: AddNoteRequest): Observable<WorkOrderNote> {
    return this.http.post<WorkOrderNote>(`${this.apiUrl}/${id}/notes`, request);
  }

  /**
   * Get work orders by property
   */
  getWorkOrdersByProperty(propertyId: string): Observable<WorkOrder[]> {
    return this.http.get<WorkOrder[]>(`${this.apiUrl}/by-property/${propertyId}`);
  }
}
