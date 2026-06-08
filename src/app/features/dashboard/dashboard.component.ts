import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from '../../core/service/task.service';
import { AuthService } from '../../core/service/auth.service';
import { ToastService } from '../../core/service/toast.service';
import { Task } from '../../core/models/task.model';

type TaskStatusFilter = 'all' | 'pending' | 'done';
type TaskSortMode = 'newest' | 'oldest' | 'priority';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  newTitle = '';
  newCategory = '';
  newPriority: Task['priority'] = 'Média';
  searchTerm = '';
  selectedCategory = 'Todas';
  statusFilter: TaskStatusFilter = 'all';
  sortMode: TaskSortMode = 'newest';
  readonly priorityOrder: Record<Task['priority'], number> = {
    Baixa: 1,
    'Média': 2,
    Alta: 3
  };
  readonly statusOptions: Array<{ label: string; value: TaskStatusFilter }> = [
    { label: 'Todas', value: 'all' },
    { label: 'Pendentes', value: 'pending' },
    { label: 'Concluídas', value: 'done' }
  ];
  readonly sortOptions: Array<{ label: string; value: TaskSortMode }> = [
    { label: 'Mais recentes', value: 'newest' },
    { label: 'Mais antigas', value: 'oldest' },
    { label: 'Por prioridade', value: 'priority' }
  ];

  constructor(
    public taskService: TaskService,
    public auth: AuthService,
    private router: Router,
    private toast: ToastService
  ) {}

  async ngOnInit(): Promise<void> {
    const authenticated = await this.auth.ensureCurrentUser();
    if (!authenticated) {
      this.router.navigate(['/login']);
      return;
    }

    this.taskService.loadTasks();
  }

  get totalTasks(): number {
    return this.taskService.tasks().length;
  }

  get doneTasks(): number {
    return this.taskService.tasks().filter(task => task.completed).length;
  }

  get pendingTasks(): number {
    return this.taskService.tasks().filter(task => !task.completed).length;
  }

  get completionRate(): number {
    if (this.totalTasks === 0) return 0;
    return Math.round((this.doneTasks / this.totalTasks) * 100);
  }

  get categories(): string[] {
    const categories = this.taskService.tasks()
      .map(task => task.category?.trim())
      .filter(Boolean) as string[];

    const uniqueCategories = [...new Set(categories)].sort((a, b) => a.localeCompare(b));
    return ['Todas', ...uniqueCategories];
  }

  get filteredTasks(): Task[] {
    const term = this.searchTerm.trim().toLowerCase();
    let tasks = [...this.taskService.tasks()];

    if (term) {
      tasks = tasks.filter(task =>
        task.title.toLowerCase().includes(term) ||
        task.category.toLowerCase().includes(term)
      );
    }

    if (this.selectedCategory !== 'Todas') {
      tasks = tasks.filter(task => task.category === this.selectedCategory);
    }

    if (this.statusFilter === 'pending') {
      tasks = tasks.filter(task => !task.completed);
    }

    if (this.statusFilter === 'done') {
      tasks = tasks.filter(task => task.completed);
    }

    if (this.sortMode === 'priority') {
      tasks.sort((a, b) => this.priorityOrder[b.priority] - this.priorityOrder[a.priority]);
    }

    if (this.sortMode === 'oldest') {
      tasks.reverse();
    }

    return tasks;
  }

  get filteredEmptyMessage(): string {
    if (this.taskService.tasks().length === 0) {
      return 'Você ainda não tem tarefas cadastradas.';
    }
    return 'Nenhuma tarefa encontrada com os filtros atuais.';
  }

  get userName(): string {
    return this.auth.currentUser()?.nome ?? 'Usuário';
  }

  get userInitials(): string {
    const name = this.userName.trim();
    if (!name) return 'U';

    return name
      .split(/\s+/)
      .slice(0, 2)
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  }

  async createTask() {
    if (!this.newTitle.trim() || !this.newCategory.trim()) {
      this.toast.show('Preencha título e categoria', 'error');
      return;
    }

    const createdTask = await this.taskService.createTask({
      title: this.newTitle.trim(),
      category: this.newCategory.trim(),
      priority: this.newPriority
    });

    if (createdTask) {
      this.newTitle = '';
      this.newCategory = '';
      this.newPriority = 'Média';
    }
  }

  toggleTask(id: number) {
    this.taskService.toggleTask(id);
  }

  deleteTask(id: number) {
    if (confirm('Excluir esta tarefa?')) {
      this.taskService.deleteTask(id);
    }
  }

  clearCompleted() {
    this.taskService.clearCompleted();
  }

  resetFilters() {
    this.searchTerm = '';
    this.selectedCategory = 'Todas';
    this.statusFilter = 'all';
    this.sortMode = 'newest';
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  scrollToTaskForm() {
    const element = document.getElementById('taskFormSection');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  trackByTaskId(_: number, task: Task): number {
    return task.id;
  }
}
