import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from '../../../services/quiz.service';
import { AuthService } from '../../../services/auth.service';
import { QuizForTestDto, QuizSubmissionDto } from '../../../models/quiz.model';
import { QuestionForTestDto, UserAnswerSubmissionDto } from '../../../models/question.model';

@Component({
  selector: 'app-quiz-take',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz-take.component.html'
})
export class QuizTakeComponent implements OnInit, OnDestroy {
  quiz: QuizForTestDto | null = null;
  quizId = '';
  currentIndex = 0;
  isSubmitting = false;
  errorMessage = '';

  // Map questionId -> selected answerId
  selectedAnswers: Map<string, string> = new Map();
  // Map questionId -> Set<answerId> for MultipleChoice
  selectedMultiple: Map<string, Set<string>> = new Map();

  // Timer
  timeLeft = 0;
  timerInterval: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quizService: QuizService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.quizId = this.route.snapshot.paramMap.get('id') || '';
    const stored = sessionStorage.getItem('active_quiz');
    if (!stored) { this.router.navigate(['/']); return; }

    this.quiz = JSON.parse(stored) as QuizForTestDto;
    this.timeLeft = this.quiz.duration * 60;
    this.startTimer();
  }

  ngOnDestroy(): void {
    clearInterval(this.timerInterval);
  }

  startTimer(): void {
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        clearInterval(this.timerInterval);
        this.submitQuiz();
      }
    }, 1000);
  }

  get currentQuestion(): QuestionForTestDto | null {
    return this.quiz?.questions[this.currentIndex] ?? null;
  }

  get totalQuestions(): number {
    return this.quiz?.questions.length ?? 0;
  }

  get progressPercent(): number {
    if (this.totalQuestions === 0) return 0;
    const answered = this.quiz!.questions.filter(q => this.isAnswered(q.id)).length;
    return Math.round((answered / this.totalQuestions) * 100);
  }

  get answeredCount(): number {
    return this.quiz?.questions.filter(q => this.isAnswered(q.id)).length ?? 0;
  }

  get timerDisplay(): string {
    const m = Math.floor(this.timeLeft / 60).toString().padStart(2, '0');
    const s = (this.timeLeft % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  get isTimerWarning(): boolean {
    return this.timeLeft <= 60;
  }

  isAnswered(questionId: string): boolean {
    const q = this.quiz?.questions.find(q => q.id === questionId);
    if (!q) return false;
    if (q.questionType === 'MultipleChoice') {
      return (this.selectedMultiple.get(questionId)?.size ?? 0) > 0;
    }
    return this.selectedAnswers.has(questionId);
  }

  selectSingle(questionId: string, answerId: string): void {
    this.selectedAnswers.set(questionId, answerId);
  }

  isSelectedSingle(questionId: string, answerId: string): boolean {
    return this.selectedAnswers.get(questionId) === answerId;
  }

  toggleMultiple(questionId: string, answerId: string): void {
    if (!this.selectedMultiple.has(questionId)) {
      this.selectedMultiple.set(questionId, new Set());
    }
    const set = this.selectedMultiple.get(questionId)!;
    set.has(answerId) ? set.delete(answerId) : set.add(answerId);
  }

  isSelectedMultiple(questionId: string, answerId: string): boolean {
    return this.selectedMultiple.get(questionId)?.has(answerId) ?? false;
  }

  goTo(index: number): void {
    if (index >= 0 && index < this.totalQuestions) this.currentIndex = index;
  }

  next(): void { this.goTo(this.currentIndex + 1); }
  prev(): void { this.goTo(this.currentIndex - 1); }

  submitQuiz(): void {
    if (this.isSubmitting) return;
    const user = this.authService.getCurrentUser();
    if (!user || !this.quiz) return;

    clearInterval(this.timerInterval);
    this.isSubmitting = true;

    const answers: UserAnswerSubmissionDto[] = [];
    this.quiz.questions.forEach(q => {
      if (q.questionType === 'MultipleChoice') {
        const selected = this.selectedMultiple.get(q.id);
        selected?.forEach(answerId => answers.push({ questionId: q.id, answerId }));
      } else {
        const answerId = this.selectedAnswers.get(q.id);
        if (answerId) answers.push({ questionId: q.id, answerId });
      }
    });

    const dto: QuizSubmissionDto = {
      quizId: this.quiz.id,
      userId: user.id,
      answers
    };

    this.quizService.submitQuiz(dto).subscribe({
      next: (result) => {
        sessionStorage.removeItem('active_quiz');
        sessionStorage.setItem('quiz_result', JSON.stringify(result));
        this.router.navigate(['/quiz', this.quizId, 'result']);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || 'Submission failed. Please try again.';
        this.startTimer(); // resume timer if submit fails
      }
    });
  }
}
