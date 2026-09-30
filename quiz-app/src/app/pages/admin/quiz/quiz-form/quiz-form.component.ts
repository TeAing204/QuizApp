import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { QuizService } from '../../../../services/quiz.service';
import { QuestionService } from '../../../../services/question.service';
import { FileService } from '../../../../services/file.service';
import { QuizCreateDto, QuizEditDto } from '../../../../models/quiz.model';
import { QuestionViewModel, QuestionCreateDto, AnswerCreateDto } from '../../../../models/question.model';
import { ConfirmService } from '../../../../services/confirm.service';
import { ToastService } from '../../../../services/toast.service';

interface QuestionTypeOption {
  type: string;
  label: string;
  icon: string;
  color: string;
  description: string;
}

interface InlineAnswer {
  content: string;
  isCorrect: boolean;
}

interface InlineQuestionForm {
  content: string;
  questionType: string;
  answers: InlineAnswer[];
}

@Component({
  selector: 'app-admin-quiz-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './quiz-form.component.html'
})
export class AdminQuizFormComponent implements OnInit {
  isEditMode = false;
  quizId = '';
  isLoading = false;
  isSaving = false;
  errorMessage = '';
  successMessage = '';

  // Quiz settings
  formData = {
    title: '',
    description: '',
    duration: 30,
    thumbnailUrl: '',
    isActive: true
  };
  showSettings = false;

  // Thumbnail upload
  thumbnailPreview = '';
  isUploadingThumbnail = false;

  // Question types
  questionTypes: QuestionTypeOption[] = [
    { type: 'SingleChoice', label: 'Single Choice', icon: 'fas fa-check-square', color: 'bg-emerald-500', description: 'Choose 1 correct answer' },
    { type: 'MultipleChoice', label: 'Multiple Choice', icon: 'fas fa-check-double', color: 'bg-teal-500', description: 'Choose multiple correct answers' },
    { type: 'TrueFalse', label: 'True / False', icon: 'fas fa-exchange-alt', color: 'bg-rose-500', description: 'Choose True or False' },
    { type: 'FillInTheBlanks', label: 'Fill in the Blanks', icon: 'fas fa-pen-fancy', color: 'bg-amber-500', description: 'Enter accepted answers' },
    { type: 'ShortAnswer', label: 'Short Answer / Essay', icon: 'fas fa-align-left', color: 'bg-blue-500', description: 'Free-form answer' }
  ];

  // Inline editor state
  selectedType: QuestionTypeOption | null = null;
  newQuestion: InlineQuestionForm = { content: '', questionType: 'SingleChoice', answers: [] };
  newAnswerContent = '';
  isCreatingQuestion = false;
  editorError = '';

  // Quiz questions (already added)
  quizQuestions: QuestionViewModel[] = [];
  isLoadingQuestions = false;

  // Sidebar: question bank search
  bankQuestions: QuestionViewModel[] = [];
  bankSearchTerm = '';
  isSearchingBank = false;
  showBankPanel = false;

