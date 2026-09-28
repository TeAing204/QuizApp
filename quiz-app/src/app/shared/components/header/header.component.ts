import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ConfirmService } from '../../../services/confirm.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  isMenuOpen = false;
  isDropdownOpen = false;

  constructor(
    public authService: AuthService,
    private router: Router,
    private confirmService: ConfirmService,
    private toastService: ToastService
  ) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  async logout() {
    const ok = await this.confirmService.confirm({
      title: 'Sign Out',
      message: 'Are you sure you want to sign out?',
      confirmText: 'Sign Out',
      cancelText: 'Cancel',
      type: 'warning'
    });
    if (!ok) return;

    this.authService.logout();
    this.isDropdownOpen = false;
    this.isMenuOpen = false;
    this.toastService.success('Signed out successfully!');
    this.router.navigate(['/']);
  }
}
