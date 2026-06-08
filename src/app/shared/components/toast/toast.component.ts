import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/service/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast" *ngIf="toastService.message() as msg" [class.success]="msg.type === 'success'" [class.error]="msg.type === 'error'">
      <span class="toast-icon" aria-hidden="true">{{ msg.type === 'success' ? '✓' : '!' }}</span>
      <div class="toast-content">
        <p>{{ msg.message }}</p>
      </div>
      <button type="button" class="toast-close" aria-label="Fechar notificação" (click)="toastService.hide()">×</button>
    </div>
  `,
  styles: [`
    .toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px 16px;
      border-radius: 16px;
      backdrop-filter: blur(20px);
      background: rgba(18,27,44,0.9);
      border: 1px solid var(--border);
      color: white;
      font-weight: 600;
      z-index: 2100;
      animation: slideIn 0.3s ease;
      box-shadow: var(--shadow);
      max-width: min(92vw, 360px);
    }
    .toast.success {
      border-color: rgba(34, 197, 94, 0.28);
    }
    .toast.error {
      border-color: rgba(239, 68, 68, 0.28);
    }
    .toast-icon {
      width: 32px;
      height: 32px;
      border-radius: 999px;
      display: grid;
      place-items: center;
      flex: 0 0 auto;
      font-weight: 800;
      background: rgba(255, 255, 255, 0.08);
    }
    .toast.success .toast-icon {
      color: #86efac;
      background: rgba(34, 197, 94, 0.14);
    }
    .toast.error .toast-icon {
      color: #fca5a5;
      background: rgba(239, 68, 68, 0.14);
    }
    .toast-content {
      min-width: 0;
      flex: 1;
    }
    .toast-content strong {
      display: block;
      margin-bottom: 2px;
    }
    .toast-content p {
      color: var(--text);
      font-weight: 500;
      line-height: 1.5;
    }
    .toast-close {
      border: none;
      background: transparent;
      color: var(--muted);
      font-size: 1.2rem;
      cursor: pointer;
      padding: 4px 8px;
      line-height: 1;
      border-radius: 999px;
      transition: .2s ease;
    }
    .toast-close:hover {
      color: white;
      background: rgba(255, 255, 255, 0.08);
    }
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}
}
