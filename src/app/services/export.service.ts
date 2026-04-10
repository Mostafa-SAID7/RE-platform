import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  exportToCSV(data: any[], filename: string): void {
    const csv = this.convertToCSV(data);
    this.downloadFile(csv, filename, 'text/csv');
  }

  exportToJSON(data: any[], filename: string): void {
    const json = JSON.stringify(data, null, 2);
    this.downloadFile(json, filename, 'application/json');
  }

  exportToExcel(data: any[], filename: string): void {
    // This would require a library like xlsx
    // For now, we'll export as CSV with Excel-compatible format
    const csv = this.convertToCSV(data);
    this.downloadFile(csv, filename, 'application/vnd.ms-excel');
  }

  exportToPDF(data: any[], filename: string): void {
    // This would require a library like jsPDF
    // For now, we'll create a simple text representation
    const text = this.convertToText(data);
    this.downloadFile(text, filename, 'application/pdf');
  }

  private convertToCSV(data: any[]): string {
    if (!data || data.length === 0) {
      return '';
    }

    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(','),
      ...data.map(row =>
        headers.map(header => {
          const value = row[header];
          // Escape quotes and wrap in quotes if contains comma
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    return csv;
  }

  private convertToText(data: any[]): string {
    return data.map(item => JSON.stringify(item)).join('\n');
  }

  private downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
