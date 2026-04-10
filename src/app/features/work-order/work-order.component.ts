import { Component, OnInit, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { WorkOrderService } from '../../services/work-order.service';
import { selectWorkOrders, selectWorkOrdersLoading } from '../../store/work-orders/work-orders.selectors';
import { loadWorkOrders } from '../../store/work-orders/work-orders.actions';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-work-order',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    SelectModule,
    ButtonModule,
    DialogModule,
    TableModule,
    BadgeModule,
    TooltipModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-6 bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors duration-200">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Work Orders</h1>
            <p class="text-gray-600 dark:text-gray-400 mt-2">Manage maintenance and repairs</p>
          </div>
          <p-button
            label="Create Work Order"
            icon="pi pi-plus"
            (click)="openCreateForm()">
          </p-button>
        </div>

        <!-- Create Form Dialog -->
        <p-dialog
          [(visible)]="showCreateForm"
          header="Create Work Order"
          [modal]="true"
          [style]="{ width: '50vw' }">
          <form [formGroup]="workOrderForm" (ngSubmit)="submitWorkOrder()" class="space-y-4">
            <div class="field">
              <label for="propertyId" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Property</label>
              <p-select
                id="propertyId"
                formControlName="propertyId"
                [options]="propertyOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Select Property"
                [showClear]="true">
              </p-select>
            </div>
            <div class="field">
              <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
              <textarea pInputTextarea
                id="description"
                formControlName="description"
                placeholder="Enter work order description"
                rows="4"
                class="w-full">
              </textarea>
            </div>
            <div class="field">
              <label for="priority" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Priority</label>
              <p-select
                id="priority"
                formControlName="priority"
                [options]="priorityOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Select Priority">
              </p-select>
            </div>
            <div class="field">
              <label for="estimatedCost" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Estimated Cost</label>
              <input pInputText
                id="estimatedCost"
                type="number"
                formControlName="estimatedCost"
                placeholder="0.00"
                class="w-full">
            </div>
            <div class="flex gap-4 pt-4">
              <p-button
                label="Create"
                type="submit"
                [disabled]="!workOrderForm.valid">
              </p-button>
              <p-button
                label="Cancel"
                severity="secondary"
                (click)="closeCreateForm()">
              </p-button>
            </div>
          </form>
        </p-dialog>

        <!-- Work Orders List -->
        <p-table [value]="(workOrders$ | async) || []" [tableStyle]="{ 'min-width': '50rem' }" styleClass="p-datatable-striped">
          <ng-template pTemplate="header">
            <tr>
              <th pSortableColumn="id">ID <p-sortIcon field="id"></p-sortIcon></th>
              <th pSortableColumn="propertyAddress">Property <p-sortIcon field="propertyAddress"></p-sortIcon></th>
              <th pSortableColumn="description">Description <p-sortIcon field="description"></p-sortIcon></th>
              <th pSortableColumn="priority">Priority <p-sortIcon field="priority"></p-sortIcon></th>
              <th pSortableColumn="status">Status <p-sortIcon field="status"></p-sortIcon></th>
              <th pSortableColumn="estimatedCost">Cost <p-sortIcon field="estimatedCost"></p-sortIcon></th>
              <th>Actions</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-order>
            <tr>
              <td>{{ order.id }}</td>
              <td>{{ order.propertyAddress }}</td>
              <td>{{ order.description }}</td>
              <td>
                <p-badge [value]="order.priority" [severity]="getPrioritySeverity(order.priority)"></p-badge>
              </td>
              <td>
                <p-badge [value]="order.status" [severity]="getStatusSeverity(order.status)"></p-badge>
              </td>
              <td>{{ order.estimatedCost | currency }}</td>
              <td>
                <p-button
                  icon="pi pi-pencil"
                  [rounded]="true"
                  [text]="true"
                  severity="info"
                  pTooltip="Edit"
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
      </div>
    </div>
  `
})
export class WorkOrderComponent implements OnInit {
  private store = inject(Store);
  private fb = inject(FormBuilder);
  private workOrderService = inject(WorkOrderService);

  workOrders$: Observable<any[]>;
  isLoading$: Observable<boolean>;
  workOrderForm: FormGroup;
  showCreateForm = signal<boolean>(false);

  propertyOptions = [
    { value: 'prop1', label: 'Property 1' },
    { value: 'prop2', label: 'Property 2' },
    { value: 'prop3', label: 'Property 3' }
  ];

  priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' }
  ];

  constructor() {
    this.workOrders$ = this.store.select(selectWorkOrders);
    this.isLoading$ = this.store.select(selectWorkOrdersLoading);
    this.workOrderForm = this.fb.group({
      propertyId: ['', Validators.required],
      description: ['', Validators.required],
      priority: ['medium', Validators.required],
      estimatedCost: [0, Validators.required]
    });
  }

  ngOnInit(): void {
    this.store.dispatch(loadWorkOrders());
  }

  openCreateForm(): void {
    this.showCreateForm.set(true);
  }

  closeCreateForm(): void {
    this.showCreateForm.set(false);
    this.workOrderForm.reset();
  }

  submitWorkOrder(): void {
    if (this.workOrderForm.valid) {
      // Dispatch action to create work order
      this.closeCreateForm();
    }
  }

  getPrioritySeverity(priority: string): 'info' | 'warn' | 'danger' | 'success' {
    const severityMap: { [key: string]: 'info' | 'warn' | 'danger' | 'success' } = {
      low: 'info',
      medium: 'warn',
      high: 'danger',
      urgent: 'danger'
    };
    return severityMap[priority] || 'info';
  }

  getStatusSeverity(status: string): 'info' | 'warn' | 'danger' | 'success' {
    const severityMap: { [key: string]: 'info' | 'warn' | 'danger' | 'success' } = {
      assigned: 'info',
      'in-progress': 'warn',
      completed: 'success',
      cancelled: 'danger'
    };
    return severityMap[status] || 'info';
  }
}
