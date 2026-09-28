import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { UserService } from '../../../../services/user.service';
import { UserViewModel } from '../../../../models/user.model';
import { ConfirmService } from '../../../../services/confirm.service';
import { ToastService } from '../../../../services/toast.service';

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

  constructor(
    private userService: UserService,
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
      this.sortBy = params['sortBy'] || 'createdAt';
      this.sortOrder = params['sortOrder'] || 'desc';
      this.loadUsers();
    });
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

  private updateUrl(): void {
    const queryParams: any = {};
    if (this.searchTerm) queryParams.search = this.searchTerm;
    if (this.currentPage > 1) queryParams.page = this.currentPage;
    if (this.pageSize !== 10) queryParams.pageSize = this.pageSize;
    if (this.sortBy !== 'createdAt') queryParams.sortBy = this.sortBy;
    if (this.sortOrder !== 'desc') queryParams.sortOrder = this.sortOrder;

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

  async deleteUser(id: string, name: string): Promise<void> {
    const ok = await this.confirmService.confirm({
      title: 'Delete User',
      message: `Are you sure you want to delete user "${name}"? This action cannot be undone.`,
      confirmText: 'Delete',
      type: 'danger'
    });
    if (!ok) return;
    this.userService.delete(id).subscribe({
      next: () => { this.toastService.success(`User "${name}" deleted successfully!`); this.loadUsers(); },
      error: (err) => this.toastService.error(err.error?.message || 'Failed to delete user.')
    });
  }

  getInitials(user: UserViewModel): string {
    return (user.firstName?.charAt(0) || '') + (user.lastName?.charAt(0) || '');
  }
}
