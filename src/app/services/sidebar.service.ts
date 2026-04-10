import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  isMobileSidebarOpen = signal<boolean>(false);
  isSidebarCollapsed = signal<boolean>(false);

  toggleMobileSidebar(): void {
    this.isMobileSidebarOpen.update(v => !v);
  }

  closeMobileSidebar(): void {
    this.isMobileSidebarOpen.set(false);
  }

  openMobileSidebar(): void {
    this.isMobileSidebarOpen.set(true);
  }

  toggleSidebarCollapse(collapsed: boolean): void {
    this.isSidebarCollapsed.set(collapsed);
  }
}
