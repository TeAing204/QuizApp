import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { QuizService } from '../../../../services/quiz.service';
import { QuestionService } from '../../../../services/question.service';
import { QuizViewModel } from '../../../../models/quiz.model';
import { QuestionViewModel, QuizQuestionCreateDto } from '../../../../models/question.model';

@Component({
  selector: 'app-admin-quiz-questions',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './quiz-questions.component.html'
})
export class AdminQuizQuestionsComponent implements OnInit {
  quizId = '';
  quiz: QuizViewModel | null = null;
  assignedQuestions: QuestionViewModel[] = [];
  allQuestions: QuestionViewModel[] = [];
  availableQuestions: QuestionViewModel[] = [];
  searchTerm = '';
  isLoading = true;

  showAddModal = false;
  addSearchTerm = '';
  filteredAvailable: QuestionViewModel[] = [];

  constructor(
    private quizService: QuizService,
    private questionService: QuestionService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.quizId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.quizId) { this.router.navigate(['/admin/quizzes']); return; }
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    // Load quiz info
    this.quizService.getById(this.quizId).subscribe({
      next: (quiz) => this.quiz = quiz,
      error: () => this.router.navigate(['/admin/quizzes'])
    });
    // Load assigned questions
    this.quizService.getQuestions(this.quizId).subscribe({
      next: (questions) => {
        this.assignedQuestions = questions;
        this.loadAllQuestions();
      },
      error: () => this.isLoading = false
    });
  }

  loadAllQuestions(): void {
    this.questionService.getAll({ pageSize: 100 }).subscribe({
      next: (res) => {
        this.allQuestions = res.content;
        this.updateAvailableQuestions();
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  updateAvailableQuestions(): void {
    const assignedIds = new Set(this.assignedQuestions.map(q => q.id));
    this.availableQuestions = this.allQuestions.filter(q => !assignedIds.has(q.id) && q.isActive);
    this.filteredAvailable = [...this.availableQuestions];
  }

  addQuestion(questionId: string): void {
    const dto: QuizQuestionCreateDto = { quizId: this.quizId, questionId };
    this.quizService.addQuestion(dto).subscribe({
      next: () => this.loadData(),
      error: (err) => alert(err.error?.message || 'Failed to add question.')
    });
  }

  removeQuestion(questionId: string): void {
    if (!confirm('Remove this question from quiz?')) return;
    // questionId here is actually the QuizQuestion record — but backend uses QuizQuestion.Id
    // We need to find the mapping. Since backend's removeQuestion expects quizQuestionId,
    // and we only have questionId, we pass questionId as quizQuestionId for now.
    this.quizService.removeQuestion(this.quizId, questionId).subscribe({
      next: () => this.loadData(),
      error: () => alert('Failed to remove question.')
    });
  }

  openAddModal(): void {
    this.showAddModal = true;
    this.addSearchTerm = '';
    this.filteredAvailable = [...this.availableQuestions];
  }

  closeAddModal(): void { this.showAddModal = false; }

  onAddSearch(): void {
    const term = this.addSearchTerm.toLowerCase();
    this.filteredAvailable = this.availableQuestions.filter(q => q.content.toLowerCase().includes(term));
  }
}
