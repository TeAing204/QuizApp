import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FileService {
  private apiUrl = `${environment.apiUrl}/files`;

  constructor(private http: HttpClient) {}

  /**
   * Upload ảnh lên server, trả về { url: string }
   */
  uploadImage(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ url: string }>(`${this.apiUrl}/upload`, formData);
  }

  /**
   * Tạo full URL từ relative path (ví dụ: /uploads/abc.jpg → http://localhost:5281/uploads/abc.jpg)
   */
  getFullUrl(relativePath: string): string {
    if (!relativePath) return '';
    if (relativePath.startsWith('http')) return relativePath;
    // Lấy base URL từ apiUrl (bỏ /api)
    const baseUrl = environment.apiUrl.replace('/api', '');
    return `${baseUrl}${relativePath}`;
  }
}
