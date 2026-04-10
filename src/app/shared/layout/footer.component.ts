import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="bg-gray-900 text-gray-300 py-8 mt-12">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <!-- Company Info -->
          <div>
            <h3 class="text-white font-semibold mb-4">Real Estate Platform</h3>
            <p class="text-sm">Comprehensive property management and analytics platform.</p>
          </div>

          <!-- Quick Links -->
          <div>
            <h4 class="text-white font-semibold mb-4">Quick Links</h4>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="hover:text-white">Dashboard</a></li>
              <li><a href="#" class="hover:text-white">Properties</a></li>
              <li><a href="#" class="hover:text-white">Tenants</a></li>
              <li><a href="#" class="hover:text-white">Reports</a></li>
            </ul>
          </div>

          <!-- Support -->
          <div>
            <h4 class="text-white font-semibold mb-4">Support</h4>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="hover:text-white">Help Center</a></li>
              <li><a href="#" class="hover:text-white">Documentation</a></li>
              <li><a href="#" class="hover:text-white">Contact Us</a></li>
              <li><a href="#" class="hover:text-white">FAQ</a></li>
            </ul>
          </div>

          <!-- Legal -->
          <div>
            <h4 class="text-white font-semibold mb-4">Legal</h4>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" class="hover:text-white">Terms of Service</a></li>
              <li><a href="#" class="hover:text-white">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        <!-- Bottom Section -->
        <div class="border-t border-gray-700 pt-8 flex justify-between items-center">
          <p class="text-sm">&copy; 2024 Real Estate Analytics Platform. All rights reserved.</p>
          <div class="flex gap-4">
            <a href="#" class="text-gray-400 hover:text-white">Twitter</a>
            <a href="#" class="text-gray-400 hover:text-white">LinkedIn</a>
            <a href="#" class="text-gray-400 hover:text-white">Facebook</a>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {}
