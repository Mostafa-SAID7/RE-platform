export interface Lease {
  id: string;
  propertyId: string;
  tenantId: string;
  startDate: Date;
  endDate: Date;
  monthlyRent: number;
  securityDeposit: number;
  status: LeaseStatus;
  renewalStatus?: RenewalStatus;
  terms: string;
  createdAt: Date;
  updatedAt: Date;
}

export type LeaseStatus = 'active' | 'expired' | 'pending' | 'terminated';
export type RenewalStatus = 'pending' | 'approved' | 'declined';
