import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Task } from '../models/task.model';
import { ToastService } from './toast.service';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private API_BASE = environment.apiUrl;

  private _tasks = signal<Task[]>([]);
  private _loading = signal(false);
  public tasks = this._tasks.asReadonly();
  public loading = this._loading.asReadonly();

  constructor(private http: HttpClient, private toast: ToastService) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return new HttpHeaders(headers);
  }

  async loadTasks() {
    this._loading.set(true);
    try {
      const response = await firstValueFrom(
        this.http.get<{ success: boolean; tasks: Task[] }>(`${this.API_BASE}/tasks`, {
          headers: this.getHeaders()
        })
      );
      if (response.success) {
        this._tasks.set(response.tasks);
      }
    } catch (error) {
      this.handleError(error);
    } finally {
      this._loading.set(false);
    }
  }

  async createTask(task: Omit<Task, 'id' | 'completed'>): Promise<Task | null> {
    this._loading.set(true);
    try {
      const response = await firstValueFrom(
        this.http.post<{ success: boolean; task: Task }>(`${this.API_BASE}/tasks`, task, {
          headers: this.getHeaders()
        })
      );
      if (response.success) {
        this._tasks.update(tasks => [response.task, ...tasks]);
        this.toast.show('Tarefa criada com sucesso!', 'success');
        return response.task;
      }
      return null;
    } catch (error) {
      this.handleError(error);
      return null;
    } finally {
      this._loading.set(false);
    }
  }

  async toggleTask(id: number): Promise<void> {
    this._loading.set(true);
    try {
      const response = await firstValueFrom(
        this.http.put<{ success: boolean; task: Task }>(`${this.API_BASE}/tasks/${id}/toggle`, {}, {
          headers: this.getHeaders()
        })
      );
      if (response.success) {
        this._tasks.update(tasks =>
          tasks.map(t => t.id === id ? response.task : t)
        );
        this.toast.show(response.task.completed ? 'Tarefa concluída!' : 'Tarefa reaberta!', 'success');
      }
    } catch (error) {
      this.handleError(error);
    } finally {
      this._loading.set(false);
    }
  }

  async deleteTask(id: number): Promise<void> {
    this._loading.set(true);
    try {
      const response = await firstValueFrom(
        this.http.delete<{ success: boolean }>(`${this.API_BASE}/tasks/${id}`, {
          headers: this.getHeaders()
        })
      );
      if (response.success) {
        this._tasks.update(tasks => tasks.filter(t => t.id !== id));
        this.toast.show('Tarefa removida', 'success');
      }
    } catch (error) {
      this.handleError(error);
    } finally {
      this._loading.set(false);
    }
  }

  async clearCompleted(): Promise<void> {
    const completedTasks = this._tasks().filter(task => task.completed);
    if (completedTasks.length === 0) {
      this.toast.show('Não há tarefas concluídas para remover.', 'error');
      return;
    }

    this._loading.set(true);
    try {
      await Promise.all(
        completedTasks.map(task =>
          firstValueFrom(
            this.http.delete<{ success: boolean }>(`${this.API_BASE}/tasks/${task.id}`, {
              headers: this.getHeaders()
            })
          )
        )
      );

      this._tasks.update(tasks => tasks.filter(task => !task.completed));
      this.toast.show('Tarefas concluídas removidas.', 'success');
    } catch (error) {
      this.handleError(error);
    } finally {
      this._loading.set(false);
    }
  }

  refreshTasks(): Promise<void> {
    return this.loadTasks();
  }

  private handleError(error: unknown) {
    if (error instanceof HttpErrorResponse) {
      const message = error.error?.erro || error.message;
      this.toast.show(`Erro: ${message}`, 'error');
    } else {
      this.toast.show('Ocorreu um erro inesperado', 'error');
    }
  }
}
