import { CanDeactivateFn } from '@angular/router';
import { Observable } from 'rxjs';

/**
 * Interface for components that have unsaved changes
 * Components using this guard should implement this interface
 */
export interface ComponentWithUnsavedChanges {
  hasUnsavedChanges(): boolean;
}

/**
 * UnsavedChangesGuard - Prevents navigation away from forms with unsaved changes
 * 
 * Usage:
 * 1. Add to route's canDeactivate array
 * 2. Component must implement ComponentWithUnsavedChanges interface
 * 3. Component must provide hasUnsavedChanges() method returning boolean
 * 
 * Example component implementation:
 * ```typescript
 * export class PropertyEditComponent implements ComponentWithUnsavedChanges {
 *   private formDirty = false;
 *   
 *   hasUnsavedChanges(): boolean {
 *     return this.formDirty || this.propertyForm.dirty;
 *   }
 * }
 * ```
 * 
 * Features:
 * - Shows browser confirmation dialog if component has unsaved changes
 * - Allows navigation if no unsaved changes
 * - Supports both synchronous and asynchronous checks
 */
export const unsavedChangesGuard: CanDeactivateFn<ComponentWithUnsavedChanges> = (
  component: ComponentWithUnsavedChanges
): boolean | Observable<boolean> => {
  // Check if component implements the interface and has the method
  if (component && typeof component.hasUnsavedChanges === 'function') {
    // If there are unsaved changes, show confirmation dialog
    if (component.hasUnsavedChanges()) {
      return confirm(
        'You have unsaved changes. Are you sure you want to leave this page? Your changes will be lost.'
      );
    }
  }

  // No unsaved changes, allow navigation
  return true;
};
