import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RoleViewModel, RoleCreateDto, RoleEditDto } from '../models/role.model';

@Injectable({ providedIn: 'root' })
export class RoleService {
  private apiUrl = `${environment.apiUrl}/roles`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<RoleViewModel[]> {
    return this.http.get<RoleViewModel[]>(this.apiUrl);
  }

  getById(id: string): Observable<RoleViewModel> {
    return this.http.get<RoleViewModel>(`${this.apiUrl}/${id}`);
  }

  create(dto: RoleCreateDto): Observable<boolean> {
    return this.http.post<boolean>(this.apiUrl, dto);
  }

  update(id: string, dto: RoleEditDto): Observable<boolean> {
    return this.http.put<boolean>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
