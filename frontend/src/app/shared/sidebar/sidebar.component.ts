import { UserMenuComponent } from './user-menu/user-menu.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  imports: [UserMenuComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {}
