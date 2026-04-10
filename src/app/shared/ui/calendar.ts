import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, forwardRef, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CalendarComponent),
      multi: true
    }
  ],
  template: `
    <div class="w-full">
      <label *ngIf="label" [for]="id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {{ label }}
        <span *ngIf="required" class="text-red-500">*</span>
      </label>
      <div class="relative">
        <!-- Input field -->
        <div class="flex items-center gap-2">
          <input
            [id]="id"
            type="text"
            [value]="formattedValue()"
            (click)="toggleCalendar()"
            [disabled]="disabled"
            [class.border-red-500]="error"
            class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            [placeholder]="placeholder"
            readonly
            [attr.aria-label]="label || 'Date picker'"
            [attr.aria-invalid]="error ? 'true' : 'false'"
            [attr.aria-describedby]="error ? id + '-error' : null"
          />
          <!-- Calendar icon button -->
          <button
            type="button"
            (click)="toggleCalendar()"
            [disabled]="disabled"
            class="px-3 py-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            [attr.aria-label]="'Open calendar'"
          >
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M4 4a2 2 0 00-2 2v2h16V6a2 2 0 00-2-2H4z" />
              <path fill-rule="evenodd" d="M2 8h16v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8zm2 3a1 1 0 000 2h1a1 1 0 000-2H4zm4-1a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm3 0a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm3 0a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-9 4a1 1 0 000 2h1a1 1 0 000-2H4zm4-1a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm3 0a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm3 0a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>

        <!-- Calendar Popup -->
        <div *ngIf="isOpen()" class="absolute top-full left-0 mt-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg dark:shadow-xl p-4 z-50 w-80">
          <!-- Header -->
          <div class="flex justify-between items-center mb-4">
            <button
              type="button"
              (click)="previousMonth()"
              class="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
              [attr.aria-label]="'Previous month'"
            >
              <svg class="h-5 w-5 text-gray-600 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
              {{ monthYear() }}
            </h3>
            <button
              type="button"
              (click)="nextMonth()"
              class="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
              [attr.aria-label]="'Next month'"
            >
              <svg class="h-5 w-5 text-gray-600 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>

          <!-- Weekday headers -->
          <div class="grid grid-cols-7 gap-1 mb-2">
            <div *ngFor="let day of weekDays" class="text-center text-xs font-medium text-gray-600 dark:text-gray-400 py-2">
              {{ day }}
            </div>
          </div>

          <!-- Calendar days -->
          <div class="grid grid-cols-7 gap-1">
            <button
              *ngFor="let day of calendarDays()"
              type="button"
              (click)="selectDate(day)"
              [disabled]="day === null || isDateDisabled(day)"
              [class.bg-blue-600]="isSelectedDate(day)"
              [class.text-white]="isSelectedDate(day)"
              [class.hover:bg-blue-700]="isSelectedDate(day)"
              [class.text-gray-400]="day === null"
              [class.text-gray-600]="day !== null && !isSelectedDate(day)"
              [class.dark:text-gray-400]="day === null"
              [class.dark:text-gray-300]="day !== null && !isSelectedDate(day)"
              [class.hover:bg-gray-100]="day !== null && !isSelectedDate(day)"
              [class.dark:hover:bg-gray-800]="day !== null && !isSelectedDate(day)"
              [class.cursor-not-allowed]="day === null || isDateDisabled(day)"
              [class.opacity-50]="isDateDisabled(day)"
              class="p-2 text-sm rounded transition-colors disabled:cursor-not-allowed"
            >
              {{ day || '' }}
            </button>
          </div>

          <!-- Footer buttons -->
          <div class="flex gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              (click)="closeCalendar()"
              class="flex-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              (click)="confirmDate()"
              [disabled]="!value"
              class="flex-1 px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      </div>

      <p *ngIf="error" [id]="id + '-error'" class="mt-1 text-sm text-red-600 dark:text-red-400">
        {{ error }}
      </p>
      <p *ngIf="hint && !error" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {{ hint }}
      </p>
    </div>
  `,
  styles: []
})
export class CalendarComponent implements ControlValueAccessor {
  @Input() id: string = 'calendar-' + Math.random().toString(36).substring(2, 11);
  @Input() label: string = '';
  @Input() placeholder: string = 'Select a date';
  @Input() error: string = '';
  @Input() hint: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() min: string = '';
  @Input() max: string = '';
  @Output() valueChange = new EventEmitter<string>();

  value: string = '';
  isOpen = signal<boolean>(false);
  currentMonth = signal<Date>(new Date());
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  private onChangeFn: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  formattedValue = computed(() => {
    if (!this.value) return '';
    const date = new Date(this.value);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  });

  monthYear = computed(() => {
    const date = this.currentMonth();
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  });

  calendarDays = computed(() => {
    const date = this.currentMonth();
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days: (number | null)[] = [];

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push(null);
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push(null);
    }

    return days;
  });

  toggleCalendar(): void {
    if (!this.disabled) {
      this.isOpen.set(!this.isOpen());
    }
  }

  closeCalendar(): void {
    this.isOpen.set(false);
  }

  previousMonth(): void {
    const date = new Date(this.currentMonth());
    date.setMonth(date.getMonth() - 1);
    this.currentMonth.set(date);
  }

  nextMonth(): void {
    const date = new Date(this.currentMonth());
    date.setMonth(date.getMonth() + 1);
    this.currentMonth.set(date);
  }

  selectDate(day: number | null): void {
    if (day === null || this.isDateDisabled(day)) return;

    const date = new Date(this.currentMonth());
    date.setDate(day);
    const dateStr = date.toISOString().split('T')[0];
    this.value = dateStr || '';
  }

  confirmDate(): void {
    if (this.value) {
      this.onChangeFn(this.value);
      this.valueChange.emit(this.value);
      this.closeCalendar();
    }
  }

  isSelectedDate(day: number | null): boolean {
    if (day === null || !this.value) return false;
    const selectedDate = new Date(this.value);
    const currentDate = new Date(this.currentMonth());
    return (
      day === selectedDate.getDate() &&
      currentDate.getMonth() === selectedDate.getMonth() &&
      currentDate.getFullYear() === selectedDate.getFullYear()
    );
  }

  isDateDisabled(day: number | null): boolean {
    if (day === null) return true;

    const date = new Date(this.currentMonth());
    date.setDate(day);
    const dateStr = date.toISOString().split('T')[0] || '';

    if (this.min && dateStr < this.min) return true;
    if (this.max && dateStr > this.max) return true;

    return false;
  }

  writeValue(value: string): void {
    this.value = value || '';
    if (value) {
      const date = new Date(value);
      this.currentMonth.set(new Date(date.getFullYear(), date.getMonth(), 1));
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
