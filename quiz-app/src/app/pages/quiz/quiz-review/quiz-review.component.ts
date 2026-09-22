import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { QuizService } from '../../../services/quiz.service';
import { AttemptDetailDto } from '../../../models/quiz.model';

@Component({
  selector: 'app-quiz-review',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './quiz-review.component.html'
})
export class QuizReviewComponent implements OnInit {
  attemptId = '';
  detail: AttemptDetailDto | null = null;
  isLoading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quizService: QuizService
  ) {}

  ngOnInit(): void {
    this.attemptId = this.route.snapshot.paramMap.get('attemptId') || '';
    if (!this.attemptId) {
      this.router.navigate(['/quiz/history']);
      return;
    }
    this.loadDetail();
  }

  loadDetail(): void {
    this.quizService.getAttemptDetail(this.attemptId).subscribe({
      next: (data) => {
        this.detail = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Không thể tải chi tiết bài làm.';
        this.isLoading = false;
      }
    });
  }

  get scorePercent(): number {
    return this.detail?.score ?? 0;
  }

  get gradeLabel(): string {
    const s = this.scorePercent;
    if (s >= 90) return 'Xuất sắc';
    if (s >= 75) return 'Tốt';
    if (s >= 50) return 'Trung bình';
    return 'Cần cố gắng thêm';
  }

  get gradeBg(): string {
    const s = this.scorePercent;
    if (s >= 90) return 'from-emerald-500 to-green-600';
    if (s >= 75) return 'from-blue-500 to-indigo-600';
    if (s >= 50) return 'from-amber-400 to-orange-500';
    return 'from-red-400 to-rose-600';
  }

  get circleOffset(): number {
    const circumference = 2 * Math.PI * 54;
    return circumference - (this.scorePercent / 100) * circumference;
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  getTimeDuration(): string {
    if (!this.detail || !this.detail.submittedAt) return '--';
    const start = new Date(this.detail.startTime);
    const end = new Date(this.detail.submittedAt);
    const diffMs = end.getTime() - start.getTime();
    const mins = Math.floor(diffMs / 60000);
    const secs = Math.floor((diffMs % 60000) / 1000);
    if (mins > 0) return `${mins} phút ${secs} giây`;
    return `${secs} giây`;
  }

  getAnswerClasses(answer: { isCorrect: boolean; isSelected: boolean }): string {
    if (answer.isSelected && answer.isCorrect) {
      return 'bg-green-50 border-green-300 text-green-800';
    }
    if (answer.isSelected && !answer.isCorrect) {
      return 'bg-red-50 border-red-300 text-red-800';
    }
    if (!answer.isSelected && answer.isCorrect) {
      return 'bg-emerald-50 border-emerald-200 border-dashed text-emerald-700';
    }
    return 'bg-gray-50 border-gray-200 text-gray-600';
  }

  getIndicatorClasses(answer: { isCorrect: boolean; isSelected: boolean }): string {
    if (answer.isSelected && answer.isCorrect) {
      return 'border-green-500 bg-green-500 text-white';
    }
    if (answer.isSelected && !answer.isCorrect) {
      return 'border-red-500 bg-red-500 text-white';
    }
    if (!answer.isSelected && answer.isCorrect) {
      return 'border-emerald-400 bg-emerald-100 text-emerald-600';
    }
    return 'border-gray-300 bg-white';
  }
}
