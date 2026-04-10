import { Component, ChangeDetectionStrategy, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm dark:shadow-lg transition-colors duration-200 h-16">
      <div class="h-full px-4 md:px-6 py-4 flex justify-between items-center gap-4">
        <!-- Left Section: Logo, Brand, and Collapse Icon -->
        <div class="flex items-center gap-3">
          <!-- Mobile Menu Toggle -->
          <button 
            (click)="toggleMobileSidebar()"
            class="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
            [title]="'Toggle Menu'">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>

          <!-- Logo and Brand (Desktop) -->
          <div class="hidden md:flex items-center gap-2">
            <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
              <span class="text-white font-bold text-sm">RE</span>
            </div>
            <span class="text-sm font-bold text-gray-900 dark:text-white">Estate</span>
          </div>

          <!-- Collapse Icon (Desktop) -->
          <button 
            (click)="toggleSidebar()" 
            class="hidden md:block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
            [title]="isSidebarCollapsed() ? 'Expand' : 'Collapse'">
            <svg *ngIf="!isSidebarCollapsed()" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            <svg *ngIf="isSidebarCollapsed()" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>

        <!-- Center Section: Search (hidden on mobile) -->
        <div class="hidden md:flex flex-1 max-w-md">
          <div class="relative w-full">
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input 
              type="text" 
              placeholder="Search..." 
              class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors text-sm">
          </div>
        </div>

        <!-- Right Section -->
        <div class="flex items-center gap-2 md:gap-6 ml-auto">
          <!-- Language Selector (hidden on mobile) -->
          <select 
            (change)="changeLanguage($event)" 
            class="hidden md:block px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-medium hover:border-gray-400 dark:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors cursor-pointer">
            <option value="en">English</option>
            <option value="ar">العربية</option>
          </select>

          <!-- Dark Mode Toggle -->
          <button 
            (click)="toggleDarkMode()"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
            [title]="isDarkMode() ? 'Light Mode' : 'Dark Mode'">
            <svg *ngIf="!isDarkMode()" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1m-16 0H1m15.364 1.636l.707.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
            <svg *ngIf="isDarkMode()" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 108.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
            </svg>
          </button>

          <!-- Notifications Icon -->
          <button class="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
            </svg>
            <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <!-- User Profile Dropdown -->
          <div class="relative">
            <button 
              (click)="toggleProfileMenu()" 
              class="flex items-center gap-2 md:gap-3 px-2 md:px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
                {{ userInitial() }}
              </div>
              <div class="hidden md:block text-left">
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ userName() }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Admin</p>
              </div>
              <svg class="hidden md:block w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
              </svg>
            </button>

            <!-- Profile Dropdown Menu -->
            <div 
              *ngIf="showProfileMenu()" 
              class="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              
              <!-- User Info -->
              <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ userName() }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">admin&#64;realestate.com</p>
              </div>

              <!-- Menu Items -->
              <a href="/profile" class="flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <span class="text-sm">Profile</span>
              </a>
              <a href="/settings" class="flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span class="text-sm">Settings</span>
              </a>

              <!-- Divider -->
              <div class="border-t border-gray-200 dark:border-gray-700"></div>

              <!-- Logout -->
              <button 
                (click)="logout()" 
                class="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                <span class="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private sidebarService = inject(SidebarService);

  showProfileMenu = signal<boolean>(false);
  isDarkMode = signal<boolean>(this.getInitialDarkMode());
  isSidebarCollapsed = signal<boolean>(false);
  userName = signal<string>('John Doe');
  userInitial = signal<string>('JD');

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

    // Close menu when clicking outside
    effect(() => {
      if (this.showProfileMenu()) {
        const handleClickOutside = (e: MouseEvent) => {
          const target = e.target as HTMLElement;
          if (!target.closest('[role="button"]') && !target.closest('.relative')) {
            this.showProfileMenu.set(false);
          }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
          document.removeEventListener('click', handleClickOutside);
        };
      }
      return undefined;
    });
  }

  toggleProfileMenu(): void {
    this.showProfileMenu.update(v => !v);
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed.update(v => !v);
    this.sidebarService.toggleSidebarCollapse(this.isSidebarCollapsed());
  }

  toggleMobileSidebar(): void {
    this.sidebarService.toggleMobileSidebar();
  }

  toggleDarkMode(): void {
    this.isDarkMode.update(v => !v);
  }

  changeLanguage(event: Event): void {
    const language = (event.target as HTMLSelectElement).value;
    localStorage.setItem('language', language);
    window.location.reload();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  private getInitialDarkMode(): boolean {
    const saved = localStorage.getItem('theme');
    if (saved) {
      return saved === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
}

