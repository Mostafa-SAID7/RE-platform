import { Component, OnInit, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { WorkOrderService } from '../../services/work-order.service';
import { selectWorkOrders, selectWorkOrdersLoading } from '../../store/work-orders/work-orders.selectors';
import { loadWorkOrders } from '../../store/work-orders/work-orders.actions';
import { InputComponent, TextareaComponent, SelectComponent, ButtonComponent } from '../../shared/ui';

@Component({
  selector: 'app-work-order',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, TextareaComponent, SelectComponent, ButtonComponent],
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
          <app-button
            label="Create Work Order"
            variant="primary"
            (click)="openCreateForm()">
          </app-button>
        </div>

        <!-- Create Form Modal -->
        <div *ngIf="showCreateForm()" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white dark:bg-gray-900 rounded-lg shadow-lg dark:shadow-xl p-6 max-w-md w-full border border-gray-200 dark:border-gray-800 transition-colors duration-200">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Create Work Order</h2>
            <form [formGroup]="workOrderForm" (ngSubmit)="submitWorkOrder()" class="space-y-4">
              <app-select
                id="propertyId"
                label="Property"
                placeholder="Select Property"
                formControlName="propertyId"
                [options]="propertyOptions"
                [required]="true">
              </app-select>
              <app-textarea
                id="description"
                label="Description"
                placeholder="Enter work order description"
                formControlName="description"
                [required]="true">
              </app-textarea>
              <app-select
                id="priority"
                label="Priority"
                formControlName="priority"
                [options]="priorityOptions"
                [required]="true">
              </app-select>
              <app-input
                id="estimatedCost"
                type="number"
                label="Estimated Cost"
                placeholder="0.00"
                formControlName="estimatedCost"
                [required]="true">
              </app-input>
              <div class="flex gap-4">
                <app-button
                  label="Create"
                  type="submit"
                  variant="primary"
                  [fullWidth]="true">
                </app-button>
                <app-button
                  label="Cancel"
                  type="button"
                  variant="secondary"
                  [fullWidth]="true"
                  (click)="closeCreateForm()">
                </app-button>
              </div>
            </form>
          </div>
        </div>

        <!-- Work Orders List -->
        <div class="bg-white dark:bg-gray-900 rounded-lg shadow dark:shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800 transition-colors duration-200">
          <table class="w-full">
            <thead class="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">ID</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Property</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Description</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Priority</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Cost</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr *ngFor="let order of (workOrders$ | async)" class="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <td class="px-6 py-4 text-sm text-gray-900 dark:text-white">{{ order.id }}</td>
                <td class="px-6 py-4 text-sm text-gray-900 dark:text-white">{{ order.propertyAddress }}</td>
                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{{ order.description }}</td>
                <td class="px-6 py-4 text-sm">
                  <span [ngClass]="getPriorityClass(order.priority)" class="px-3 py-1 rounded-full text-xs font-semibold">
                    {{ order.priority }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm">
                  <span [ngClass]="getStatusClass(order.status)" class="px-3 py-1 rounded-full text-xs font-semibold">
                    {{ order.status }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-900 dark:text-white">{{ order.estimatedCost | currency }}</td>
                <td class="px-6 py-4 text-sm">
                  <button class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-4 transition-colors">Edit</button>
                  <button class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
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
    { value: '', label: 'Select Property' },
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

  getPriorityClass(priority: string): string {
    const classes: { [key: string]: string } = {
      low: 'bg-blue-100 text-blue-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return classes[priority] || 'bg-gray-100 text-gray-800';
  }

  getStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      assigned: 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }
}
