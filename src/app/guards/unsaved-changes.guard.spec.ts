import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { unsavedChangesGuard, ComponentWithUnsavedChanges } from './unsaved-changes.guard';

describe('unsavedChangesGuard', () => {
  let mockComponent: jasmine.SpyObj<ComponentWithUnsavedChanges>;
  let mockCurrentRoute: ActivatedRouteSnapshot;
  let mockCurrentState: RouterStateSnapshot;
  let mockNextState: RouterStateSnapshot;

  beforeEach(() => {
    mockComponent = jasmine.createSpyObj('ComponentWithUnsavedChanges', ['hasUnsavedChanges']);
    mockCurrentRoute = {} as ActivatedRouteSnapshot;
    mockCurrentState = { url: '/current' } as RouterStateSnapshot;
    mockNextState = { url: '/next' } as RouterStateSnapshot;
  });

  it('should allow navigation when component has no unsaved changes', () => {
    mockComponent.hasUnsavedChanges.and.returnValue(false);

    const result = TestBed.runInInjectionContext(() => 
      unsavedChangesGuard(mockComponent, mockCurrentRoute, mockCurrentState, mockNextState)
    );

    expect(result).toBe(true);
    expect(mockComponent.hasUnsavedChanges).toHaveBeenCalled();
  });

  it('should show confirmation dialog when component has unsaved changes', () => {
    mockComponent.hasUnsavedChanges.and.returnValue(true);
    spyOn(window, 'confirm').and.returnValue(true);

    const result = TestBed.runInInjectionContext(() => 
      unsavedChangesGuard(mockComponent, mockCurrentRoute, mockCurrentState, mockNextState)
    );

    expect(result).toBe(true);
    expect(mockComponent.hasUnsavedChanges).toHaveBeenCalled();
    expect(window.confirm).toHaveBeenCalledWith(
      'You have unsaved changes. Are you sure you want to leave this page? Your changes will be lost.'
    );
  });

  it('should prevent navigation when user cancels confirmation', () => {
    mockComponent.hasUnsavedChanges.and.returnValue(true);
    spyOn(window, 'confirm').and.returnValue(false);

    const result = TestBed.runInInjectionContext(() => 
      unsavedChangesGuard(mockComponent, mockCurrentRoute, mockCurrentState, mockNextState)
    );

    expect(result).toBe(false);
    expect(window.confirm).toHaveBeenCalled();
  });

  it('should allow navigation when component does not implement interface', () => {
    const componentWithoutInterface = {} as ComponentWithUnsavedChanges;

    const result = TestBed.runInInjectionContext(() => 
      unsavedChangesGuard(componentWithoutInterface, mockCurrentRoute, mockCurrentState, mockNextState)
    );

    expect(result).toBe(true);
  });

  it('should allow navigation when component is null', () => {
    const result = TestBed.runInInjectionContext(() => 
      unsavedChangesGuard(null as any, mockCurrentRoute, mockCurrentState, mockNextState)
    );

    expect(result).toBe(true);
  });
});
