export interface Payment {
  id: string;
  leaseId: string;
  tenantId: string;
  propertyId: string;
  amount: number;
  paymentDate: Date;
  dueDate: Date;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  notes?: string;
  createdAt: Date;
}

export type PaymentStatus = 'paid' | 'pending' | 'overdue' | 'partial';
export type PaymentMethod = 'bank_transfer' | 'check' | 'cash' | 'credit_card';
