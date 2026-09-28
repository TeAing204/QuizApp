import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { RoleService } from '../../../../services/role.service';
import { RoleViewModel } from '../../../../models/role.model';
import { ConfirmService } from '../../../../services/confirm.service';
import { ToastService } from '../../../../services/toast.service';

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

  constructor(
    private roleService: RoleService,
    private route: ActivatedRoute,
    private router: Router,
    private confirmService: ConfirmService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['search'] || '';
      this.currentPage = params['page'] ? +params['page'] : 1;
      this.pageSize = params['pageSize'] ? +params['pageSize'] : 10;
      this.sortBy = params['sortBy'] || 'name';
      this.sortOrder = params['sortOrder'] || 'asc';
      this.loadRoles();
    });
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

  private updateUrl(): void {
    const queryParams: any = {};
    if (this.searchTerm) queryParams.search = this.searchTerm;
    if (this.currentPage > 1) queryParams.page = this.currentPage;
    if (this.pageSize !== 10) queryParams.pageSize = this.pageSize;
    if (this.sortBy !== 'name') queryParams.sortBy = this.sortBy;
    if (this.sortOrder !== 'asc') queryParams.sortOrder = this.sortOrder;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      replaceUrl: true
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.updateUrl();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updateUrl();
  }

  onSort(field: string): void {
    if (this.sortBy === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortOrder = 'asc';
    }
    this.currentPage = 1;
    this.updateUrl();
  }

  async deleteRole(id: string, name: string): Promise<void> {
    const ok = await this.confirmService.confirm({
      title: 'Delete Role',
      message: `Are you sure you want to delete role "${name}"? This action cannot be undone.`,
      confirmText: 'Delete',
      type: 'danger'
    });
    if (!ok) return;
    this.roleService.delete(id).subscribe({
      next: () => { this.toastService.success(`Role "${name}" deleted successfully!`); this.loadRoles(); },
      error: (err) => this.toastService.error(err.error?.message || 'Failed to delete role.')
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
