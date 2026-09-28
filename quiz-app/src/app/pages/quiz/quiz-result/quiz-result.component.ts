import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { QuizResultDto } from '../../../models/quiz.model';

@Component({
  selector: 'app-quiz-result',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './quiz-result.component.html'
})
export class QuizResultComponent implements OnInit {
  result: QuizResultDto | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const stored = sessionStorage.getItem('quiz_result');
    if (!stored) { this.router.navigate(['/']); return; }
    this.result = JSON.parse(stored) as QuizResultDto;
  }

  get scorePercent(): number {
    return this.result?.score ?? 0;
  }

  get gradeLabel(): string {
    const s = this.scorePercent;
    if (s >= 90) return 'Excellent';
    if (s >= 75) return 'Good';
    if (s >= 50) return 'Average';
    return 'Needs Improvement';
  }

  get gradeColor(): string {
    const s = this.scorePercent;
    if (s >= 90) return 'text-emerald-600';
    if (s >= 75) return 'text-blue-600';
    if (s >= 50) return 'text-amber-600';
    return 'text-red-600';
  }

  get gradeBg(): string {
    const s = this.scorePercent;
    if (s >= 90) return 'from-emerald-500 to-green-600';
    if (s >= 75) return 'from-blue-500 to-indigo-600';
    if (s >= 50) return 'from-amber-400 to-orange-500';
    return 'from-red-400 to-rose-600';
  }

  get gradeIcon(): string {
    const s = this.scorePercent;
    if (s >= 90) return 'fas fa-trophy';
    if (s >= 75) return 'fas fa-star';
    if (s >= 50) return 'fas fa-check-circle';
    return 'fas fa-redo';
  }

  get circleOffset(): number {
    const circumference = 2 * Math.PI * 54;
    return circumference - (this.scorePercent / 100) * circumference;
  }

  retakeQuiz(): void {
    sessionStorage.removeItem('quiz_result');
    if (this.result) {
      this.router.navigate(['/quiz', this.result.quizId, 'prepare']);
    }
  }

  goHome(): void {
    sessionStorage.removeItem('quiz_result');
    this.router.navigate(['/']);
  }
}
