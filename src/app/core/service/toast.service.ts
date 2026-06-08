import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  message: string;
  type: 'success' | 'error';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _message = signal<ToastMessage | null>(null);
  private hideTimer: ReturnType<typeof setTimeout> | null = null;
  public message = this._message.asReadonly();

  show(message: string, type: 'success' | 'error' = 'success') {
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
    }

    this._message.set({ message, type });
    this.hideTimer = setTimeout(() => {
      this._message.set(null);
      this.hideTimer = null;
    }, 3000);
  }

  hide() {
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }

    this._message.set(null);
  }
}
