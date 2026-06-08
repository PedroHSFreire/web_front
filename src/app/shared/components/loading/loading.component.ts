import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../core/service/task.service';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-overlay" *ngIf="taskService.loading()">
      <div class="loading-card" role="status" aria-live="polite">
        <div class="spinner" aria-hidden="true"></div>
        <strong>Carregando</strong>
      </div>
    </div>
  `,
  styles: [`
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(5, 10, 18, 0.76);
      backdrop-filter: blur(18px);
      z-index: 2000;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 24px;
    }
    .loading-card {
      display: grid;
      gap: 12px;
      place-items: center;
      text-align: center;
      padding: 24px 26px;
      border-radius: 20px;
      background: rgba(14, 20, 34, 0.92);
      border: 1px solid var(--border);
      box-shadow: var(--shadow);
      min-width: 180px;
    }
    .spinner {
      width: 46px;
      height: 46px;
      border: 4px solid rgba(124, 140, 255, 0.18);
      border-top: 4px solid #7c8cff;
      border-radius: 50%;
      animation: spin .9s linear infinite;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class LoadingComponent {
  constructor(public taskService: TaskService) {}
}
