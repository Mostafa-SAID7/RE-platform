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
            <i class="pi pi-bars w-6 h-6"></i>
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
            <i *ngIf="!isSidebarCollapsed()" class="pi pi-chevron-left w-5 h-5"></i>
            <i *ngIf="isSidebarCollapsed()" class="pi pi-chevron-right w-5 h-5"></i>
          </button>
        </div>

        <!-- Center Section: Search (hidden on mobile) -->
        <div class="hidden md:flex flex-1 max-w-md">
          <div class="relative w-full">
            <i class="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"></i>
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
            <i *ngIf="!isDarkMode()" class="pi pi-sun w-5 h-5"></i>
            <i *ngIf="isDarkMode()" class="pi pi-moon w-5 h-5"></i>
          </button>

          <!-- Notifications Icon -->
          <button class="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <i class="pi pi-bell w-5 h-5"></i>
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
              <i class="hidden md:block pi pi-chevron-down w-4 h-4 text-gray-600 dark:text-gray-400"></i>
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
                <i class="pi pi-user w-4 h-4"></i>
                <span class="text-sm">Profile</span>
              </a>
              <a href="/settings" class="flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <i class="pi pi-cog w-4 h-4"></i>
                <span class="text-sm">Settings</span>
              </a>

              <!-- Divider -->
              <div class="border-t border-gray-200 dark:border-gray-700"></div>

              <!-- Logout -->
              <button 
                (click)="logout()" 
                class="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left">
                <i class="pi pi-sign-out w-4 h-4"></i>
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

