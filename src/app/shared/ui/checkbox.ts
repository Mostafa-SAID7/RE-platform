import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true
    }
  ],
  template: `
    <div class="flex items-center">
      <input
        [id]="id"
        type="checkbox"
        [checked]="checked"
        (change)="onChange($event)"
        [disabled]="disabled"
        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-offset-0 dark:bg-gray-700 dark:border-gray-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        [attr.aria-label]="label"
        [attr.aria-checked]="checked"
      />
      <label *ngIf="label" [for]="id" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer">
        {{ label }}
        <span *ngIf="required" class="text-red-500">*</span>
      </label>
    </div>
    <p *ngIf="hint" class="mt-1 text-sm text-gray-500 dark:text-gray-400 ml-6">
      {{ hint }}
    </p>
  `,
  styles: []
})
export class CheckboxComponent implements ControlValueAccessor {
  @Input() id: string = 'checkbox-' + Math.random().toString(36).substring(2, 11);
  @Input() label: string = '';
  @Input() hint: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Output() valueChange = new EventEmitter<boolean>();

  checked: boolean = false;
  private onChangeFn: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  onChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.checked = target.checked;
    this.onChangeFn(this.checked);
    this.valueChange.emit(this.checked);
  }

  writeValue(value: boolean): void {
    this.checked = value || false;
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
