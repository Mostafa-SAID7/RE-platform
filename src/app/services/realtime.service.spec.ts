import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RealtimeService } from './realtime.service';
import { environment } from '../../environments/environment';

describe('RealtimeService', () => {
  let service: RealtimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RealtimeService]
    });
    service = TestBed.inject(RealtimeService);
  });

  afterEach(() => {
    service.disconnect();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('connection management', () => {
    it('should initialize with disconnected state', (done) => {
      service.getConnectionStatus().subscribe(status => {
        expect(status).toBe(false);
        done();
      });
    });

    it('should report connected state after connection', (done) => {
      // Mock WebSocket
      const mockWs = {
        readyState: WebSocket.OPEN,
        send: jasmine.createSpy('send'),
        close: jasmine.createSpy('close'),
        onopen: null as any,
        onmessage: null as any,
        onerror: null as any,
        onclose: null as any
      };

      spyOn(window, 'WebSocket').and.returnValue(mockWs as any);

      service.connect();

      // Simulate connection open
      if (mockWs.onopen) {
        mockWs.onopen();
      }

      service.getConnectionStatus().subscribe(status => {
        if (status) {
          expect(status).toBe(true);
          done();
        }
      });
    });

    it('should disconnect properly', (done) => {
      const mockWs = {
        readyState: WebSocket.OPEN,
        send: jasmine.createSpy('send'),
        close: jasmine.createSpy('close'),
        onopen: null as any,
        onmessage: null as any,
        onerror: null as any,
        onclose: null as any
      };

      spyOn(window, 'WebSocket').and.returnValue(mockWs as any);

      service.connect();
      if (mockWs.onopen) {
        mockWs.onopen();
      }

      service.disconnect();

      expect(mockWs.close).toHaveBeenCalled();
      done();
    });
  });

  describe('message handling', () => {
    it('should emit property update messages', (done) => {
      const mockWs = {
        readyState: WebSocket.OPEN,
        send: jasmine.createSpy('send'),
        close: jasmine.createSpy('close'),
        onopen: null as any,
        onmessage: null as any,
        onerror: null as any,
        onclose: null as any
      };

      spyOn(window, 'WebSocket').and.returnValue(mockWs as any);

      service.connect();
      if (mockWs.onopen) {
        mockWs.onopen();
      }

      service.propertyUpdate$.subscribe(message => {
        expect(message.propertyId).toBe('prop-1');
        expect(message.changes['occupancyRate']).toBe(90);
        done();
      });

      // Simulate incoming message
      const messageEvent = new MessageEvent('message', {
        data: JSON.stringify({
          type: 'property:updated',
          data: {
            propertyId: 'prop-1',
            changes: { occupancyRate: 90 }
          }
        })
      });

      if (mockWs.onmessage) {
        mockWs.onmessage(messageEvent);
      }
    });

    it('should emit occupancy change messages', (done) => {
      const mockWs = {
        readyState: WebSocket.OPEN,
        send: jasmine.createSpy('send'),
        close: jasmine.createSpy('close'),
        onopen: null as any,
        onmessage: null as any,
        onerror: null as any,
        onclose: null as any
      };

      spyOn(window, 'WebSocket').and.returnValue(mockWs as any);

      service.connect();
      if (mockWs.onopen) {
        mockWs.onopen();
      }

      service.occupancyChange$.subscribe(message => {
        expect(message.propertyId).toBe('prop-1');
        expect(message.occupancyRate).toBe(75);
        done();
      });

      const messageEvent = new MessageEvent('message', {
        data: JSON.stringify({
          type: 'occupancy:changed',
          data: {
            propertyId: 'prop-1',
            occupancyRate: 75
          }
        })
      });

      if (mockWs.onmessage) {
        mockWs.onmessage(messageEvent);
      }
    });

    it('should emit payment received messages', (done) => {
      const mockWs = {
        readyState: WebSocket.OPEN,
        send: jasmine.createSpy('send'),
        close: jasmine.createSpy('close'),
        onopen: null as any,
        onmessage: null as any,
        onerror: null as any,
        onclose: null as any
      };

      spyOn(window, 'WebSocket').and.returnValue(mockWs as any);

      service.connect();
      if (mockWs.onopen) {
        mockWs.onopen();
      }

      service.paymentReceived$.subscribe(message => {
        expect(message.paymentId).toBe('pay-1');
        expect(message.amount).toBe(5000);
        done();
      });

      const messageEvent = new MessageEvent('message', {
        data: JSON.stringify({
          type: 'payment:received',
          data: {
            paymentId: 'pay-1',
            leaseId: 'lease-1',
            amount: 5000
          }
        })
      });

      if (mockWs.onmessage) {
        mockWs.onmessage(messageEvent);
      }
    });

    it('should emit work order status messages', (done) => {
      const mockWs = {
        readyState: WebSocket.OPEN,
        send: jasmine.createSpy('send'),
        close: jasmine.createSpy('close'),
        onopen: null as any,
        onmessage: null as any,
        onerror: null as any,
        onclose: null as any
      };

      spyOn(window, 'WebSocket').and.returnValue(mockWs as any);

      service.connect();
      if (mockWs.onopen) {
        mockWs.onopen();
      }

      service.workOrderStatus$.subscribe(message => {
        expect(message.workOrderId).toBe('wo-1');
        expect(message.status).toBe('completed');
        done();
      });

      const messageEvent = new MessageEvent('message', {
        data: JSON.stringify({
          type: 'workorder:status',
          data: {
            workOrderId: 'wo-1',
            status: 'completed',
            propertyId: 'prop-1'
          }
        })
      });

      if (mockWs.onmessage) {
        mockWs.onmessage(messageEvent);
      }
    });
  });

  describe('channel subscription', () => {
    it('should subscribe to channels', () => {
      const mockWs = {
        readyState: WebSocket.OPEN,
        send: jasmine.createSpy('send'),
        close: jasmine.createSpy('close'),
        onopen: null as any,
        onmessage: null as any,
        onerror: null as any,
        onclose: null as any
      };

      spyOn(window, 'WebSocket').and.returnValue(mockWs as any);

      service.connect();
      if (mockWs.onopen) {
        mockWs.onopen();
      }

      service.subscribe(['properties', 'payments']);

      expect(mockWs.send).toHaveBeenCalledWith(
        JSON.stringify({
          type: 'subscribe',
          data: { channels: ['properties', 'payments'] }
        })
      );
    });

    it('should unsubscribe from channels', () => {
      const mockWs = {
        readyState: WebSocket.OPEN,
        send: jasmine.createSpy('send'),
        close: jasmine.createSpy('close'),
        onopen: null as any,
        onmessage: null as any,
        onerror: null as any,
        onclose: null as any
      };

      spyOn(window, 'WebSocket').and.returnValue(mockWs as any);

      service.connect();
      if (mockWs.onopen) {
        mockWs.onopen();
      }

      service.subscribe(['properties']);
      mockWs.send.calls.reset();

      service.unsubscribe(['properties']);

      expect(mockWs.send).toHaveBeenCalledWith(
        JSON.stringify({
          type: 'unsubscribe',
          data: { channels: ['properties'] }
        })
      );
    });
  });

  describe('heartbeat mechanism', () => {
    it('should send heartbeat ping', fakeAsync(() => {
      const mockWs = {
        readyState: WebSocket.OPEN,
        send: jasmine.createSpy('send'),
        close: jasmine.createSpy('close'),
        onopen: null as any,
        onmessage: null as any,
        onerror: null as any,
        onclose: null as any
      };

      spyOn(window, 'WebSocket').and.returnValue(mockWs as any);

      service.connect();
      if (mockWs.onopen) {
        mockWs.onopen();
      }

      // Fast-forward 30 seconds
      tick(30000);

      // Should have sent a ping
      expect(mockWs.send).toHaveBeenCalledWith(
        JSON.stringify({
          type: 'ws:ping',
          data: {}
        })
      );
    }));
  });

  describe('reconnection logic', () => {
    it('should attempt to reconnect on connection close', fakeAsync(() => {
      const mockWs = {
        readyState: WebSocket.OPEN,
        send: jasmine.createSpy('send'),
        close: jasmine.createSpy('close'),
        onopen: null as any,
        onmessage: null as any,
        onerror: null as any,
        onclose: null as any
      };

      spyOn(window, 'WebSocket').and.returnValue(mockWs as any);

      service.connect();
      if (mockWs.onopen) {
        mockWs.onopen();
      }

      // Simulate connection close
      if (mockWs.onclose) {
        mockWs.onclose();
      }

      // Fast-forward 1 second (initial reconnect delay)
      tick(1000);

      // Should attempt to reconnect
      expect(window.WebSocket).toHaveBeenCalledTimes(2);
    }));
  });

  describe('connection status', () => {
    it('should report connection status correctly', () => {
      const mockWs = {
        readyState: WebSocket.OPEN,
        send: jasmine.createSpy('send'),
        close: jasmine.createSpy('close'),
        onopen: null as any,
        onmessage: null as any,
        onerror: null as any,
        onclose: null as any
      };

      spyOn(window, 'WebSocket').and.returnValue(mockWs as any);

      expect(service.isConnected()).toBe(false);

      service.connect();
      if (mockWs.onopen) {
        mockWs.onopen();
      }

      expect(service.isConnected()).toBe(true);

      service.disconnect();

      expect(service.isConnected()).toBe(false);
    });
  });
});
