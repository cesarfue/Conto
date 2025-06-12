import { RouterModule } from '@angular/router';
import { UserMenuComponent } from '../user-menu/user-menu.component';
import { Component, inject, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  imports: [UserMenuComponent, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  isResizing = false;
  startX = 0;
  sidebarWidth = 250;

  private renderer = inject(Renderer2);

  ngOnInit() {
    this.renderer.setStyle(
      document.documentElement,
      '--sidebar-width',
      `${this.sidebarWidth}px`,
    );
  }

  startResize(event: MouseEvent) {
    this.isResizing = true;
    this.startX = event.clientX;

    console.log('startResize()');
    document.addEventListener('mousemove', this.onMouseMove.bind(this));
    document.addEventListener('mouseup', this.stopResize.bind(this));

    event.preventDefault();
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isResizing) return;

    const deltaX = event.clientX - this.startX;
    const newWidth = this.sidebarWidth + deltaX;
    const constrainedWidth = Math.max(200, Math.min(400, newWidth));

    console.log(constrainedWidth);
    this.renderer.setStyle(
      document.documentElement,
      '--sidebar-width',
      `${constrainedWidth}px`,
    );
  }

  stopResize() {
    if (!this.isResizing) return;
    console.log('stopResize()');
    this.isResizing = false;
    document.removeEventListener('mousemove', this.onMouseMove.bind(this));
    document.removeEventListener('mouseup', this.stopResize.bind(this));

    const currentWidth = getComputedStyle(
      document.documentElement,
    ).getPropertyValue('--sidebar-width');
    console.log('stopping with currentWidth set as ', currentWidth);
    this.sidebarWidth = parseInt(currentWidth) || 250;
  }

  log() {
    console.log('hey');
  }
}
