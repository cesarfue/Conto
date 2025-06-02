import { Component, OnInit } from '@angular/core';
import { AuthService } from './features/auth/services/auth.service';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet, SidebarComponent],
})
export class AppComponent implements OnInit {
  title = '**';
  isLoggedIn = false;
  hasOrganization = false;
  showSidebar = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();

    this.authService.authStatus().subscribe((status) => {
      this.isLoggedIn = status;
      this.checkSidebarVisibility();
    });

    if (this.isLoggedIn) {
      this.checkOrganizationStatus();
    }
  }

  private checkOrganizationStatus() {
    this.authService.getUserStatus().subscribe({
      next: (status) => {
        this.hasOrganization = status.hasOrganization;
        this.checkSidebarVisibility();
      },
      error: (error) => {
        console.error('Failed to load user status:', error);
        this.hasOrganization = false;
        this.checkSidebarVisibility();
      },
    });
  }

  private checkSidebarVisibility() {
    this.showSidebar = this.isLoggedIn && this.hasOrganization;
  }
}
