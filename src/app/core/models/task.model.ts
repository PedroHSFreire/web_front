export interface Task {
  id: number;
  title: string;
  completed: boolean;
  category: string;
  priority: 'Baixa' | 'Média' | 'Alta';
}