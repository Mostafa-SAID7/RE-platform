import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { RealtimeEventHandlerService } from './realtime-event-handler.service';
import { RealtimeService } from './realtime.service';
import { NotificationService } from './notification.service';
import { Subject } from 'rxjs';
import * as PropertiesActions from '../store/properties/properties.actions';
import * as NotificationsActions from '../store/notifications/notifications.actions';
import * as FinancialsActions from '../store/financials/financials.actions';

describe('RealtimeEventHandlerService', () => {
  let service: RealtimeEventHandlerService;
  let realtimeService: jasmine.SpyObj<RealtimeService>;
  let notificationService: jasmine.SpyObj<NotificationService>;
  let store: MockStore;

  const mockRealtimeService = {
    propertyUpdate$: new Subject(),
    occupancyChange$: new Subject(),
    paymentReceived$: new Subject(),
    workOrderStatus$: new Subject(),
    alert$: new Subject(),
    notification$: new Subject(),
    connect: jasmine.createSpy('connect'),
    disconnect: jasmine.createSpy('disconnect'),
    subscribe: jasmine.createSpy('subscribe'),
    unsubscribe: jasmine.createSpy('unsubscribe')
  };

  const mockNotificationService = {
    showNotification: jasmine.createSpy('showNotification'),
    getNotifications: jasmine.createSpy('getNotifications'),
    getNotification: jasmine.createSpy('getNotification'),
    markAsRead: jasmine.createSpy('markAsRead'),
    markAllAsRead: jasmine.createSpy('markAllAsRead'),
    deleteNotification: jasmine.createSpy('deleteNotification'),
    getPreferences: jasmine.createSpy('getPreferences'),
    updatePreferences: jasmine.createSpy('updatePreferences'),
    getCurrentNotification: jasmine.createSpy('getCurrentNotification')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RealtimeEventHandlerService,
        provideMockStore(),
        { provide: RealtimeService, useValue: mockRealtimeService },
        { provide: NotificationService, useValue: mockNotificationService }
      ]
    });

    service = TestBed.inject(RealtimeEventHandlerService);
    realtimeService = TestBed.inject(RealtimeService) as jasmine.SpyObj<RealtimeService>;
    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    store = TestBed.inject(MockStore);

    spyOn(store, 'dispatch');
  });

  afterEach(() => {
    service.ngOnDestroy();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('property update handling', () => {
    it('should dispatch updatePropertySuccess action on property update', (done) => {
      const propertyUpdate = {
        propertyId: 'prop-1',
        changes: { occupancyRate: 90 }
      };

      (mockRealtimeService.propertyUpdate$ as Subject<any>).next(propertyUpdate);

      setTimeout(() => {
        expect(store.dispatch).toHaveBeenCalledWith(
          PropertiesActions.updatePropertySuccess({
            property: {
              id: 'prop-1',
              occupancyRate: 90
            } as any
          })
        );
        done();
      }, 100);
    });
  });

  describe('occupancy change handling', () => {
    it('should dispatch updatePropertySuccess action on occupancy change', (done) => {
      const occupancyChange = {
        propertyId: 'prop-1',
        occupancyRate: 85
      };

      (mockRealtimeService.occupancyChange$ as Subject<any>).next(occupancyChange);

      setTimeout(() => {
        expect(store.dispatch).toHaveBeenCalledWith(
          PropertiesActions.updatePropertySuccess({
            property: {
              id: 'prop-1',
              occupancyRate: 85
            } as any
          })
        );
        done();
      }, 100);
    });

    it('should show critical notification when occupancy below 70%', (done) => {
      const occupancyChange = {
        propertyId: 'prop-1',
        occupancyRate: 65
      };

      (mockRealtimeService.occupancyChange$ as Subject<any>).next(occupancyChange);

      setTimeout(() => {
        expect(notificationService.showNotification).toHaveBeenCalled();
        const notification = (notificationService.showNotification as jasmine.Spy).calls.mostRecent().args[0];
        expect(notification.severity).toBe('warning');
        done();
      }, 100);
    });
  });

  describe('payment received handling', () => {
    it('should dispatch loadFinancialSummary action on payment received', (done) => {
      const paymentMessage = {
        paymentId: 'pay-1',
        leaseId: 'lease-1',
        amount: 5000
      };

      (mockRealtimeService.paymentReceived$ as Subject<any>).next(paymentMessage);

      setTimeout(() => {
        expect(store.dispatch).toHaveBeenCalledWith(
          FinancialsActions.loadFinancialSummary({})
        );
        done();
      }, 100);
    });

    it('should show success notification on payment received', (done) => {
      const paymentMessage = {
        paymentId: 'pay-1',
        leaseId: 'lease-1',
        amount: 5000
      };

      (mockRealtimeService.paymentReceived$ as Subject<any>).next(paymentMessage);

      setTimeout(() => {
        expect(notificationService.showNotification).toHaveBeenCalled();
        const notification = (notificationService.showNotification as jasmine.Spy).calls.mostRecent().args[0];
        expect(notification.severity).toBe('success');
        expect(notification.message).toContain('5000');
        done();
      }, 100);
    });
  });

  describe('work order status handling', () => {
    it('should show notification on work order status change', (done) => {
      const workOrderMessage = {
        workOrderId: 'wo-1',
        status: 'completed',
        propertyId: 'prop-1'
      };

      (mockRealtimeService.workOrderStatus$ as Subject<any>).next(workOrderMessage);

      setTimeout(() => {
        expect(notificationService.showNotification).toHaveBeenCalled();
        const notification = (notificationService.showNotification as jasmine.Spy).calls.mostRecent().args[0];
        expect(notification.message).toContain('completed');
        done();
      }, 100);
    });
  });

  describe('alert handling', () => {
    it('should show critical notification for error alerts', (done) => {
      const alertMessage = {
        alert: {
          id: 'alert-1',
          type: 'maintenance_issue',
          severity: 'error',
          message: 'Critical maintenance issue detected'
        }
      };

      (mockRealtimeService.alert$ as Subject<any>).next(alertMessage);

      setTimeout(() => {
        expect(notificationService.showNotification).toHaveBeenCalled();
        done();
      }, 100);
    });
  });

  describe('notification handling', () => {
    it('should dispatch addNotification action on notification received', (done) => {
      const notificationMessage = {
        notification: {
          id: 'notif-1',
          type: 'lease_expiration',
          title: 'Lease Expiring',
          message: 'Lease expires in 30 days'
        }
      };

      (mockRealtimeService.notification$ as Subject<any>).next(notificationMessage);

      setTimeout(() => {
        expect(store.dispatch).toHaveBeenCalledWith(
          NotificationsActions.addNotification({
            notification: jasmine.objectContaining({
              title: 'Lease Expiring',
              message: 'Lease expires in 30 days'
            }) as any
          })
        );
        done();
      }, 100);
    });
  });

  describe('latency monitoring', () => {
    it('should record latency metrics', (done) => {
      const propertyUpdate = {
        propertyId: 'prop-1',
        changes: { occupancyRate: 90 }
      };

      (mockRealtimeService.propertyUpdate$ as Subject<any>).next(propertyUpdate);

      setTimeout(() => {
        const metrics = service.getLatencyMetrics();
        expect(metrics.propertyUpdates.length).toBeGreaterThan(0);
        done();
      }, 100);
    });

    it('should calculate average latency', (done) => {
      const propertyUpdate = {
        propertyId: 'prop-1',
        changes: { occupancyRate: 90 }
      };

      (mockRealtimeService.propertyUpdate$ as Subject<any>).next(propertyUpdate);

      setTimeout(() => {
        const avgLatency = service.getAverageLatency('propertyUpdates');
        expect(avgLatency).toBeGreaterThanOrEqual(0);
        done();
      }, 100);
    });
  });

  describe('connection management', () => {
    it('should connect to realtime service', () => {
      service.connect();
      expect(realtimeService.connect).toHaveBeenCalled();
    });

    it('should disconnect from realtime service', () => {
      service.disconnect();
      expect(realtimeService.disconnect).toHaveBeenCalled();
    });

    it('should subscribe to channels', () => {
      const channels = ['properties', 'payments'];
      service.subscribeToChannels(channels);
      expect(realtimeService.subscribe).toHaveBeenCalledWith(channels);
    });

    it('should unsubscribe from channels', () => {
      const channels = ['properties'];
      service.unsubscribeFromChannels(channels);
      expect(realtimeService.unsubscribe).toHaveBeenCalledWith(channels);
    });
  });
});
