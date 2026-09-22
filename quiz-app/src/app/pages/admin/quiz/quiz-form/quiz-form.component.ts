import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { QuizService } from '../../../../services/quiz.service';
import { QuestionService } from '../../../../services/question.service';
import { QuizCreateDto, QuizEditDto } from '../../../../models/quiz.model';
import { QuestionViewModel, QuestionCreateDto, AnswerCreateDto } from '../../../../models/question.model';

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

  // Question types
  questionTypes: QuestionTypeOption[] = [
    { type: 'SingleChoice', label: 'Câu hỏi trắc nghiệm', icon: 'fas fa-check-square', color: 'bg-emerald-500', description: 'Chọn 1 đáp án đúng' },
    { type: 'MultipleChoice', label: 'Chọn nhiều lần', icon: 'fas fa-check-double', color: 'bg-teal-500', description: 'Chọn nhiều đáp án đúng' },
    { type: 'TrueFalse', label: 'Đúng hay sai', icon: 'fas fa-exchange-alt', color: 'bg-rose-500', description: 'Chọn Đúng hoặc Sai' },
    { type: 'FillInTheBlanks', label: 'Điền vào chỗ trống', icon: 'fas fa-pen-fancy', color: 'bg-amber-500', description: 'Điền câu trả lời' },
    { type: 'ShortAnswer', label: 'Câu hỏi mở', icon: 'fas fa-align-left', color: 'bg-blue-500', description: 'Trả lời tự do' }
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
    private route: ActivatedRoute,
    private router: Router
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
    if (!this.formData.title.trim()) { this.errorMessage = 'Vui lòng nhập tiêu đề quiz.'; return; }
    this.errorMessage = '';
    this.isSaving = true;

    if (this.isEditMode) {
      const dto: QuizEditDto = { id: this.quizId, ...this.formData };
      this.quizService.update(this.quizId, dto).subscribe({
        next: () => {
          this.isSaving = false;
          this.successMessage = 'Đã lưu quiz thành công!';
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => { this.isSaving = false; this.errorMessage = err.error?.message || 'Lưu thất bại.'; }
      });
    } else {
      const dto: QuizCreateDto = { ...this.formData };
      this.quizService.create(dto).subscribe({
        next: (res: any) => {
          this.isSaving = false;
          // Backend có thể trả về object {id: ...} hoặc string ID trực tiếp
          let newId = '';
          if (res && typeof res === 'object' && res.id) {
            newId = res.id;
          } else if (typeof res === 'string' && res.length > 0) {
            newId = res;
          }

          if (newId) {
            this.isEditMode = true;
            this.quizId = newId;
            // Navigate sang URL edit để đảm bảo state đúng
            this.router.navigate(['/admin/quizzes', newId, 'edit'], { replaceUrl: true });
            this.successMessage = 'Đã tạo quiz! Bây giờ hãy thêm câu hỏi.';
          } else {
            this.successMessage = 'Đã tạo quiz! Vui lòng vào danh sách quiz để chỉnh sửa và thêm câu hỏi.';
          }
          setTimeout(() => this.successMessage = '', 4000);
        },
        error: (err) => { this.isSaving = false; this.errorMessage = err.error?.message || 'Tạo thất bại.'; }
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
        { content: 'Đúng', isCorrect: false },
        { content: 'Sai', isCorrect: false }
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
      this.editorError = 'Vui lòng nhập nội dung câu hỏi.';
      return;
    }

    const type = this.newQuestion.questionType;
    if (type === 'SingleChoice' || type === 'MultipleChoice' || type === 'TrueFalse') {
      if (this.newQuestion.answers.length < 2) {
        this.editorError = 'Cần ít nhất 2 đáp án.';
        return;
      }
      if (!this.newQuestion.answers.some(a => a.isCorrect)) {
        this.editorError = 'Vui lòng chọn ít nhất 1 đáp án đúng.';
        return;
      }
    }

    if (type === 'FillInTheBlanks') {
      if (this.newQuestion.answers.length < 1) {
        this.editorError = 'Vui lòng thêm ít nhất 1 đáp án đúng.';
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
        // Thử lấy ID từ response trước
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
          // Nếu backend trả về ID trực tiếp → dùng luôn
          processQuestion(questionId);
        } else {
          // Fallback: lấy danh sách và tìm câu hỏi cuối cùng (mới nhất)
          this.questionService.getAll().subscribe({
            next: (all) => {
              const createdQ = all.length > 0 ? all[all.length - 1] : null;
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
        this.editorError = err.error?.message || 'Tạo câu hỏi thất bại.';
      }
    });
  }

  finishQuestionCreation(): void {
    this.isCreatingQuestion = false;
    this.selectedType = null;
    this.successMessage = 'Đã thêm câu hỏi thành công!';
    setTimeout(() => this.successMessage = '', 3000);
  }

  // ===== REMOVE QUESTION FROM QUIZ =====
  removeQuizQuestion(quizQuestionId: string): void {
    if (!confirm('Xóa câu hỏi này khỏi quiz?')) return;
    this.quizService.removeQuestion(this.quizId, quizQuestionId).subscribe({
      next: () => this.loadQuizQuestions()
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
    this.questionService.getAll().subscribe({
      next: (data) => {
        if (this.bankSearchTerm.trim()) {
          const term = this.bankSearchTerm.toLowerCase();
          this.bankQuestions = data.filter(q => q.content.toLowerCase().includes(term));
        } else {
          this.bankQuestions = data;
        }
        this.isSearchingBank = false;
      },
      error: () => this.isSearchingBank = false
    });
  }

  addFromBank(question: QuestionViewModel): void {
    if (!this.isEditMode) {
      this.errorMessage = 'Vui lòng lưu quiz trước khi thêm câu hỏi từ thư viện.';
      return;
    }
    this.quizService.addQuestion({ quizId: this.quizId, questionId: question.id }).subscribe({
      next: () => {
        this.loadQuizQuestions();
        this.successMessage = `Đã thêm: "${question.content.substring(0, 40)}..."`;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Câu hỏi đã tồn tại trong quiz.';
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
}
