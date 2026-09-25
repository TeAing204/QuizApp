import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { RoleService } from '../../../../services/role.service';
import { RoleViewModel } from '../../../../models/role.model';

@Component({
  selector: 'app-admin-role-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, PaginationComponent],
  templateUrl: './role-list.component.html'
})
export class AdminRoleListComponent implements OnInit {
  roles: RoleViewModel[] = [];
  searchTerm = '';
  isLoading = true;

  // Pagination (server-side)
  currentPage = 1;
  pageSize = 10;
  totalElements = 0;

  // Sorting
  sortBy = 'name';
  sortOrder = 'asc';

  constructor(private roleService: RoleService) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.isLoading = true;
    this.roleService.getAll({
      search: this.searchTerm || undefined,
      pageNumber: this.currentPage,
      pageSize: this.pageSize,
      sortOrder: this.sortOrder
    }).subscribe({
      next: (res) => {
        this.roles = res.content;
        this.totalElements = res.totalElements;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadRoles();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadRoles();
  }

  deleteRole(id: string, name: string): void {
    if (!confirm(`Bạn có chắc muốn xóa vai trò "${name}"?`)) return;
    this.roleService.delete(id).subscribe({
      next: () => this.loadRoles(),
      error: (err) => alert(err.error?.message || 'Xóa vai trò thất bại.')
    });
  }

  getRoleIcon(name: string): string {
    const lower = name.toLowerCase();
    if (lower.includes('admin')) return 'fas fa-crown';
    if (lower.includes('teacher') || lower.includes('instructor')) return 'fas fa-chalkboard-teacher';
    if (lower.includes('student') || lower.includes('user')) return 'fas fa-user-graduate';
    if (lower.includes('moderator')) return 'fas fa-shield-alt';
    return 'fas fa-user-tag';
  }

  getRoleColor(name: string): string {
    const lower = name.toLowerCase();
    if (lower.includes('admin')) return 'from-purple-500 to-indigo-600';
    if (lower.includes('teacher') || lower.includes('instructor')) return 'from-emerald-500 to-teal-600';
    if (lower.includes('student') || lower.includes('user')) return 'from-blue-500 to-cyan-600';
    if (lower.includes('moderator')) return 'from-amber-500 to-orange-600';
    return 'from-gray-500 to-gray-600';
  }
}
