import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

export interface RadioOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-radio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioComponent),
      multi: true
    }
  ],
  template: `
    <fieldset class="w-full">
      <legend *ngIf="label" class="text-sm font-medium text-gray-900 dark:text-gray-300 mb-3">
        {{ label }}
        <span *ngIf="required" class="text-red-500">*</span>
      </legend>
      <div [class.space-y-2]="!inline" [class.flex]="inline" [class.gap-4]="inline" [class.flex-wrap]="inline">
        <div *ngFor="let option of options" class="flex items-center">
          <input
            [id]="id + '-' + option.value"
            type="radio"
            [name]="id"
            [value]="option.value"
            [checked]="selectedValue === option.value"
            (change)="onChange($event)"
            [disabled]="disabled || option.disabled"
            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-offset-0 dark:bg-gray-700 dark:border-gray-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            [attr.aria-label]="option.label"
          />
          <label [for]="id + '-' + option.value" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer">
            {{ option.label }}
          </label>
        </div>
      </div>
    </fieldset>
    <p *ngIf="hint" class="mt-2 text-sm text-gray-500 dark:text-gray-400">
      {{ hint }}
    </p>
  `,
  styles: []
})
export class RadioComponent implements ControlValueAccessor {
  @Input() id: string = 'radio-' + Math.random().toString(36).substring(2, 11);
  @Input() label: string = '';
  @Input() hint: string = '';
  @Input() options: RadioOption[] = [];
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() inline: boolean = false;
  @Output() valueChange = new EventEmitter<string | number>();

  selectedValue: string | number | null = null;
  private onChangeFn: (value: string | number) => void = () => {};
  private onTouched: () => void = () => {};

  onChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.selectedValue = target.value;
    this.onChangeFn(this.selectedValue);
    this.valueChange.emit(this.selectedValue);
  }

  writeValue(value: string | number): void {
    this.selectedValue = value || null;
  }

  registerOnChange(fn: (value: string | number) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
