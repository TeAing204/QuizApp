import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ConfirmService, ConfirmState } from '../../../services/confirm.service';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (state) {
      <div class="fixed inset-0 z-[10000] flex items-center justify-center p-4" (click)="onCancel()">
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"></div>

        <!-- Dialog -->
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-[400px] overflow-hidden animate-scale-in"
             (click)="$event.stopPropagation()">

          <!-- Icon -->
          <div class="pt-8 pb-2 flex justify-center">
            <div class="w-16 h-16 rounded-full flex items-center justify-center"
                 [class]="getIconBg()">
              <i class="fas text-2xl text-white" [class]="getIcon()"></i>
            </div>
          </div>

          <!-- Content -->
          <div class="px-6 pb-2 text-center">
            <h3 class="text-lg font-bold text-gray-900 mb-2">{{ state.title }}</h3>
            <p class="text-sm text-gray-500 leading-relaxed">{{ state.message }}</p>
          </div>

          <!-- Actions -->
          <div class="px-6 pb-6 pt-4 flex gap-3">
            <button (click)="onCancel()"
                    class="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-200">
              {{ state.cancelText }}
            </button>
            <button (click)="onConfirm()"
                    class="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 shadow-lg hover:shadow-xl"
                    [class]="getConfirmBtnClass()">
              {{ state.confirmText }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes scaleIn {
      from { transform: scale(0.9); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    .animate-fade-in { animation: fadeIn 0.2s ease-out forwards; }
    .animate-scale-in { animation: scaleIn 0.25s cubic-bezier(0.21, 1.02, 0.73, 1) forwards; }
  `]
})
export class ConfirmDialogComponent implements OnInit, OnDestroy {
  state: ConfirmState | null = null;
  private subscription?: Subscription;

  constructor(private confirmService: ConfirmService) {}

  ngOnInit(): void {
    this.subscription = this.confirmService.confirm$.subscribe(state => {
      this.state = state;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  onConfirm(): void {
    this.state?.resolve(true);
    this.state = null;
  }

  onCancel(): void {
    this.state?.resolve(false);
    this.state = null;
  }

  getIconBg(): string {
    const map: Record<string, string> = {
      danger: 'bg-red-100',
      warning: 'bg-amber-100',
      info: 'bg-blue-100'
    };
    return map[this.state?.type || 'danger'];
  }

  getIcon(): string {
    const map: Record<string, string> = {
      danger: 'fa-trash-alt text-red-500',
      warning: 'fa-exclamation-triangle text-amber-500',
      info: 'fa-question-circle text-blue-500'
    };
    return map[this.state?.type || 'danger'];
  }

  getConfirmBtnClass(): string {
    const map: Record<string, string> = {
      danger: 'bg-red-500 hover:bg-red-600 shadow-red-500/25',
      warning: 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/25',
      info: 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/25'
    };
    return map[this.state?.type || 'danger'];
  }
}
