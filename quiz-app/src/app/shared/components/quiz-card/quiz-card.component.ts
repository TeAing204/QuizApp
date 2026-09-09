import { Component, Input } from '@angular/core';
import { DurationFormatPipe } from '../../pipes/duration-format.pipe';

export interface QuizCardData {
  id: string;
  title: string;
  description: string;
  duration: number;
  thumbnailUrl?: string;
  numberOfQuestions: number;
  isActive: boolean;
}

@Component({
  selector: 'app-quiz-card',
  standalone: true,
  imports: [DurationFormatPipe],
  templateUrl: './quiz-card.component.html'
})
export class QuizCardComponent {
  @Input({ required: true }) quiz!: QuizCardData;
}
