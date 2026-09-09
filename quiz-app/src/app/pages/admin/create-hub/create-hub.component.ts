import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

interface ActivityCard {
  icon: string;
  title: string;
  description: string;
  route: string | null;
  color: string;
  gradient: string;
  disabled: boolean;
  badge?: string;
}

@Component({
  selector: 'app-create-hub',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './create-hub.component.html'
})
export class CreateHubComponent {
  userName = '';

  activities: ActivityCard[] = [
    {
      icon: 'fas fa-check-square',
      title: 'Đánh giá',
      description: 'Câu hỏi nhanh và tương tác',
      route: '/admin/quizzes/create',
      color: 'green',
      gradient: 'from-emerald-400 to-green-600',
      disabled: false
    },
    {
      icon: 'fas fa-clone',
      title: 'Flashcards',
      description: 'Câu hỏi ở mặt trước, câu trả lời ở mặt sau',
      route: null,
      color: 'purple',
      gradient: 'from-violet-400 to-purple-600',
      disabled: true,
      badge: 'Sắp ra mắt'
    }
  ];

  constructor(private authService: AuthService) {
    const user = this.authService.getCurrentUser();
    this.userName = user?.firstName || user?.displayName || 'bạn';
  }
}
