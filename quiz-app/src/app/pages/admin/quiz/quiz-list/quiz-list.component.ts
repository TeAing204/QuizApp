import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { QuizService } from '../../../../services/quiz.service';
import { QuizViewModel } from '../../../../models/quiz.model';
import { DurationFormatPipe } from '../../../../shared/pipes/duration-format.pipe';

@Component({
  selector: 'app-admin-quiz-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DurationFormatPipe],
  templateUrl: './quiz-list.component.html'
})
export class AdminQuizListComponent implements OnInit {
  quizzes: QuizViewModel[] = [];
  filteredQuizzes: QuizViewModel[] = [];
  searchTerm = '';
  isLoading = true;

  constructor(private quizService: QuizService) {}

  ngOnInit(): void {
    this.loadQuizzes();
  }

  loadQuizzes(): void {
    this.isLoading = true;
    this.quizService.getAll().subscribe({
      next: (data) => {
        this.quizzes = data;
        this.filteredQuizzes = data;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  onSearch(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredQuizzes = this.quizzes.filter(q =>
      q.title.toLowerCase().includes(term) || q.description.toLowerCase().includes(term)
    );
  }

  deleteQuiz(id: string, title: string): void {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    this.quizService.delete(id).subscribe({
      next: () => this.loadQuizzes(),
      error: (err) => alert(err.error?.message || 'Delete failed.')
    });
  }
}
