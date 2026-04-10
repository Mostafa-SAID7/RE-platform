import { Component, ChangeDetectionStrategy, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectUnreadCount } from '../../store/notifications/notifications.selectors';
import { SidebarService } from '../../services/sidebar.service';

interface NavItem {
  label: string;
  route: string;
  icon: string;
  badge?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside 
      [ngClass]="{
        'w-64': !isCollapsed(),
        'w-20': isCollapsed(),
        'dark:bg-gray-900': isDarkMode(),
        'bg-white': !isDarkMode(),
        'hidden md:block': !isMobileSidebarOpen(),
        'block': isMobileSidebarOpen()
      }"
      class="fixed md:sticky left-0 top-16 md:top-16 h-[calc(100vh-4rem)] transition-all duration-300 border-r border-gray-200 dark:border-gray-800 shadow-sm dark:shadow-lg scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent z-30 flex flex-col overflow-hidden">
      
      <!-- Navigation Menu -->
      <nav class="flex-1 space-y-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
        <a 
          *ngFor="let item of navItems"
          [routerLink]="item.route"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{ exact: false }"
          (click)="closeMobileSidebar()"
          [ngClass]="{
            'bg-blue-50 dark:bg-gray-800 text-blue-600 dark:text-blue-400': isActive(item.route),
            'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800': !isActive(item.route)
          }"
          class="flex items-center gap-3 px-3 py-2.5 transition-all duration-200 group relative">
          
          <!-- Icon -->
          <span class="flex-shrink-0 w-5 h-5 flex items-center justify-center">
            <i *ngIf="item.icon === 'dashboard'" class="pi pi-home w-5 h-5"></i>
            <i *ngIf="item.icon === 'properties'" class="pi pi-building w-5 h-5"></i>
            <i *ngIf="item.icon === 'tenants'" class="pi pi-users w-5 h-5"></i>
            <i *ngIf="item.icon === 'map'" class="pi pi-map w-5 h-5"></i>
            <i *ngIf="item.icon === 'financial'" class="pi pi-dollar w-5 h-5"></i>
            <i *ngIf="item.icon === 'work-orders'" class="pi pi-check-square w-5 h-5"></i>
            <i *ngIf="item.icon === 'reports'" class="pi pi-file w-5 h-5"></i>
            <i *ngIf="item.icon === 'notifications'" class="pi pi-bell w-5 h-5"></i>
          </span>

          <!-- Label -->
          <span *ngIf="!isCollapsed()" class="text-sm font-medium truncate">{{ item.label }}</span>

          <!-- Badge -->
          <span 
            *ngIf="item.badge && (unreadCount$ | async) as count"
            [ngClass]="{'hidden': isCollapsed()}"
            class="ml-auto flex-shrink-0 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200">
            {{ count }}
          </span>

          <!-- Tooltip for collapsed state -->
          <div *ngIf="isCollapsed()" class="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {{ item.label }}
          </div>
        </a>
      </nav>

      <!-- Footer with Theme Toggle -->
      <div class="flex-shrink-0 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hidden md:block">
        <button 
          (click)="toggleDarkMode()"
          [ngClass]="{
            'bg-blue-50 dark:bg-gray-800 text-blue-600 dark:text-blue-400': isDarkMode(),
            'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800': !isDarkMode()
          }"
          class="w-full flex items-center gap-3 px-3 py-2.5 transition-all duration-200">
          <i *ngIf="!isDarkMode()" class="pi pi-sun w-5 h-5"></i>
          <i *ngIf="isDarkMode()" class="pi pi-moon w-5 h-5"></i>
          <span *ngIf="!isCollapsed()" class="text-sm font-medium">{{ isDarkMode() ? 'Light' : 'Dark' }}</span>
        </button>
      </div>
    </aside>
  `
})
export class SidebarComponent {
  private store = inject(Store);
  private sidebarService = inject(SidebarService);

  isCollapsed = this.sidebarService.isSidebarCollapsed;
  isDarkMode = signal<boolean>(this.getInitialDarkMode());
  isMobileSidebarOpen = this.sidebarService.isMobileSidebarOpen;
  unreadCount$ = this.store.select(selectUnreadCount);

  navItems: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
    { label: 'Properties', route: '/properties', icon: 'properties' },
    { label: 'Tenants', route: '/tenants', icon: 'tenants' },
    { label: 'Map', route: '/map', icon: 'map' },
    { label: 'Financial', route: '/financial-analytics', icon: 'financial' },
    { label: 'Work Orders', route: '/work-orders', icon: 'work-orders' },
    { label: 'Reports', route: '/reporting', icon: 'reports' },
    { label: 'Notifications', route: '/notifications', icon: 'notifications', badge: true }
  ];

  constructor() {
    // Apply dark mode on initialization
    effect(() => {
      if (this.isDarkMode()) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    });
  }

  closeMobileSidebar(): void {
    this.sidebarService.closeMobileSidebar();
  }

  toggleDarkMode(): void {
    this.isDarkMode.update(v => !v);
  }

  isActive(route: string): boolean {
    // This would be better with router state, but for now we'll use a simple check
    return false;
  }

  private getInitialDarkMode(): boolean {
    const saved = localStorage.getItem('theme');
    if (saved) {
      return saved === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
}

