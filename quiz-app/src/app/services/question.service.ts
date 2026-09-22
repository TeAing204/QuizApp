import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { QuestionViewModel, QuestionCreateDto, QuestionEditDto, AnswerViewModel, AnswerCreateDto, AnswerEditDto } from '../models/question.model';

@Injectable({ providedIn: 'root' })
export class QuestionService {
  private apiUrl = `${environment.apiUrl}/questions`;

  constructor(private http: HttpClient) {}

  // ===== Question CRUD =====

  getAll(): Observable<QuestionViewModel[]> {
    return this.http.get<QuestionViewModel[]>(this.apiUrl);
  }

  getById(id: string): Observable<QuestionViewModel> {
    return this.http.get<QuestionViewModel>(`${this.apiUrl}/${id}`);
  }

  create(dto: QuestionCreateDto): Observable<any> {
    return this.http.post<any>(this.apiUrl, dto);
  }

  update(id: string, dto: QuestionEditDto): Observable<boolean> {
    return this.http.put<boolean>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
  }

  // ===== Answer CRUD (nested under question) =====

  getAnswers(questionId: string): Observable<AnswerViewModel[]> {
    return this.http.get<AnswerViewModel[]>(`${this.apiUrl}/${questionId}/answers`);
  }

  getAnswerById(answerId: string): Observable<AnswerViewModel> {
    return this.http.get<AnswerViewModel>(`${this.apiUrl}/answers/${answerId}`);
  }

  addAnswer(questionId: string, dto: AnswerCreateDto): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/${questionId}/answers`, dto);
  }

  updateAnswer(answerId: string, dto: AnswerEditDto): Observable<boolean> {
    return this.http.put<boolean>(`${this.apiUrl}/answers/${answerId}`, dto);
  }

  deleteAnswer(questionId: string, answerId: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${questionId}/answers/${answerId}`);
  }
}
