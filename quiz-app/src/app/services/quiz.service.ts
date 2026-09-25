import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  QuizViewModel, QuizCreateDto, QuizEditDto,
  PrepareQuizDto, QuizPrepareInfoDto,
  TakeQuizDto, QuizForTestDto,
  QuizSubmissionDto, QuizResultDto,
  QuizHistoryDto, AttemptDetailDto
} from '../models/quiz.model';
import { QuestionViewModel, QuizQuestionCreateDto } from '../models/question.model';
import { PaginatedResponse } from '../models/paginated-response.model';

@Injectable({ providedIn: 'root' })
export class QuizService {
  private apiUrl = `${environment.apiUrl}/quizzes`;

  constructor(private http: HttpClient) {}

  // ===== PUBLIC =====

  getAll(params?: {search?: string, pageNumber?: number, pageSize?: number, sortBy?: string, sortOrder?: string}): Observable<PaginatedResponse<QuizViewModel>> {
    let httpParams = new HttpParams();
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.pageNumber) httpParams = httpParams.set('pageNumber', params.pageNumber.toString());
    if (params?.pageSize) httpParams = httpParams.set('pageSize', params.pageSize.toString());
    if (params?.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
    if (params?.sortOrder) httpParams = httpParams.set('sortOrder', params.sortOrder);
    return this.http.get<PaginatedResponse<QuizViewModel>>(this.apiUrl, { params: httpParams });
  }

  getById(id: string): Observable<QuizViewModel> {
    return this.http.get<QuizViewModel>(`${this.apiUrl}/${id}`);
  }

  // ===== ADMIN CRUD =====

  create(dto: QuizCreateDto): Observable<any> {
    return this.http.post<any>(this.apiUrl, dto);
  }

  update(id: string, dto: QuizEditDto): Observable<boolean> {
    return this.http.put<boolean>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
  }

  // ===== ADMIN — Quiz-Question Management =====

  getQuestions(quizId: string): Observable<QuestionViewModel[]> {
    return this.http.get<QuestionViewModel[]>(`${this.apiUrl}/${quizId}/questions`);
  }

  addQuestion(dto: QuizQuestionCreateDto): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/${dto.quizId}/questions`, dto);
  }

  removeQuestion(quizId: string, quizQuestionId: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${quizId}/questions/${quizQuestionId}`);
  }

  // ===== USER — Quiz-Taking Flow =====

  prepareQuiz(dto: PrepareQuizDto): Observable<QuizPrepareInfoDto> {
    return this.http.post<QuizPrepareInfoDto>(`${this.apiUrl}/prepare`, dto);
  }

  takeQuiz(dto: TakeQuizDto): Observable<QuizForTestDto> {
    return this.http.post<QuizForTestDto>(`${this.apiUrl}/take`, dto);
  }

  submitQuiz(dto: QuizSubmissionDto): Observable<QuizResultDto> {
    return this.http.post<QuizResultDto>(`${this.apiUrl}/submit`, dto);
  }

  // ===== USER — Quiz History =====

  getHistory(userId: string): Observable<QuizHistoryDto[]> {
    return this.http.get<QuizHistoryDto[]>(`${this.apiUrl}/history/${userId}`);
  }

  // ===== USER — Attempt Detail (Xem lại bài làm) =====

  getAttemptDetail(attemptId: string): Observable<AttemptDetailDto> {
    return this.http.get<AttemptDetailDto>(`${this.apiUrl}/attempts/${attemptId}`);
  }
}
