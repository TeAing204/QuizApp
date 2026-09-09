import { Pipe, PipeTransform } from '@angular/core';

/**
 * Chuyển đổi thời gian (phút) sang format dễ đọc.
 * VD: 15 → "15m", 60 → "1h", 75 → "1h 15m", 120 → "2h"
 */
@Pipe({
  name: 'durationFormat',
  standalone: true
})
export class DurationFormatPipe implements PipeTransform {
  transform(minutes: number): string {
    if (!minutes || minutes <= 0) return '0m';

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  }
}
