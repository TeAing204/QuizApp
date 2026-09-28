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
      title: 'Assessment',
      description: 'Interactive quizzes and evaluations',
      route: '/admin/quizzes/create',
      color: 'green',
      gradient: 'from-emerald-400 to-green-600',
      disabled: false
    },
    {
      icon: 'fas fa-clone',
      title: 'Flashcards',
      description: 'Question on the front, answer on the back',
      route: null,
      color: 'purple',
      gradient: 'from-violet-400 to-purple-600',
      disabled: true,
      badge: 'Coming Soon'
    }
  ];

  constructor(private authService: AuthService) {
    const user = this.authService.getCurrentUser();
    this.userName = user?.firstName || user?.displayName || 'there';
  }
}
