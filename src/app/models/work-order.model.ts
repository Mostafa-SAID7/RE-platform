export interface WorkOrder {
  id: string;
  propertyId: string;
  title: string;
  description: string;
  priority: WorkOrderPriority;
  category: WorkOrderCategory;
  estimatedCost: number;
  actualCost?: number;
  status: WorkOrderStatus;
  vendorId?: string;
  assignedTo?: string;
  scheduledDate?: Date;
  completedDate?: Date;
  photos: WorkOrderPhoto[];
  notes: WorkOrderNote[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkOrderPhoto {
  id: string;
  url: string;
  caption?: string;
  uploadedAt: Date;
}

export interface WorkOrderNote {
  id: string;
  text: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
}

export type WorkOrderPriority = 'low' | 'medium' | 'high' | 'critical';
export type WorkOrderCategory = 'plumbing' | 'electrical' | 'hvac' | 'structural' | 'cosmetic' | 'other';
export type WorkOrderStatus = 'assigned' | 'in_progress' | 'completed' | 'cancelled';
