import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserViewModel, UserCreateDto, UserEditDto } from '../models/user.model';
import { PaginatedResponse } from '../models/paginated-response.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getAll(params?: {search?: string, pageNumber?: number, pageSize?: number, sortBy?: string, sortOrder?: string}): Observable<PaginatedResponse<UserViewModel>> {
    let httpParams = new HttpParams();
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.pageNumber) httpParams = httpParams.set('pageNumber', params.pageNumber.toString());
    if (params?.pageSize) httpParams = httpParams.set('pageSize', params.pageSize.toString());
    if (params?.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
    if (params?.sortOrder) httpParams = httpParams.set('sortOrder', params.sortOrder);
    return this.http.get<PaginatedResponse<UserViewModel>>(this.apiUrl, { params: httpParams });
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
