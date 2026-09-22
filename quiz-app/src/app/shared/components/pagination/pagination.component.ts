import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (totalPages > 1) {
      <div class="flex items-center justify-center gap-1 mt-6">
        <!-- Prev -->
        <button (click)="goToPage(currentPage - 1)" [disabled]="currentPage === 1"
                class="px-3 py-2 rounded-lg text-sm border transition-colors"
                [class]="currentPage === 1 ? 'border-gray-100 text-gray-300 cursor-not-allowed' : 'border-gray-200 text-gray-600 hover:bg-gray-50'">
          <i class="fas fa-chevron-left text-xs"></i>
        </button>

        <!-- Page numbers -->
        @for (page of visiblePages; track page) {
          @if (page === -1) {
            <span class="px-2 py-2 text-gray-400 text-sm">...</span>
          } @else {
            <button (click)="goToPage(page)"
                    class="w-9 h-9 rounded-lg text-sm font-medium transition-colors"
                    [class]="page === currentPage
                      ? 'bg-primary-500 text-white shadow-sm'
                      : 'border border-gray-200 text-gray-600 hover:bg-gray-50'">
              {{ page }}
            </button>
          }
        }

        <!-- Next -->
        <button (click)="goToPage(currentPage + 1)" [disabled]="currentPage === totalPages"
                class="px-3 py-2 rounded-lg text-sm border transition-colors"
                [class]="currentPage === totalPages ? 'border-gray-100 text-gray-300 cursor-not-allowed' : 'border-gray-200 text-gray-600 hover:bg-gray-50'">
          <i class="fas fa-chevron-right text-xs"></i>
        </button>
      </div>
    }
  `
})
export class PaginationComponent {
  @Input() totalItems = 0;
  @Input() pageSize = 10;
  @Input() currentPage = 1;
  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get visiblePages(): number[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const pages: number[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > 3) pages.push(-1); // ellipsis
      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (current < total - 2) pages.push(-1); // ellipsis
      pages.push(total);
    }
    return pages;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }
}
