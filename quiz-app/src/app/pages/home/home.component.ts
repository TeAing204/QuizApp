import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { QuizService } from '../../services/quiz.service';
import { AuthService } from '../../services/auth.service';
import { QuizViewModel } from '../../models/quiz.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  quizzes: QuizViewModel[] = [];
  isLoading = true;

  constructor(
    private quizService: QuizService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.quizService.getAll().subscribe({
      next: (data) => {
        this.quizzes = data.filter(q => q.isActive);
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }
}
