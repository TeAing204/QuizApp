import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from '../../../services/quiz.service';
import { AuthService } from '../../../services/auth.service';
import { QuizPrepareInfoDto } from '../../../models/quiz.model';

@Component({
  selector: 'app-quiz-prepare',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz-prepare.component.html'
})
export class QuizPrepareComponent implements OnInit {
  info: QuizPrepareInfoDto | null = null;
  quizId = '';
  isLoading = true;
  isStarting = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quizService: QuizService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.quizId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.quizId) { this.router.navigate(['/']); return; }
    this.prepare();
  }

  prepare(): void {
    const user = this.authService.getCurrentUser();
    if (!user) { this.router.navigate(['/auth/login']); return; }

    this.quizService.prepareQuiz({ userId: user.id, quizId: this.quizId }).subscribe({
      next: (info) => { this.info = info; this.isLoading = false; },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to load quiz details.';
        this.isLoading = false;
      }
    });
  }

  startQuiz(): void {
    const user = this.authService.getCurrentUser();
    if (!user || !this.info) return;
    this.isStarting = true;

    this.quizService.takeQuiz({ userId: user.id, quizId: this.quizId }).subscribe({
      next: (quiz) => {
        // Save quiz data in sessionStorage to use on Take page
        sessionStorage.setItem('active_quiz', JSON.stringify(quiz));
        this.router.navigate(['/quiz', this.quizId, 'take']);
      },
      error: (err) => {
        this.isStarting = false;
        this.errorMessage = err.error?.message || 'Failed to start quiz.';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
