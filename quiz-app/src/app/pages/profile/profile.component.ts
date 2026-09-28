import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { UserViewModel } from '../../models/auth.model';
import { QuizService } from '../../services/quiz.service';
import { QuizHistoryDto } from '../../models/quiz.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  activeTab: 'info' | 'password' | 'history' = 'info';
  user: UserViewModel | null = null;

  // Password change
  oldPassword = '';
  newPassword = '';
  confirmPassword = '';
  isChangingPassword = false;
  passwordError = '';
  passwordSuccess = '';

  // History
  historyItems: QuizHistoryDto[] = [];
  isLoadingHistory = false;
  historyLoaded = false;

  // Stats
  totalAttempts = 0;
  averageScore = 0;
  bestScore = 0;

  constructor(
    private authService: AuthService,
    private quizService: QuizService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
  }

  switchTab(tab: 'info' | 'password' | 'history'): void {
    this.activeTab = tab;
    if (tab === 'history' && !this.historyLoaded) {
      this.loadHistory();
    }
  }

  // ===== Change Password =====
  changePassword(): void {
    this.passwordError = '';
    this.passwordSuccess = '';

    if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
      this.passwordError = 'Please fill in all fields.';
      return;
    }
    if (this.newPassword.length < 6) {
      this.passwordError = 'New password must be at least 6 characters.';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.passwordError = 'Password confirmation does not match.';
      return;
    }

    this.isChangingPassword = true;
    const url = `${environment.apiUrl}/users/${this.user?.id}/change-password`;
    this.http.post(url, {
      oldPassword: this.oldPassword,
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword
    }).subscribe({
      next: () => {
        this.isChangingPassword = false;
        this.passwordSuccess = 'Password changed successfully!';
        this.oldPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
        setTimeout(() => this.passwordSuccess = '', 4000);
      },
      error: (err) => {
        this.isChangingPassword = false;
        this.passwordError = err.error?.message || 'Failed to change password.';
      }
    });
  }

  // ===== History =====
  loadHistory(): void {
    if (!this.user) return;
    this.isLoadingHistory = true;
    this.quizService.getHistory(this.user.id).subscribe({
      next: (data) => {
        this.historyItems = data;
        this.historyLoaded = true;
        this.isLoadingHistory = false;
        this.calculateStats(data);
      },
      error: () => this.isLoadingHistory = false
    });
  }

  calculateStats(items: QuizHistoryDto[]): void {
    this.totalAttempts = items.length;
    const completed = items.filter(i => i.status === 'Completed' && i.score != null);
    if (completed.length > 0) {
      this.averageScore = Math.round(completed.reduce((s, i) => s + (i.score || 0), 0) / completed.length * 10) / 10;
      this.bestScore = Math.max(...completed.map(i => i.score || 0));
    }
  }

  getScoreColor(score: number | undefined): string {
    if (score == null) return 'text-gray-400';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }
}
