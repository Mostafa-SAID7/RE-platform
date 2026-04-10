import { Injectable, inject, NgZone } from '@angular/core';
import { Subject, Observable, interval, BehaviorSubject } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp?: Date;
}

export interface PropertyUpdateMessage {
  propertyId: string;
  changes: Record<string, any>;
}

export interface OccupancyChangeMessage {
  propertyId: string;
  occupancyRate: number;
}

export interface PaymentReceivedMessage {
  paymentId: string;
  leaseId: string;
  amount: number;
}

export interface WorkOrderStatusMessage {
  workOrderId: string;
  status: string;
  propertyId: string;
}

export interface AlertMessage {
  alert: {
    id: string;
    type: string;
    severity: string;
    message: string;
  };
}

export interface NotificationMessage {
  notification: {
    id: string;
    type: string;
    title: string;
    message: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class RealtimeService {
  private ngZone = inject(NgZone);

  private ws: WebSocket | null = null;
  private wsUrl = environment.wsUrl;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectDelay = 1000; // Start with 1 second
  private maxReconnectDelay = 30000; // Max 30 seconds
  private heartbeatInterval: any;
  private reconnectTimeout: any;

  // Subjects for different message types
  private propertyUpdateSubject = new Subject<PropertyUpdateMessage>();
  private occupancyChangeSubject = new Subject<OccupancyChangeMessage>();
  private paymentReceivedSubject = new Subject<PaymentReceivedMessage>();
  private workOrderStatusSubject = new Subject<WorkOrderStatusMessage>();
  private alertSubject = new Subject<AlertMessage>();
  private notificationSubject = new Subject<NotificationMessage>();
  private connectionStatusSubject = new BehaviorSubject<boolean>(false);

  // Observables
  public propertyUpdate$ = this.propertyUpdateSubject.asObservable();
  public occupancyChange$ = this.occupancyChangeSubject.asObservable();
  public paymentReceived$ = this.paymentReceivedSubject.asObservable();
  public workOrderStatus$ = this.workOrderStatusSubject.asObservable();
  public alert$ = this.alertSubject.asObservable();
  public notification$ = this.notificationSubject.asObservable();
  public connectionStatus$ = this.connectionStatusSubject.asObservable();

  private subscribedChannels = new Set<string>();

  /**
   * Connect to WebSocket server
   */
  connect(): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return; // Already connected
    }

    try {
      this.ws = new WebSocket(this.wsUrl);

      this.ws.onopen = () => this.onOpen();
      this.ws.onmessage = (event) => this.onMessage(event);
      this.ws.onerror = (event) => this.onError(event);
      this.ws.onclose = () => this.onClose();
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      this.scheduleReconnect();
    }
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.connectionStatusSubject.next(false);
  }

  /**
   * Subscribe to channels
   */
  subscribe(channels: string[]): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket not connected, cannot subscribe');
      return;
    }

    channels.forEach(channel => this.subscribedChannels.add(channel));

    this.send({
      type: 'subscribe',
      data: { channels }
    });
  }

  /**
   * Unsubscribe from channels
   */
  unsubscribe(channels: string[]): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket not connected, cannot unsubscribe');
      return;
    }

    channels.forEach(channel => this.subscribedChannels.delete(channel));

    this.send({
      type: 'unsubscribe',
      data: { channels }
    });
  }

  /**
   * Send a message through WebSocket
   */
  private send(message: WebSocketMessage): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  /**
   * Handle WebSocket open event
   */
  private onOpen(): void {
    console.log('WebSocket connected');
    this.reconnectAttempts = 0;
    this.reconnectDelay = 1000;
    this.connectionStatusSubject.next(true);

    // Start heartbeat
    this.startHeartbeat();

    // Resubscribe to channels
    if (this.subscribedChannels.size > 0) {
      this.subscribe(Array.from(this.subscribedChannels));
    }
  }

  /**
   * Handle WebSocket message
   */
  private onMessage(event: MessageEvent): void {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);

      this.ngZone.run(() => {
        switch (message.type) {
          case 'property:updated':
            this.propertyUpdateSubject.next(message.data as PropertyUpdateMessage);
            break;
          case 'occupancy:changed':
            this.occupancyChangeSubject.next(message.data as OccupancyChangeMessage);
            break;
          case 'payment:received':
            this.paymentReceivedSubject.next(message.data as PaymentReceivedMessage);
            break;
          case 'workorder:status':
            this.workOrderStatusSubject.next(message.data as WorkOrderStatusMessage);
            break;
          case 'alert:new':
            this.alertSubject.next(message.data as AlertMessage);
            break;
          case 'notification:new':
            this.notificationSubject.next(message.data as NotificationMessage);
            break;
          case 'ws:pong':
            // Heartbeat response received
            break;
          default:
            console.warn('Unknown message type:', message.type);
        }
      });
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  }

  /**
   * Handle WebSocket error
   */
  private onError(event: Event): void {
    console.error('WebSocket error:', event);
    this.connectionStatusSubject.next(false);
  }

  /**
   * Handle WebSocket close
   */
  private onClose(): void {
    console.log('WebSocket disconnected');
    this.connectionStatusSubject.next(false);
    this.scheduleReconnect();
  }

  /**
   * Schedule reconnection with exponential backoff
   */
  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(
      this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1),
      this.maxReconnectDelay
    );

    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, delay);
  }

  /**
   * Start heartbeat mechanism
   */
  private startHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    // Send ping every 30 seconds
    this.heartbeatInterval = setInterval(() => {
      this.send({
        type: 'ws:ping',
        data: {}
      });
    }, 30000);
  }

  /**
   * Check if WebSocket is connected
   */
  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): Observable<boolean> {
    return this.connectionStatus$;
  }
}
