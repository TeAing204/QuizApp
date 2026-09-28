import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { QuestionService } from '../../../../services/question.service';
import { QuestionViewModel, QuestionCreateDto, AnswerCreateDto, AnswerViewModel } from '../../../../models/question.model';
import { ConfirmService } from '../../../../services/confirm.service';
import { ToastService } from '../../../../services/toast.service';

interface AnswerInput {
  content: string;
  isCorrect: boolean;
}

@Component({
  selector: 'app-admin-question-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, PaginationComponent],
  templateUrl: './question-list.component.html'
})
export class AdminQuestionListComponent implements OnInit {
  questions: QuestionViewModel[] = [];
  searchTerm = '';
  isLoading = true;

  // Pagination (server-side)
  currentPage = 1;
  pageSize = 10;
  totalElements = 0;

  // Sorting
  sortBy = 'createdAt';
  sortOrder = 'desc';

  // Answers display per question (lazy loaded)
  questionAnswers: Map<string, AnswerViewModel[]> = new Map();
  expandedQuestionId: string | null = null;
  loadingAnswers: Set<string> = new Set();

  // Modal state
  showModal = false;
  isSubmitting = false;
  modalError = '';
  modalStep: 'question' | 'answers' = 'question';
  questionTypes = ['SingleChoice', 'MultipleChoice', 'TrueFalse'];

  newQuestion: QuestionCreateDto = { content: '', questionType: 'SingleChoice', isActive: true };

  // Answers builder (for after question is created)
  createdQuestionId = '';
  answerInputs: AnswerInput[] = [];
  newAnswerContent = '';

  constructor(
    private questionService: QuestionService,
    private route: ActivatedRoute,
    private router: Router,
    private confirmService: ConfirmService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['search'] || '';
      this.currentPage = params['page'] ? +params['page'] : 1;
      this.pageSize = params['pageSize'] ? +params['pageSize'] : 10;
      this.sortBy = params['sortBy'] || 'createdAt';
      this.sortOrder = params['sortOrder'] || 'desc';
      this.loadQuestions();
    });
  }

  loadQuestions(): void {
    this.isLoading = true;
    this.questionService.getAll({
      search: this.searchTerm || undefined,
      pageNumber: this.currentPage,
      pageSize: this.pageSize,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder
    }).subscribe({
      next: (res) => {
        this.questions = res.content;
        this.totalElements = res.totalElements;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  private updateUrl(): void {
    const queryParams: any = {};
    if (this.searchTerm) queryParams.search = this.searchTerm;
    if (this.currentPage > 1) queryParams.page = this.currentPage;
    if (this.pageSize !== 10) queryParams.pageSize = this.pageSize;
    if (this.sortBy !== 'createdAt') queryParams.sortBy = this.sortBy;
    if (this.sortOrder !== 'desc') queryParams.sortOrder = this.sortOrder;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      replaceUrl: true
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.updateUrl();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updateUrl();
  }

  onSort(field: string): void {
    if (this.sortBy === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortOrder = 'asc';
    }
    this.currentPage = 1;
    this.updateUrl();
  }

  async deleteQuestion(id: string, content: string): Promise<void> {
    const short = content.length > 50 ? content.substring(0, 50) + '...' : content;
    const ok = await this.confirmService.confirm({
      title: 'Delete Question',
      message: `Are you sure you want to delete "${short}"? This action cannot be undone.`,
      confirmText: 'Delete',
      type: 'danger'
    });
    if (!ok) return;
    this.questionService.delete(id).subscribe({
      next: () => { this.toastService.success('Question deleted successfully!'); this.loadQuestions(); },
      error: (err) => this.toastService.error(err.error?.message || 'Failed to delete question.')
    });
  }

  // -- Expand/Collapse answers --
  toggleAnswers(questionId: string): void {
    if (this.expandedQuestionId === questionId) {
      this.expandedQuestionId = null;
      return;
    }
    this.expandedQuestionId = questionId;
    if (!this.questionAnswers.has(questionId)) {
      this.loadAnswers(questionId);
    }
  }

  loadAnswers(questionId: string): void {
    this.loadingAnswers.add(questionId);
    this.questionService.getAnswers(questionId).subscribe({
      next: (answers) => {
        this.questionAnswers.set(questionId, answers);
        this.loadingAnswers.delete(questionId);
      },
      error: () => this.loadingAnswers.delete(questionId)
    });
  }

  getQuestionAnswers(questionId: string): AnswerViewModel[] {
    return this.questionAnswers.get(questionId) || [];
  }

  // -- Modal Step 1: Create Question --
  openModal(): void {
    this.showModal = true;
    this.modalError = '';
    this.modalStep = 'question';
    this.newQuestion = { content: '', questionType: 'SingleChoice', isActive: true };
    this.answerInputs = [];
    this.newAnswerContent = '';
    this.createdQuestionId = '';
  }

  closeModal(): void { this.showModal = false; }

  createQuestion(): void {
    if (!this.newQuestion.content.trim()) { this.modalError = 'Question content is required.'; return; }
    this.isSubmitting = true;
    this.modalError = '';
    this.questionService.create(this.newQuestion).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        if (res && typeof res === 'object' && res.id) {
          this.createdQuestionId = res.id;
        }
        this.modalStep = 'answers';
        this.toastService.success('Question created! Now add answers.');
      },
      error: (err) => { this.isSubmitting = false; this.modalError = err.error?.message || 'Failed to create question.'; }
    });
  }

  // -- Modal Step 2: Add Answers to Created Question --
  addAnswerInput(): void {
    if (!this.newAnswerContent.trim()) return;
    this.answerInputs.push({ content: this.newAnswerContent.trim(), isCorrect: false });
    this.newAnswerContent = '';
  }

  removeAnswerInput(index: number): void { this.answerInputs.splice(index, 1); }

  toggleAnswerCorrect(index: number): void {
    this.answerInputs[index].isCorrect = !this.answerInputs[index].isCorrect;
  }

  saveAnswers(): void {
    if (this.answerInputs.length < 2) { this.modalError = 'At least 2 answers are required.'; return; }
    if (!this.answerInputs.some(a => a.isCorrect)) { this.modalError = 'Mark at least 1 correct answer.'; return; }

    this.isSubmitting = true;
    this.modalError = '';
    let completed = 0;
    const total = this.answerInputs.length;

    this.answerInputs.forEach(a => {
      const dto: AnswerCreateDto = {
        content: a.content,
        isCorrect: a.isCorrect,
        isActive: true,
        questionId: this.createdQuestionId
      };
      this.questionService.addAnswer(this.createdQuestionId, dto).subscribe({
        next: () => { completed++; if (completed === total) { this.isSubmitting = false; this.closeModal(); this.loadQuestions(); } },
        error: () => { completed++; if (completed === total) { this.isSubmitting = false; this.modalError = 'Failed to create some answers.'; } }
      });
    });
  }
}
