import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { LoginDto } from '../../../models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginDto: LoginDto = { userName: '', password: '' };
  errorMessage = '';
  isLoading = false;
  showPassword = false;

  constructor(private authService: AuthService, private router: Router) {
    // Nếu đã login → redirect home
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.isLoading = true;

    this.authService.login(this.loginDto).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 0) {
          this.errorMessage = 'Unable to connect to the server. Please check your network connection.';
        } else if (err.status === 401) {
          this.errorMessage = err.error?.message || 'Invalid username or password.';
        } else {
          this.errorMessage = err.error?.message || 'Login failed. Please try again.';
        }
      }
    });
  }
}
