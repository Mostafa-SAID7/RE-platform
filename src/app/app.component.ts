import { Component, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './shared/layout/header.component';
import { SidebarComponent } from './shared/layout/sidebar.component';
import { FooterComponent } from './shared/layout/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HeaderComponent, SidebarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'real-estate-platform';
  private router = inject(Router);

  get isAuthPage(): boolean {
    return this.router.url.includes('/auth');
  }
}
