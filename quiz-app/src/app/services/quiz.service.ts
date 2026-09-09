import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  QuizViewModel, QuizCreateDto, QuizEditDto,
  PrepareQuizDto, QuizPrepareInfoDto,
  TakeQuizDto, QuizForTestDto,
  QuizSubmissionDto, QuizResultDto
} from '../models/quiz.model';
import { QuestionViewModel, QuizQuestionCreateDto } from '../models/question.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class QuizService {
  private apiUrl = `${environment.apiUrl}/quizzes`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private get headers(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${this.authService.getToken()}` });
  }

  // ===== PUBLIC =====

  getAll(): Observable<QuizViewModel[]> {
    return this.http.get<QuizViewModel[]>(this.apiUrl);
  }

  getById(id: string): Observable<QuizViewModel> {
    return this.http.get<QuizViewModel>(`${this.apiUrl}/${id}`);
  }

  // ===== ADMIN CRUD =====

  create(dto: QuizCreateDto): Observable<boolean> {
    return this.http.post<boolean>(this.apiUrl, dto, { headers: this.headers });
  }

  update(id: string, dto: QuizEditDto): Observable<boolean> {
    return this.http.put<boolean>(`${this.apiUrl}/${id}`, dto, { headers: this.headers });
  }

  delete(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`, { headers: this.headers });
  }

  // ===== ADMIN — Quiz-Question Management =====

  getQuestions(quizId: string): Observable<QuestionViewModel[]> {
    return this.http.get<QuestionViewModel[]>(`${this.apiUrl}/${quizId}/questions`, { headers: this.headers });
  }

  addQuestion(dto: QuizQuestionCreateDto): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/${dto.quizId}/questions`, dto, { headers: this.headers });
  }

  removeQuestion(quizId: string, quizQuestionId: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${quizId}/questions/${quizQuestionId}`, { headers: this.headers });
  }

  // ===== USER — Quiz-Taking Flow =====

  prepareQuiz(dto: PrepareQuizDto): Observable<QuizPrepareInfoDto> {
    return this.http.post<QuizPrepareInfoDto>(`${this.apiUrl}/prepare`, dto, { headers: this.headers });
  }

  takeQuiz(dto: TakeQuizDto): Observable<QuizForTestDto> {
    return this.http.post<QuizForTestDto>(`${this.apiUrl}/take`, dto, { headers: this.headers });
  }

  submitQuiz(dto: QuizSubmissionDto): Observable<QuizResultDto> {
    return this.http.post<QuizResultDto>(`${this.apiUrl}/submit`, dto, { headers: this.headers });
  }
}
