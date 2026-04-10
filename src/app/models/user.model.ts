export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: UserRole;
  permissions: Permission[];
  language: Language;
  preferences: UserPreferences;
  assignedProperties?: string[];
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

export interface Permission {
  resource: string;
  actions: PermissionAction[];
}

export interface UserPreferences {
  theme: Theme;
  notifications: NotificationPreferences;
  dashboardLayout?: string;
}

export interface NotificationPreferences {
  email: boolean;
  inApp: boolean;
  categories: string[];
}

export type UserRole = 'admin' | 'investor' | 'property_manager' | 'vendor';
export type PermissionAction = 'create' | 'read' | 'update' | 'delete';
export type Language = 'en' | 'ar';
export type Theme = 'light' | 'dark';
