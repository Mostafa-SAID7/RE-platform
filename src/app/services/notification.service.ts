import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Notification } from '../models/notification.model';
import { environment } from '../../environments/environment';

export interface NotificationFilters {
  page?: number;
  limit?: number;
  read?: boolean;
  type?: string;
}

export interface NotificationListResponse {
  data: Notification[];
  total: number;
  page: number;
  limit: number;
  unreadCount: number;
}

export interface NotificationPreferences {
  email: boolean;
  inApp: boolean;
  categories: string[];
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/notifications`;

  // Subject for in-app notifications
  private notificationSubject = new BehaviorSubject<Notification | null>(null);
  public notification$ = this.notificationSubject.asObservable();

  /**
   * Get all notifications with optional filtering
   */
  getNotifications(filters?: NotificationFilters): Observable<NotificationListResponse> {
    let params = new HttpParams();

    if (filters) {
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.limit) params = params.set('limit', filters.limit.toString());
      if (filters.read !== undefined) params = params.set('read', filters.read.toString());
      if (filters.type) params = params.set('type', filters.type);
    }

    return this.http.get<NotificationListResponse>(this.apiUrl, { params });
  }

  /**
   * Get a single notification by ID
   */
  getNotification(id: string): Observable<Notification> {
    return this.http.get<Notification>(`${this.apiUrl}/${id}`);
  }

  /**
   * Mark a notification as read
   */
  markAsRead(id: string): Observable<Notification> {
    return this.http.patch<Notification>(`${this.apiUrl}/${id}/read`, {});
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead(): Observable<{ updated: number }> {
    return this.http.patch<{ updated: number }>(`${this.apiUrl}/mark-all-read`, {});
  }

  /**
   * Delete a notification
   */
  deleteNotification(id: string): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get notification preferences
   */
  getPreferences(): Observable<NotificationPreferences> {
    return this.http.get<NotificationPreferences>(`${this.apiUrl}/preferences`);
  }

  /**
   * Update notification preferences
   */
  updatePreferences(preferences: NotificationPreferences): Observable<NotificationPreferences> {
    return this.http.put<NotificationPreferences>(`${this.apiUrl}/preferences`, preferences);
  }

  /**
   * Emit a new notification (for in-app display)
   */
  showNotification(notification: Notification): void {
    this.notificationSubject.next(notification);
  }

  /**
   * Show an error notification
   */
  showError(message: string): void {
    const notification: Notification = {
      id: Date.now().toString(),
      title: 'Error',
      message,
      type: 'error',
      read: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.showNotification(notification);
  }

  /**
   * Show a success notification
   */
  showSuccess(message: string): void {
    const notification: Notification = {
      id: Date.now().toString(),
      title: 'Success',
      message,
      type: 'success',
      read: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.showNotification(notification);
  }

  /**
   * Get the current notification
   */
  getCurrentNotification(): Notification | null {
    return this.notificationSubject.value;
  }
}
