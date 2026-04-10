export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  severity: NotificationSeverity;
  read: boolean;
  actionUrl?: string;
  relatedEntityId?: string;
  relatedEntityType?: string;
  createdAt: Date;
  readAt?: Date;
}

export type NotificationType = 
  | 'lease_expiration' 
  | 'payment_overdue' 
  | 'maintenance_alert' 
  | 'occupancy_alert' 
  | 'system';

export type NotificationSeverity = 'info' | 'warning' | 'error' | 'success';
