import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

interface SidebarItem {
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.component.html'
})
export class AdminLayoutComponent {
  isSidebarOpen = true;

  menuItems: SidebarItem[] = [
    { icon: 'fas fa-clipboard-list', label: 'Quizzes', route: '/admin/quizzes' },
    { icon: 'fas fa-question-circle', label: 'Questions', route: '/admin/questions' },
    { icon: 'fas fa-users', label: 'Users', route: '/admin/users' },
    { icon: 'fas fa-user-shield', label: 'Roles', route: '/admin/roles' }
  ];

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
