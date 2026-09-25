import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { UserService } from '../../../../services/user.service';
import { UserViewModel } from '../../../../models/user.model';

@Component({
  selector: 'app-admin-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, PaginationComponent],
  templateUrl: './user-list.component.html'
})
export class AdminUserListComponent implements OnInit {
  users: UserViewModel[] = [];
  searchTerm = '';
  isLoading = true;

  // Pagination (server-side)
  currentPage = 1;
  pageSize = 10;
  totalElements = 0;

  // Sorting
  sortBy = 'createdAt';
  sortOrder = 'desc';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getAll({
      search: this.searchTerm || undefined,
      pageNumber: this.currentPage,
      pageSize: this.pageSize,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder
    }).subscribe({
      next: (res) => {
        this.users = res.content;
        this.totalElements = res.totalElements;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadUsers();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadUsers();
  }

  onSort(field: string): void {
    if (this.sortBy === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortOrder = 'asc';
    }
    this.currentPage = 1;
    this.loadUsers();
  }

  deleteUser(id: string, name: string): void {
    if (!confirm(`Bạn có chắc muốn xóa user "${name}"?`)) return;
    this.userService.delete(id).subscribe({
      next: () => this.loadUsers(),
      error: (err) => alert(err.error?.message || 'Xóa user thất bại.')
    });
  }

  getInitials(user: UserViewModel): string {
    return (user.firstName?.charAt(0) || '') + (user.lastName?.charAt(0) || '');
  }
}
