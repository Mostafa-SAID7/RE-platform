import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PropertyService, PropertyFilters } from './property.service';
import { Property } from '../models/property.model';
import { environment } from '../../environments/environment';

describe('PropertyService', () => {
  let service: PropertyService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/properties`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PropertyService]
    });
    service = TestBed.inject(PropertyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getProperties', () => {
    it('should fetch properties without filters', () => {
      const mockResponse = {
        data: [],
        total: 0,
        page: 1,
        limit: 10
      };

      service.getProperties().subscribe(result => {
        expect(result).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should fetch properties with filters', () => {
      const filters: PropertyFilters = {
        page: 1,
        limit: 20,
        status: 'active',
        search: 'test'
      };

      const mockResponse = {
        data: [],
        total: 0,
        page: 1,
        limit: 20
      };

      service.getProperties(filters).subscribe(result => {
        expect(result).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(request =>
        request.url === apiUrl &&
        request.params.get('page') === '1' &&
        request.params.get('limit') === '20' &&
        request.params.get('status') === 'active' &&
        request.params.get('search') === 'test'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getProperty', () => {
    it('should fetch a single property', () => {
      const propertyId = '123';
      const mockProperty: Property = {
        id: propertyId,
        address: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        },
        type: 'residential',
        sizeSqft: 2000,
        yearBuilt: 2020,
        ownerId: 'owner1',
        managerId: 'manager1',
        occupancyRate: 85,
        monthlyRevenue: 5000,
        annualRevenue: 60000,
        roi: 12.5,
        status: 'active',
        coordinates: { lat: 40.7128, lng: -74.0060 },
        photos: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      service.getProperty(propertyId).subscribe(result => {
        expect(result).toEqual(mockProperty);
      });

      const req = httpMock.expectOne(`${apiUrl}/${propertyId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProperty);
    });
  });

  describe('createProperty', () => {
    it('should create a new property', () => {
      const newProperty: Partial<Property> = {
        address: {
          street: '456 Oak Ave',
          city: 'Boston',
          state: 'MA',
          zipCode: '02101',
          country: 'USA'
        },
        type: 'commercial',
        sizeSqft: 5000,
        yearBuilt: 2021
      };

      const mockResponse: Property = {
        ...newProperty as Property,
        id: 'new-id'
      };

      service.createProperty(newProperty).subscribe(result => {
        expect(result.id).toBe('new-id');
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newProperty);
      req.flush(mockResponse);
    });
  });

  describe('updateProperty', () => {
    it('should update an existing property', () => {
      const propertyId = '123';
      const updates: Partial<Property> = {
        occupancyRate: 90,
        monthlyRevenue: 5500
      };

      const mockResponse: Property = {
        id: propertyId,
        address: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        },
        type: 'residential',
        sizeSqft: 2000,
        yearBuilt: 2020,
        ownerId: 'owner1',
        managerId: 'manager1',
        occupancyRate: 90,
        monthlyRevenue: 5500,
        annualRevenue: 66000,
        roi: 13.2,
        status: 'active',
        coordinates: { lat: 40.7128, lng: -74.0060 },
        photos: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      service.updateProperty(propertyId, updates).subscribe(result => {
        expect(result.occupancyRate).toBe(90);
        expect(result.monthlyRevenue).toBe(5500);
      });

      const req = httpMock.expectOne(`${apiUrl}/${propertyId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updates);
      req.flush(mockResponse);
    });
  });

  describe('deleteProperty', () => {
    it('should delete a property', () => {
      const propertyId = '123';

      service.deleteProperty(propertyId).subscribe(result => {
        expect(result.success).toBe(true);
      });

      const req = httpMock.expectOne(`${apiUrl}/${propertyId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush({ success: true });
    });
  });

  describe('bulkUpdateProperties', () => {
    it('should bulk update properties', () => {
      const propertyIds = ['1', '2', '3'];
      const updates: Partial<Property> = { status: 'inactive' };

      service.bulkUpdateProperties(propertyIds, updates).subscribe(result => {
        expect(result.updated).toBe(3);
      });

      const req = httpMock.expectOne(`${apiUrl}/bulk-update`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({ propertyIds, updates });
      req.flush({ updated: 3 });
    });
  });

  describe('getFinancialSummary', () => {
    it('should fetch financial summary', () => {
      const propertyId = '123';
      const mockSummary = {
        propertyId,
        monthlyRevenue: 5000,
        annualRevenue: 60000,
        expenses: 12000,
        roi: 12.5,
        occupancyRate: 85
      };

      service.getFinancialSummary(propertyId).subscribe(result => {
        expect(result).toEqual(mockSummary);
      });

      const req = httpMock.expectOne(`${apiUrl}/${propertyId}/financial-summary`);
      expect(req.request.method).toBe('GET');
      req.flush(mockSummary);
    });
  });

  describe('getOccupancyHistory', () => {
    it('should fetch occupancy history', () => {
      const propertyId = '123';
      const mockHistory = [
        { date: new Date('2024-01-01'), occupancyRate: 80 },
        { date: new Date('2024-02-01'), occupancyRate: 85 }
      ];

      service.getOccupancyHistory(propertyId, 2).subscribe(result => {
        expect(result.length).toBe(2);
      });

      const req = httpMock.expectOne(request =>
        request.url === `${apiUrl}/${propertyId}/occupancy-history` &&
        request.params.get('months') === '2'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockHistory);
    });
  });

  describe('uploadPhoto', () => {
    it('should upload a property photo', () => {
      const propertyId = '123';
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const mockPhoto = {
        id: 'photo-1',
        url: 'https://example.com/photo.jpg',
        thumbnailUrl: 'https://example.com/photo-thumb.jpg',
        uploadedAt: new Date()
      };

      service.uploadPhoto(propertyId, file, 'Test photo').subscribe(result => {
        expect(result.id).toBe('photo-1');
      });

      const req = httpMock.expectOne(`${apiUrl}/${propertyId}/photos`);
      expect(req.request.method).toBe('POST');
      req.flush(mockPhoto);
    });
  });

  describe('deletePhoto', () => {
    it('should delete a property photo', () => {
      const propertyId = '123';
      const photoId = 'photo-1';

      service.deletePhoto(propertyId, photoId).subscribe(result => {
        expect(result.success).toBe(true);
      });

      const req = httpMock.expectOne(`${apiUrl}/${propertyId}/photos/${photoId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush({ success: true });
    });
  });
});
