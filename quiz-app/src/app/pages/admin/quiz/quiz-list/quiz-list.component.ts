import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { QuizService } from '../../../../services/quiz.service';
import { QuizViewModel } from '../../../../models/quiz.model';
import { DurationFormatPipe } from '../../../../shared/pipes/duration-format.pipe';

@Component({
  selector: 'app-admin-quiz-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, PaginationComponent, DurationFormatPipe],
  templateUrl: './quiz-list.component.html'
})
export class AdminQuizListComponent implements OnInit {
  quizzes: QuizViewModel[] = [];
  searchTerm = '';
  isLoading = true;

  // Pagination (server-side)
  currentPage = 1;
  pageSize = 10;
  totalElements = 0;

  // Sorting
  sortBy = 'createdAt';
  sortOrder = 'desc';

  constructor(private quizService: QuizService) {}

  ngOnInit(): void {
    this.loadQuizzes();
  }

  loadQuizzes(): void {
    this.isLoading = true;
    this.quizService.getAll({
      search: this.searchTerm || undefined,
      pageNumber: this.currentPage,
      pageSize: this.pageSize,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder
    }).subscribe({
      next: (res) => {
        this.quizzes = res.content;
        this.totalElements = res.totalElements;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadQuizzes();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadQuizzes();
  }

  onSort(field: string): void {
    if (this.sortBy === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortOrder = 'asc';
    }
    this.currentPage = 1;
    this.loadQuizzes();
  }

  deleteQuiz(id: string, title: string): void {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    this.quizService.delete(id).subscribe({
      next: () => this.loadQuizzes(),
      error: (err) => alert(err.error?.message || 'Delete failed.')
    });
  }
}
