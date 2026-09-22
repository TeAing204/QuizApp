import { QuestionForTestDto, UserAnswerSubmissionDto } from './question.model';
import { UserViewModel } from './auth.model';

// ===== Quiz CRUD (khớp backend QuizViewModel/CreateDto/EditDto) =====

export interface QuizViewModel {
  id: string;
  title: string;
  description: string;
  duration: number;
  thumbnailUrl?: string;
  isActive: boolean;
  numberOfQuestions: number;
}

export interface QuizCreateDto {
  title: string;
  description: string;
  duration: number;
  thumbnailUrl?: string;
  isActive: boolean;
}

export interface QuizEditDto {
  id: string;
  title: string;
  description: string;
  duration: number;
  thumbnailUrl?: string;
  isActive: boolean;
}

// ===== Quiz-Taking Flow (khớp backend PrepareQuizDto/TakeQuizDto/QuizSubmissionDto) =====

/** Request: chuẩn bị quiz trước khi bắt đầu */
export interface PrepareQuizDto {
  userId: string;
  quizId: string;
  quizCode?: string;
}

/** Response: thông tin quiz đã chuẩn bị */
export interface QuizPrepareInfoDto {
  id: string;
  title: string;
  description?: string;
  duration: number;
  thumbnailUrl?: string;
  quizCode?: string;
  user: UserViewModel;
}

/** Request: bắt đầu làm quiz */
export interface TakeQuizDto {
  userId: string;
  quizId: string;
  quizCode?: string;
}

/** Response: quiz + câu hỏi + đáp án (ẩn isCorrect) */
export interface QuizForTestDto {
  id: string;
  title: string;
  description?: string;
  duration: number;
  quizCode?: string;
  startTime: string;
  questions: QuestionForTestDto[];
}

/** Request: nộp bài quiz */
export interface QuizSubmissionDto {
  quizId: string;
  userId: string;
  quizCode?: string;
  answers: UserAnswerSubmissionDto[];
}

/** Response: kết quả sau khi nộp bài */
export interface QuizResultDto {
  quizAttemptId: string;
  quizId: string;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  submittedAt: string;
}

/** Response: lịch sử làm bài của user */
export interface QuizHistoryDto {
  quizAttemptId: string;
  quizId: string;
  quizTitle: string;
  quizDescription?: string;
  duration: number;
  thumbnailUrl?: string;
  score?: number;
  totalQuestions: number;
  correctAnswers: number;
  startTime: string;
  submittedAt?: string;
  quizCode?: string;
  status: string; // "Completed" | "InProgress"
}

/** Response: chi tiết một lần làm bài (xem lại) */
export interface AttemptDetailDto {
  quizAttemptId: string;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  startTime: string;
  submittedAt?: string;
  questions: AttemptQuestionDetailDto[];
}

export interface AttemptQuestionDetailDto {
  questionContent: string;
  questionType: string;
  isCorrect: boolean;
  answers: AttemptAnswerDetailDto[];
}

export interface AttemptAnswerDetailDto {
  content: string;
  isCorrect: boolean;
  isSelected: boolean;
}
