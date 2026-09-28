import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ToastService, Toast } from '../../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
      @for (toast of toasts; track toast.id) {
        <div class="toast-item pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg border backdrop-blur-sm min-w-[320px] max-w-[420px] animate-slide-in"
             [class]="getToastClasses(toast.type)"
             (click)="dismiss(toast.id)">
          <div class="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5"
               [class]="getIconBgClass(toast.type)">
            <i class="fas text-xs text-white" [class]="getIcon(toast.type)"></i>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold" [class]="getTitleColor(toast.type)">{{ getTitle(toast.type) }}</p>
            <p class="text-sm mt-0.5 text-gray-600">{{ toast.message }}</p>
          </div>
          <button class="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors text-gray-400 hover:text-gray-600">
            <i class="fas fa-times text-xs"></i>
          </button>
          <!-- Progress bar -->
          <div class="absolute bottom-0 left-0 h-0.5 rounded-b-xl transition-all"
               [class]="getProgressColor(toast.type)"
               [style.width.%]="toast._progress || 100"
               [style.transition]="'width ' + toast.duration + 'ms linear'">
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
    .animate-slide-in {
      animation: slideIn 0.3s cubic-bezier(0.21, 1.02, 0.73, 1) forwards;
    }
    .animate-slide-out {
      animation: slideOut 0.25s ease-in forwards;
    }
    .toast-item { position: relative; overflow: hidden; cursor: pointer; }
  `]
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: (Toast & { _progress?: number; _timeout?: any })[] = [];
  private subscriptions: Subscription[] = [];

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.toastService.toast$.subscribe(toast => {
        const t = { ...toast, _progress: 100 } as any;
        this.toasts.push(t);

        // Start progress animation after a tick
        setTimeout(() => t._progress = 0, 50);

        // Auto-dismiss
        t._timeout = setTimeout(() => this.dismiss(toast.id), toast.duration);
      }),
      this.toastService.dismiss$.subscribe(id => this.dismiss(id))
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
    this.toasts.forEach(t => clearTimeout(t._timeout));
  }

  dismiss(id: number): void {
    const index = this.toasts.findIndex(t => t.id === id);
    if (index > -1) {
      clearTimeout(this.toasts[index]._timeout);
      this.toasts.splice(index, 1);
    }
  }

  getToastClasses(type: string): string {
    const map: Record<string, string> = {
      success: 'bg-white border-green-200',
      error: 'bg-white border-red-200',
      warning: 'bg-white border-amber-200',
      info: 'bg-white border-blue-200'
    };
    return map[type] || map['info'];
  }

  getIcon(type: string): string {
    const map: Record<string, string> = {
      success: 'fa-check',
      error: 'fa-times',
      warning: 'fa-exclamation',
      info: 'fa-info'
    };
    return map[type] || 'fa-info';
  }

  getIconBgClass(type: string): string {
    const map: Record<string, string> = {
      success: 'bg-green-500',
      error: 'bg-red-500',
      warning: 'bg-amber-500',
      info: 'bg-blue-500'
    };
    return map[type] || 'bg-blue-500';
  }

  getTitleColor(type: string): string {
    const map: Record<string, string> = {
      success: 'text-green-700',
      error: 'text-red-700',
      warning: 'text-amber-700',
      info: 'text-blue-700'
    };
    return map[type] || 'text-blue-700';
  }

  getTitle(type: string): string {
    const map: Record<string, string> = {
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      info: 'Info'
    };
    return map[type] || 'Info';
  }

  getProgressColor(type: string): string {
    const map: Record<string, string> = {
      success: 'bg-green-400',
      error: 'bg-red-400',
      warning: 'bg-amber-400',
      info: 'bg-blue-400'
    };
    return map[type] || 'bg-blue-400';
  }
}
