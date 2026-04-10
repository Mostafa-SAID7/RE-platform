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
            <svg *ngIf="item.icon === 'dashboard'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 11l4-4m0 0l4 4m-4-4v4"></path>
            </svg>
            <svg *ngIf="item.icon === 'properties'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 11l4-4m0 0l4 4m-4-4v4"></path>
            </svg>
            <svg *ngIf="item.icon === 'tenants'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 12H9m6 0a6 6 0 11-12 0 6 6 0 0112 0z"></path>
            </svg>
            <svg *ngIf="item.icon === 'map'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6.553 3.276A1 1 0 0121 20.382V9.618a1 1 0 00-1.447-.894L15 11m0 13V11m0 0L9 7"></path>
            </svg>
            <svg *ngIf="item.icon === 'financial'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <svg *ngIf="item.icon === 'work-orders'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <svg *ngIf="item.icon === 'reports'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <svg *ngIf="item.icon === 'notifications'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
            </svg>
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
          <svg *ngIf="!isDarkMode()" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1m-16 0H1m15.364 1.636l.707.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
          </svg>
          <svg *ngIf="isDarkMode()" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
          </svg>
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

