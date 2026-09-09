// ===== Answer DTOs (khớp backend AnswerDtos.cs) =====

export interface AnswerViewModel {
  id: string;
  content: string;
  isCorrect: boolean;
  isActive: boolean;
  questionId: string;
}

export interface AnswerCreateDto {
  content: string;
  isCorrect: boolean;
  isActive: boolean;
  questionId: string;
}

export interface AnswerEditDto {
  id: string;
  content: string;
  isCorrect: boolean;
  isActive: boolean;
  questionId: string;
}

// ===== Question DTOs (khớp backend QuestionCreateEditDto.cs) =====

export interface QuestionViewModel {
  id: string;
  content: string;
  questionType: string;
  isActive: boolean;
}

/** Backend QuestionCreateDto KHÔNG có answers — tạo answer riêng qua API */
export interface QuestionCreateDto {
  content: string;
  questionType: string;
  isActive: boolean;
}

export interface QuestionEditDto {
  id: string;
  content: string;
  questionType: string;
  isActive: boolean;
}

// ===== Quiz-Question (khớp backend CommonDtos.cs) =====

export interface QuizQuestionCreateDto {
  quizId: string;
  questionId: string;
}

// ===== Test DTOs (khớp backend QuestionViewModel.cs) =====

/** Câu hỏi trong bài thi — ẩn isCorrect */
export interface QuestionForTestDto {
  id: string;
  content: string;
  questionType: string;
  answers: AnswerForTestDto[];
}

/** Đáp án trong bài thi — chỉ có id + content */
export interface AnswerForTestDto {
  id: string;
  content: string;
}

// ===== Submission (khớp backend CommonDtos.cs) =====

export interface UserAnswerSubmissionDto {
  questionId: string;
  answerId: string;
}
