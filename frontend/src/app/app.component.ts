import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
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

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.authService.authStatus().subscribe((status) => {
      this.isLoggedIn = status;
    });
  }
}