  constructor(
    private quizService: QuizService,
    private questionService: QuestionService,
    private fileService: FileService,
    private route: ActivatedRoute,
    private router: Router,
    private confirmService: ConfirmService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.quizId = id;
      this.loadQuiz();
      this.loadQuizQuestions();
    }
  }

  loadQuiz(): void {
    this.quizService.getById(this.quizId).subscribe({
      next: (quiz) => {
        this.formData = {
          title: quiz.title,
          description: quiz.description,
          duration: quiz.duration,
          thumbnailUrl: quiz.thumbnailUrl || '',
          isActive: quiz.isActive
        };
        if (quiz.thumbnailUrl) {
          this.thumbnailPreview = this.fileService.getFullUrl(quiz.thumbnailUrl);
        }
      },
      error: () => this.router.navigate(['/admin/quizzes'])
    });
  }

  loadQuizQuestions(): void {
    this.isLoadingQuestions = true;
    this.quizService.getQuestions(this.quizId).subscribe({
      next: (data) => { this.quizQuestions = data; this.isLoadingQuestions = false; },
      error: () => this.isLoadingQuestions = false
    });
  }

  // ===== QUIZ SAVE =====
  onSaveQuiz(): void {
    if (!this.formData.title.trim()) { this.errorMessage = 'Please enter a quiz title.'; return; }
    this.errorMessage = '';
    this.isSaving = true;

    if (this.isEditMode) {
      const dto: QuizEditDto = { id: this.quizId, ...this.formData };
      this.quizService.update(this.quizId, dto).subscribe({
        next: () => {
          this.isSaving = false;
          this.router.navigate(['/admin/quizzes']);
        },
        error: (err) => { this.isSaving = false; this.errorMessage = err.error?.message || 'Failed to save quiz.'; }
      });
    } else {
      const dto: QuizCreateDto = { ...this.formData };
      this.quizService.create(dto).subscribe({
        next: (res: any) => {
          this.isSaving = false;
          // Backend may return object {id: ...} or string ID directly
          let newId = '';
          if (res && typeof res === 'object' && res.id) {
            newId = res.id;
          } else if (typeof res === 'string' && res.length > 0) {
            newId = res;
          }

          if (newId) {
            this.isEditMode = true;
            this.quizId = newId;
            // Navigate to edit URL
            this.router.navigate(['/admin/quizzes', newId, 'edit'], { replaceUrl: true });
            this.successMessage = 'Quiz created! Now you can add questions.';
          } else {
            this.successMessage = 'Quiz created! Please open it to add questions.';
          }
          setTimeout(() => this.successMessage = '', 4000);
        },
        error: (err) => { this.isSaving = false; this.errorMessage = err.error?.message || 'Failed to create quiz.'; }
      });
    }
  }

  onPublish(): void {
    this.formData.isActive = true;
    this.onSaveQuiz();
  }

  // ===== QUESTION TYPE SELECT =====
  selectQuestionType(type: QuestionTypeOption): void {
    this.selectedType = type;
    this.editorError = '';
    this.newAnswerContent = '';

    this.newQuestion = {
      content: '',
      questionType: type.type,
      answers: []
    };

    if (type.type === 'TrueFalse') {
      this.newQuestion.answers = [
        { content: 'True', isCorrect: false },
        { content: 'False', isCorrect: false }
      ];
    }
  }

  cancelEditor(): void {
    this.selectedType = null;
    this.editorError = '';
  }

  // ===== ANSWER MANAGEMENT =====
  addAnswer(): void {
    if (!this.newAnswerContent.trim()) return;
    this.newQuestion.answers.push({ content: this.newAnswerContent.trim(), isCorrect: false });
    this.newAnswerContent = '';
  }

  removeAnswer(index: number): void {
    this.newQuestion.answers.splice(index, 1);
  }

  addFillInAnswer(): void {
    if (!this.newAnswerContent.trim()) return;
    this.newQuestion.answers.push({ content: this.newAnswerContent.trim(), isCorrect: true });
    this.newAnswerContent = '';
  }

  toggleCorrect(index: number): void {
    if (this.newQuestion.questionType === 'SingleChoice' || this.newQuestion.questionType === 'TrueFalse') {
      this.newQuestion.answers.forEach((a, i) => a.isCorrect = i === index);
    } else {
      this.newQuestion.answers[index].isCorrect = !this.newQuestion.answers[index].isCorrect;
    }
  }

  // ===== CREATE QUESTION & ADD TO QUIZ =====
  createAndAddQuestion(): void {
    if (!this.newQuestion.content.trim()) {
      this.editorError = 'Please enter question content.';
      return;
    }

    const type = this.newQuestion.questionType;
    if (type === 'SingleChoice' || type === 'MultipleChoice' || type === 'TrueFalse') {
      if (this.newQuestion.answers.length < 2) {
        this.editorError = 'At least 2 answers are required.';
        return;
      }
      if (!this.newQuestion.answers.some(a => a.isCorrect)) {
        this.editorError = 'Please mark at least 1 correct answer.';
        return;
      }
    }

    if (type === 'FillInTheBlanks') {
      if (this.newQuestion.answers.length < 1) {
        this.editorError = 'Please add at least 1 accepted answer.';
        return;
      }
    }

    this.editorError = '';
    this.isCreatingQuestion = true;

    const createDto: QuestionCreateDto = {
      content: this.newQuestion.content,
      questionType: this.newQuestion.questionType,
      isActive: true
    };

    this.questionService.create(createDto).subscribe({
      next: (createRes: any) => {
        let questionId = '';
        if (createRes && typeof createRes === 'object' && createRes.id) {
          questionId = createRes.id;
        } else if (typeof createRes === 'string' && createRes.length > 0) {
          questionId = createRes;
        }

        const processQuestion = (qId: string) => {
          let count = 0;
          const totalAns = this.newQuestion.answers.length;
          const onAnsDone = () => {
            if (this.isEditMode && this.quizId) {
              this.quizService.addQuestion({ quizId: this.quizId, questionId: qId }).subscribe({
                next: () => {
                  this.loadQuizQuestions();
                  this.finishQuestionCreation();
                },
                error: () => this.finishQuestionCreation()
              });
            } else {
              this.finishQuestionCreation();
            }
          };

          if (totalAns === 0) {
            onAnsDone();
          } else {
            this.newQuestion.answers.forEach(a => {
              const ansDto: AnswerCreateDto = {
                content: a.content,
                isCorrect: a.isCorrect,
                isActive: true,
                questionId: qId
              };
              this.questionService.addAnswer(qId, ansDto).subscribe({
                next: () => { count++; if (count === totalAns) onAnsDone(); },
                error: () => { count++; if (count === totalAns) onAnsDone(); }
              });
            });
          }
        };

        if (questionId) {
          processQuestion(questionId);
        } else {
          this.questionService.getAll({ pageSize: 100, sortBy: 'createdAt', sortOrder: 'desc' }).subscribe({
            next: (res) => {
              const createdQ = res.content.length > 0 ? res.content[0] : null;
              if (createdQ) {
                processQuestion(createdQ.id);
              } else {
                this.finishQuestionCreation();
              }
            }
          });
        }
      },
      error: (err) => {
        this.isCreatingQuestion = false;
        this.editorError = err.error?.message || 'Failed to create question.';
      }
    });
  }

  finishQuestionCreation(): void {
    this.isCreatingQuestion = false;
    this.selectedType = null;
    this.successMessage = 'Question added successfully!';
    setTimeout(() => this.successMessage = '', 3000);
  }

  // ===== REMOVE QUESTION FROM QUIZ =====
  async removeQuizQuestion(quizQuestionId: string): Promise<void> {
    const ok = await this.confirmService.confirm({
      title: 'Remove Question',
      message: 'Remove this question from quiz?',
      confirmText: 'Remove',
      type: 'warning'
    });
    if (!ok) return;
    this.quizService.removeQuestion(this.quizId, quizQuestionId).subscribe({
      next: () => { this.toastService.success('Question removed!'); this.loadQuizQuestions(); }
    });
  }

  // ===== SIDEBAR: QUESTION BANK =====
  toggleBankPanel(): void {
    this.showBankPanel = !this.showBankPanel;
    if (this.showBankPanel && this.bankQuestions.length === 0) {
      this.searchBank();
    }
  }

  searchBank(): void {
    this.isSearchingBank = true;
    this.questionService.getAll({ search: this.bankSearchTerm || undefined, pageSize: 100 }).subscribe({
      next: (res) => {
        this.bankQuestions = res.content;
        this.isSearchingBank = false;
      },
      error: () => this.isSearchingBank = false
    });
  }

  addFromBank(question: QuestionViewModel): void {
    if (!this.isEditMode) {
      this.errorMessage = 'Please save the quiz before adding questions from the bank.';
      return;
    }
    this.quizService.addQuestion({ quizId: this.quizId, questionId: question.id }).subscribe({
      next: () => {
        this.loadQuizQuestions();
        this.successMessage = `Added: "${question.content.substring(0, 40)}..."`;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Question already exists in this quiz.';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  isQuestionInQuiz(questionId: string): boolean {
    return this.quizQuestions.some(q => q.id === questionId);
  }

  // ===== SETTINGS PANEL =====
  toggleSettings(): void {
    this.showSettings = !this.showSettings;
  }

  getQuestionTypeLabel(type: string): string {
    const found = this.questionTypes.find(t => t.type === type);
    return found?.label || type;
  }

  getQuestionTypeColor(type: string): string {
    const found = this.questionTypes.find(t => t.type === type);
    return found?.color || 'bg-gray-500';
  }

  // ===== THUMBNAIL UPLOAD =====
  onThumbnailSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    // Validate client-side
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      this.errorMessage = 'Chỉ hỗ trợ file ảnh (JPG, PNG, GIF, WEBP).';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.errorMessage = 'Kích thước ảnh không được vượt quá 5MB.';
      return;
    }

    this.isUploadingThumbnail = true;
    this.errorMessage = '';

    // Preview ngay lập tức
    const reader = new FileReader();
    reader.onload = () => {
      this.thumbnailPreview = reader.result as string;
    };
    reader.readAsDataURL(file);

    // Upload lên server
    this.fileService.uploadImage(file).subscribe({
      next: (res) => {
        this.formData.thumbnailUrl = res.url;
        this.thumbnailPreview = this.fileService.getFullUrl(res.url);
        this.isUploadingThumbnail = false;
        this.toastService.success('Ảnh đã được tải lên!');
      },
      error: (err) => {
        this.isUploadingThumbnail = false;
        this.errorMessage = err.error?.message || 'Tải ảnh lên thất bại.';
        this.thumbnailPreview = '';
      }
    });

    // Reset input
    input.value = '';
  }

  removeThumbnail(): void {
    this.formData.thumbnailUrl = '';
    this.thumbnailPreview = '';
  }

  getFullThumbnailUrl(url: string): string {
    return this.fileService.getFullUrl(url);
  }
}
