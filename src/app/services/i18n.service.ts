import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private currentLanguage = signal<string>(this.getStoredLanguage());
  private translations: { [key: string]: { [key: string]: string } } = {
    en: {
      'dashboard': 'Dashboard',
      'properties': 'Properties',
      'tenants': 'Tenants',
      'map': 'Map',
      'financial': 'Financial Analytics',
      'work_orders': 'Work Orders',
      'reporting': 'Reports',
      'notifications': 'Notifications',
      'total_revenue': 'Total Revenue',
      'total_expenses': 'Total Expenses',
      'net_profit': 'Net Profit',
      'occupancy_rate': 'Occupancy Rate',
      'roi': 'ROI',
      'create': 'Create',
      'edit': 'Edit',
      'delete': 'Delete',
      'save': 'Save',
      'cancel': 'Cancel',
      'logout': 'Logout',
      'profile': 'Profile',
      'settings': 'Settings'
    },
    ar: {
      'dashboard': 'لوحة التحكم',
      'properties': 'العقارات',
      'tenants': 'المستأجرون',
      'map': 'الخريطة',
      'financial': 'التحليلات المالية',
      'work_orders': 'أوامر العمل',
      'reporting': 'التقارير',
      'notifications': 'الإشعارات',
      'total_revenue': 'إجمالي الإيرادات',
      'total_expenses': 'إجمالي النفقات',
      'net_profit': 'صافي الربح',
      'occupancy_rate': 'معدل الإشغال',
      'roi': 'العائد على الاستثمار',
      'create': 'إنشاء',
      'edit': 'تعديل',
      'delete': 'حذف',
      'save': 'حفظ',
      'cancel': 'إلغاء',
      'logout': 'تسجيل الخروج',
      'profile': 'الملف الشخصي',
      'settings': 'الإعدادات'
    }
  };

  constructor() {
    this.applyLanguage(this.currentLanguage());
  }

  getCurrentLanguage(): string {
    return this.currentLanguage();
  }

  setLanguage(language: string): void {
    this.currentLanguage.set(language);
    localStorage.setItem('language', language);
    this.applyLanguage(language);
  }

  translate(key: string): string {
    const lang = this.currentLanguage();
    return this.translations[lang]?.[key] || this.translations['en']?.[key] || key;
  }

  isRTL(): boolean {
    return this.currentLanguage() === 'ar';
  }

  formatDate(date: Date): string {
    const lang = this.currentLanguage();
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-SA' : 'en-US', options).format(date);
  }

  formatCurrency(amount: number): string {
    const lang = this.currentLanguage();
    const currency = lang === 'ar' ? 'SAR' : 'USD';
    return new Intl.NumberFormat(lang === 'ar' ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  formatNumber(num: number): string {
    const lang = this.currentLanguage();
    return new Intl.NumberFormat(lang === 'ar' ? 'ar-SA' : 'en-US').format(num);
  }

  private getStoredLanguage(): string {
    return localStorage.getItem('language') || 'en';
  }

  private applyLanguage(language: string): void {
    const htmlElement = document.documentElement;
    htmlElement.lang = language;
    htmlElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.body.style.direction = language === 'ar' ? 'rtl' : 'ltr';
  }
}
