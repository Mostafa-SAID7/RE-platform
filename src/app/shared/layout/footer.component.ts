import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="bg-gray-900 text-gray-300 py-4 mt-12">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center text-sm">
          <p>&copy; 2024 Real Estate Analytics Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {}
