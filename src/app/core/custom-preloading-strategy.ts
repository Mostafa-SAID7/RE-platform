import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CustomPreloadingStrategy implements PreloadingStrategy {
  // Routes to preload (critical routes)
  private preloadRoutes = [
    'dashboard',
    'properties',
    'tenants'
  ];

  preload(route: Route, load: () => Observable<any>): Observable<any> {
    if (this.shouldPreload(route)) {
      // Preload after a delay to avoid blocking initial load
      return timer(500).pipe(
        mergeMap(() => load())
      );
    }
    return of(null);
  }

  private shouldPreload(route: Route): boolean {
    // Check if route has preload flag or is in preload list
    const data = route.data as any;
    if (data && data.preload) {
      return true;
    }
    
    // Check if route path is in preload list
    if (route.path && this.preloadRoutes.includes(route.path)) {
      return true;
    }
    
    return false;
  }
}
