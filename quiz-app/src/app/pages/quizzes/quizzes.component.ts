import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { QuizService } from '../../services/quiz.service';
import { AuthService } from '../../services/auth.service';
import { QuizViewModel } from '../../models/quiz.model';
import { QuizCardComponent } from '../../shared/components/quiz-card/quiz-card.component';
import { DurationFormatPipe } from '../../shared/pipes/duration-format.pipe';

@Component({
  selector: 'app-quizzes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, QuizCardComponent, DurationFormatPipe],
  templateUrl: './quizzes.component.html'
})
export class QuizzesComponent implements OnInit {
  quizzes: QuizViewModel[] = [];
  filteredQuizzes: QuizViewModel[] = [];
  searchTerm = '';
  quizCode = '';
  isLoading = true;
  codeError = '';

  constructor(
    private quizService: QuizService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.quizService.getAll().subscribe({
      next: (data) => {
        this.quizzes = data.filter(q => q.isActive);
        this.filteredQuizzes = this.quizzes;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  onSearch(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredQuizzes = this.quizzes.filter(q =>
      q.title.toLowerCase().includes(term) || q.description.toLowerCase().includes(term)
    );
  }

  startQuiz(quizId: string): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.router.navigate(['/quiz', quizId, 'prepare']);
  }

  joinByCode(): void {
    if (!this.quizCode.trim()) {
      this.codeError = 'Vui lòng nhập mã đề thi.';
      return;
    }
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.codeError = '';

    // Tìm quiz có quizCode khớp — sử dụng prepareQuiz với quizCode
    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.quizService.prepareQuiz({
      userId: user.id,
      quizId: '',
      quizCode: this.quizCode.trim()
    }).subscribe({
      next: (info) => {
        this.router.navigate(['/quiz', info.id, 'prepare'], {
          queryParams: { code: this.quizCode.trim() }
        });
      },
      error: (err) => {
        this.codeError = err.error?.message || 'Mã đề thi không hợp lệ hoặc không tồn tại.';
      }
    });
  }
}
