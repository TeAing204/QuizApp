import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { QuestionService } from '../../../../services/question.service';
import { QuestionCreateDto, QuestionEditDto, AnswerViewModel, AnswerCreateDto, AnswerEditDto } from '../../../../models/question.model';
import { ConfirmService } from '../../../../services/confirm.service';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-admin-question-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './question-form.component.html'
})
export class AdminQuestionFormComponent implements OnInit {
  isEditMode = false;
  questionId = '';
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  questionTypes = ['SingleChoice', 'MultipleChoice', 'TrueFalse'];

  // Question data
  questionContent = '';
  questionType = 'SingleChoice';
  questionIsActive = true;

  // Answers (edit mode only)
  answers: AnswerViewModel[] = [];
  isLoadingAnswers = false;
  showAnswers = false;

  // Add/Edit answer form
  showAnswerForm = false;
  editingAnswerId: string | null = null;
  answerContent = '';
  answerIsCorrect = false;
  answerIsActive = true;
  isSubmittingAnswer = false;

  constructor(
    private questionService: QuestionService,
    private router: Router,
    private route: ActivatedRoute,
    private confirmService: ConfirmService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.questionId = id;
      this.loadQuestion();
    }
  }

  loadQuestion(): void {
    this.isLoading = true;
    this.questionService.getById(this.questionId).subscribe({
      next: (q) => {
        this.questionContent = q.content;
        this.questionType = q.questionType;
        this.questionIsActive = q.isActive;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to load question.';
        this.isLoading = false;
      }
    });
  }

  saveQuestion(): void {
    if (!this.questionContent.trim()) {
      this.errorMessage = 'Question content is required.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.isEditMode) {
      const dto: QuestionEditDto = {
        id: this.questionId,
        content: this.questionContent.trim(),
        questionType: this.questionType,
        isActive: this.questionIsActive
      };
      this.questionService.update(this.questionId, dto).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.successMessage = 'Question updated successfully!';
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.errorMessage = err.error?.message || 'Update failed.';
        }
      });
    } else {
      const dto: QuestionCreateDto = {
        content: this.questionContent.trim(),
        questionType: this.questionType,
        isActive: this.questionIsActive
      };
      this.questionService.create(dto).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.router.navigate(['/admin/questions']);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.errorMessage = err.error?.message || 'Failed to create question.';
        }
      });
    }
  }

  // ===== Answer Management (Edit Mode Only) =====

  toggleAnswers(): void {
    this.showAnswers = !this.showAnswers;
    if (this.showAnswers && this.answers.length === 0) {
      this.loadAnswers();
    }
  }

  loadAnswers(): void {
    this.isLoadingAnswers = true;
    this.questionService.getAnswers(this.questionId).subscribe({
      next: (data) => {
        this.answers = data;
        this.isLoadingAnswers = false;
      },
      error: () => this.isLoadingAnswers = false
    });
  }

  openAddAnswerForm(): void {
    this.editingAnswerId = null;
    this.answerContent = '';
    this.answerIsCorrect = false;
    this.answerIsActive = true;
    this.showAnswerForm = true;
  }

  openEditAnswerForm(answer: AnswerViewModel): void {
    this.editingAnswerId = answer.id;
    this.answerContent = answer.content;
    this.answerIsCorrect = answer.isCorrect;
    this.answerIsActive = answer.isActive;
    this.showAnswerForm = true;
  }

  cancelAnswerForm(): void {
    this.showAnswerForm = false;
    this.editingAnswerId = null;
  }

  saveAnswer(): void {
    if (!this.answerContent.trim()) return;
    this.isSubmittingAnswer = true;

    if (this.editingAnswerId) {
      // Edit existing answer
      const dto: AnswerEditDto = {
        id: this.editingAnswerId,
        content: this.answerContent.trim(),
        isCorrect: this.answerIsCorrect,
        isActive: this.answerIsActive,
        questionId: this.questionId
      };
      this.questionService.updateAnswer(this.editingAnswerId, dto).subscribe({
        next: () => {
          this.isSubmittingAnswer = false;
          this.showAnswerForm = false;
          this.loadAnswers();
        },
        error: () => this.isSubmittingAnswer = false
      });
    } else {
      // Add new answer
      const dto: AnswerCreateDto = {
        content: this.answerContent.trim(),
        isCorrect: this.answerIsCorrect,
        isActive: this.answerIsActive,
        questionId: this.questionId
      };
      this.questionService.addAnswer(this.questionId, dto).subscribe({
        next: () => {
          this.isSubmittingAnswer = false;
          this.showAnswerForm = false;
          this.loadAnswers();
        },
        error: () => this.isSubmittingAnswer = false
      });
    }
  }

  async deleteAnswer(answer: AnswerViewModel): Promise<void> {
    const short = answer.content.length > 40 ? answer.content.substring(0, 40) + '...' : answer.content;
    const ok = await this.confirmService.confirm({
      title: 'Delete Answer',
      message: `Delete answer "${short}"?`,
      confirmText: 'Delete',
      type: 'danger'
    });
    if (!ok) return;
    this.questionService.deleteAnswer(this.questionId, answer.id).subscribe({
      next: () => { this.toastService.success('Answer deleted!'); this.loadAnswers(); },
      error: () => this.toastService.error('Failed to delete answer.')
    });
  }

  getTypeLabel(type: string): string {
    const map: Record<string, string> = {
      'SingleChoice': 'Single Choice',
      'MultipleChoice': 'Multiple Choice',
      'TrueFalse': 'True/False'
    };
    return map[type] || type;
  }

  getTypeIcon(type: string): string {
    const map: Record<string, string> = {
      'SingleChoice': 'fa-dot-circle',
      'MultipleChoice': 'fa-check-square',
      'TrueFalse': 'fa-toggle-on'
    };
    return map[type] || 'fa-question';
  }
}
