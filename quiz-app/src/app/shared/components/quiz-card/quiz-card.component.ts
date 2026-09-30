import { Component, Input } from '@angular/core';
import { DurationFormatPipe } from '../../pipes/duration-format.pipe';
import { FileService } from '../../../services/file.service';

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

  constructor(private fileService: FileService) {}

  getFullThumbnailUrl(url: string): string {
    return this.fileService.getFullUrl(url);
  }
}
