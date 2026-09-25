import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { QuestionService } from '../../../../services/question.service';
import { QuestionViewModel, QuestionCreateDto, AnswerCreateDto, AnswerViewModel } from '../../../../models/question.model';

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

  constructor(private questionService: QuestionService) {}

  ngOnInit(): void { this.loadQuestions(); }

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

  onSearch(): void {
    this.currentPage = 1;
    this.loadQuestions();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadQuestions();
  }

  onSort(field: string): void {
    if (this.sortBy === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortOrder = 'asc';
    }
    this.currentPage = 1;
    this.loadQuestions();
  }

  deleteQuestion(id: string, content: string): void {
    const short = content.length > 50 ? content.substring(0, 50) + '...' : content;
    if (!confirm(`Delete "${short}"?`)) return;
    this.questionService.delete(id).subscribe({ next: () => this.loadQuestions() });
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
    if (!this.newQuestion.content.trim()) { this.modalError = 'Nội dung câu hỏi là bắt buộc.'; return; }
    this.isSubmitting = true;
    this.modalError = '';
    this.questionService.create(this.newQuestion).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        // Backend trả về object có id
        if (res && typeof res === 'object' && res.id) {
          this.createdQuestionId = res.id;
        }
        this.modalStep = 'answers';
      },
      error: (err) => { this.isSubmitting = false; this.modalError = err.error?.message || 'Tạo câu hỏi thất bại.'; }
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
    if (this.answerInputs.length < 2) { this.modalError = 'Cần ít nhất 2 đáp án.'; return; }
    if (!this.answerInputs.some(a => a.isCorrect)) { this.modalError = 'Đánh dấu ít nhất 1 đáp án đúng.'; return; }

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
        error: () => { completed++; if (completed === total) { this.isSubmitting = false; this.modalError = 'Một số đáp án không tạo được.'; } }
      });
    });
  }
}
