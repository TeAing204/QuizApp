import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserViewModel, UserCreateDto, UserEditDto } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<UserViewModel[]> {
    return this.http.get<UserViewModel[]>(this.apiUrl);
  }

  getById(id: string): Observable<UserViewModel> {
    return this.http.get<UserViewModel>(`${this.apiUrl}/${id}`);
  }

  create(dto: UserCreateDto): Observable<boolean> {
    return this.http.post<boolean>(this.apiUrl, dto);
  }

  update(id: string, dto: UserEditDto): Observable<boolean> {
    return this.http.put<boolean>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
