export interface Property {
  id: string;
  address: PropertyAddress;
  type: PropertyType;
  sizeSqft: number;
  yearBuilt: number;
  ownerId: string;
  managerId: string;
  occupancyRate: number;
  monthlyRevenue: number;
  annualRevenue: number;
  roi: number;
  status: PropertyStatus;
  coordinates: Coordinates;
  photos: PropertyPhoto[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PropertyAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PropertyPhoto {
  id: string;
  url: string;
  thumbnailUrl: string;
  caption?: string;
  uploadedAt: Date;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export type PropertyType = 'residential' | 'commercial' | 'mixed-use';
export type PropertyStatus = 'active' | 'inactive' | 'maintenance';
