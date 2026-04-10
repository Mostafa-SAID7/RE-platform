import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

interface ReportRecord {
  name: string;
  type: string;
  generated: string;
}

@Component({
  selector: 'app-report-history',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p-table [value]="reports" [tableStyle]="{ 'min-width': '50rem' }" styleClass="p-datatable-striped">
      <ng-template pTemplate="header">
        <tr>
          <th pSortableColumn="name">Report Name <p-sortIcon field="name"></p-sortIcon></th>
          <th pSortableColumn="type">Type <p-sortIcon field="type"></p-sortIcon></th>
          <th pSortableColumn="generated">Generated <p-sortIcon field="generated"></p-sortIcon></th>
          <th>Actions</th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-report>
        <tr>
          <td>{{ report.name }}</td>
          <td>{{ report.type }}</td>
          <td>{{ report.generated }}</td>
          <td>
            <p-button
              icon="pi pi-download"
              [rounded]="true"
              [text]="true"
              severity="info"
              pTooltip="Download"
              tooltipPosition="top"
              class="mr-2">
            </p-button>
            <p-button
              icon="pi pi-trash"
              [rounded]="true"
              [text]="true"
              severity="danger"
              pTooltip="Delete"
              tooltipPosition="top">
            </p-button>
          </td>
        </tr>
      </ng-template>
    </p-table>
  `
})
export class ReportHistoryComponent {
  reports: ReportRecord[] = [
    {
      name: 'Q4 2024 Revenue Report',
      type: 'Revenue',
      generated: 'Dec 15, 2024'
    }
  ];
}
