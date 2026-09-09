import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { QuestionViewModel, QuestionCreateDto, QuestionEditDto, AnswerViewModel, AnswerCreateDto, AnswerEditDto } from '../models/question.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class QuestionService {
  private apiUrl = `${environment.apiUrl}/questions`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private get headers(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${this.authService.getToken()}` });
  }

  // ===== Question CRUD =====

  getAll(): Observable<QuestionViewModel[]> {
    return this.http.get<QuestionViewModel[]>(this.apiUrl, { headers: this.headers });
  }

  getById(id: string): Observable<QuestionViewModel> {
    return this.http.get<QuestionViewModel>(`${this.apiUrl}/${id}`, { headers: this.headers });
  }

  create(dto: QuestionCreateDto): Observable<boolean> {
    return this.http.post<boolean>(this.apiUrl, dto, { headers: this.headers });
  }

  update(id: string, dto: QuestionEditDto): Observable<boolean> {
    return this.http.put<boolean>(`${this.apiUrl}/${id}`, dto, { headers: this.headers });
  }

  delete(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`, { headers: this.headers });
  }

  // ===== Answer CRUD (nested under question) =====

  getAnswers(questionId: string): Observable<AnswerViewModel[]> {
    return this.http.get<AnswerViewModel[]>(`${this.apiUrl}/${questionId}/answers`, { headers: this.headers });
  }

  getAnswerById(answerId: string): Observable<AnswerViewModel> {
    return this.http.get<AnswerViewModel>(`${this.apiUrl}/answers/${answerId}`, { headers: this.headers });
  }

  addAnswer(questionId: string, dto: AnswerCreateDto): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/${questionId}/answers`, dto, { headers: this.headers });
  }

  updateAnswer(answerId: string, dto: AnswerEditDto): Observable<boolean> {
    return this.http.put<boolean>(`${this.apiUrl}/answers/${answerId}`, dto, { headers: this.headers });
  }

  deleteAnswer(questionId: string, answerId: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${questionId}/answers/${answerId}`, { headers: this.headers });
  }
}
