import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  roi: number;
  occupancyRate: number;
}

export interface RevenueBreakdown {
  category: string;
  amount: number;
  percentage: number;
}

export interface ExpenseBreakdown {
  category: string;
  amount: number;
  percentage: number;
}

export interface CashFlowData {
  date: Date;
  income: number;
  expenses: number;
  netCashFlow: number;
}

export interface ROIData {
  propertyId: string;
  propertyName: string;
  roi: number;
  investment: number;
  profit: number;
}

export interface ProjectionData {
  month: string;
  projectedRevenue: number;
  projectedExpenses: number;
  projectedProfit: number;
}

export interface FinancialRecord {
  id: string;
  propertyId: string;
  type: 'revenue' | 'expense';
  category: string;
  amount: number;
  recordDate: Date;
  description: string;
  relatedEntityId?: string;
  relatedEntityType?: string;
  createdAt: Date;
}

export interface FinancialRecordListResponse {
  data: FinancialRecord[];
  total: number;
  page: number;
  limit: number;
}

export interface FinancialRecordFilters {
  page?: number;
  limit?: number;
  type?: string;
  category?: string;
  propertyId?: string;
  startDate?: Date;
  endDate?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class FinancialService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/financials`;

  /**
   * Get financial summary for a date range
   */
  getSummary(startDate?: Date, endDate?: Date, propertyIds?: string[]): Observable<FinancialSummary> {
    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate.toISOString());
    if (endDate) params = params.set('endDate', endDate.toISOString());
    if (propertyIds && propertyIds.length > 0) {
      propertyIds.forEach(id => {
        params = params.append('propertyIds', id);
      });
    }

    return this.http.get<FinancialSummary>(`${this.apiUrl}/summary`, { params });
  }

  /**
   * Get revenue breakdown
   */
  getRevenueBreakdown(startDate?: Date, endDate?: Date, groupBy?: string): Observable<RevenueBreakdown[]> {
    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate.toISOString());
    if (endDate) params = params.set('endDate', endDate.toISOString());
    if (groupBy) params = params.set('groupBy', groupBy);

    return this.http.get<RevenueBreakdown[]>(`${this.apiUrl}/revenue-breakdown`, { params });
  }

  /**
   * Get expense breakdown
   */
  getExpenseBreakdown(startDate?: Date, endDate?: Date, groupBy?: string): Observable<ExpenseBreakdown[]> {
    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate.toISOString());
    if (endDate) params = params.set('endDate', endDate.toISOString());
    if (groupBy) params = params.set('groupBy', groupBy);

    return this.http.get<ExpenseBreakdown[]>(`${this.apiUrl}/expense-breakdown`, { params });
  }

  /**
   * Get cash flow data
   */
  getCashFlow(startDate?: Date, endDate?: Date, interval?: string): Observable<CashFlowData[]> {
    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate.toISOString());
    if (endDate) params = params.set('endDate', endDate.toISOString());
    if (interval) params = params.set('interval', interval);

    return this.http.get<CashFlowData[]>(`${this.apiUrl}/cash-flow`, { params });
  }

  /**
   * Get ROI data
   */
  getROI(propertyIds?: string[]): Observable<ROIData[]> {
    let params = new HttpParams();
    if (propertyIds && propertyIds.length > 0) {
      propertyIds.forEach(id => {
        params = params.append('propertyIds', id);
      });
    }

    return this.http.get<ROIData[]>(`${this.apiUrl}/roi`, { params });
  }

  /**
   * Get revenue projections
   */
  getProjections(months?: number): Observable<ProjectionData[]> {
    let params = new HttpParams();
    if (months) params = params.set('months', months.toString());

    return this.http.get<ProjectionData[]>(`${this.apiUrl}/projections`, { params });
  }

  /**
   * Create a financial record
   */
  createRecord(record: Partial<FinancialRecord>): Observable<FinancialRecord> {
    return this.http.post<FinancialRecord>(`${this.apiUrl}/records`, record);
  }

  /**
   * Get financial records with optional filtering
   */
  getRecords(filters?: FinancialRecordFilters): Observable<FinancialRecordListResponse> {
    let params = new HttpParams();

    if (filters) {
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.limit) params = params.set('limit', filters.limit.toString());
      if (filters.type) params = params.set('type', filters.type);
      if (filters.category) params = params.set('category', filters.category);
      if (filters.propertyId) params = params.set('propertyId', filters.propertyId);
      if (filters.startDate) params = params.set('startDate', filters.startDate.toISOString());
      if (filters.endDate) params = params.set('endDate', filters.endDate.toISOString());
    }

    return this.http.get<FinancialRecordListResponse>(`${this.apiUrl}/records`, { params });
  }
}
