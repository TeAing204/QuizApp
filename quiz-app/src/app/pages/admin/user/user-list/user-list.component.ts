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
  filteredUsers: UserViewModel[] = [];
  searchTerm = '';
  isLoading = true;
  currentPage = 1;
  pageSize = 10;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getAll().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = data;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  onSearch(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(u =>
      u.displayName?.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      u.userName.toLowerCase().includes(term)
    );
    this.currentPage = 1;
  }

  get paginatedUsers(): UserViewModel[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredUsers.slice(start, start + this.pageSize);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
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
