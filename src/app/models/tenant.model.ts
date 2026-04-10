export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: TenantAddress;
  emergencyContact?: EmergencyContact;
  documents: TenantDocument[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface TenantDocument {
  id: string;
  type: TenantDocumentType;
  name: string;
  url: string;
  uploadedAt: Date;
}

export type TenantDocumentType = 'lease' | 'identification' | 'insurance' | 'other';
