import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { QuizService } from '../../../services/quiz.service';
import { AuthService } from '../../../services/auth.service';
import { QuizHistoryDto } from '../../../models/quiz.model';

@Component({
  selector: 'app-quiz-history',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './quiz-history.component.html'
})
export class QuizHistoryComponent implements OnInit {
  historyItems: QuizHistoryDto[] = [];
  isLoading = true;
  errorMessage = '';

  // Stats
  totalAttempts = 0;
  averageScore = 0;
  bestScore = 0;
  completedCount = 0;

  constructor(
    private quizService: QuizService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.errorMessage = 'You must be logged in to view history.';
      this.isLoading = false;
      return;
    }

    this.quizService.getHistory(user.id).subscribe({
      next: (data) => {
        this.historyItems = data;
        this.calculateStats(data);
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to load quiz history.';
        this.isLoading = false;
      }
    });
  }

  calculateStats(items: QuizHistoryDto[]): void {
    this.totalAttempts = items.length;
    this.completedCount = items.filter(i => i.status === 'Completed').length;

    const completedItems = items.filter(i => i.score != null && i.status === 'Completed');
    if (completedItems.length > 0) {
      const totalScore = completedItems.reduce((sum, i) => sum + (i.score || 0), 0);
      this.averageScore = Math.round(totalScore / completedItems.length * 10) / 10;
      this.bestScore = Math.max(...completedItems.map(i => i.score || 0));
    }
  }

  getScoreColor(score: number | undefined): string {
    if (score == null) return 'text-gray-400';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-amber-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  }

  getScoreBgColor(score: number | undefined): string {
    if (score == null) return 'bg-gray-100';
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-amber-50 border-amber-200';
    if (score >= 40) return 'bg-orange-50 border-orange-200';
    return 'bg-red-50 border-red-200';
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  getTimeDuration(startStr: string, endStr?: string): string {
    const start = new Date(startStr);
    const end = endStr ? new Date(endStr) : new Date();
    const diffMs = end.getTime() - start.getTime();
    const mins = Math.floor(diffMs / 60000);
    const secs = Math.floor((diffMs % 60000) / 1000);
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  }
}
