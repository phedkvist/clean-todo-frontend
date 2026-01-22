import { Todo } from '../../domain/entities/Todo.js';

/**
 * View model for a single Todo
 */
export interface TodoViewModel {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  createdAtDate: Date;
  updatedAtDate: Date;
}

/**
 * TodoPresenter - Formats Todo entities for display
 */
export class TodoPresenter {
  static toViewModel(todo: Todo): TodoViewModel {
    return {
      id: todo.id.getValue(),
      title: todo.title.getValue(),
      description: todo.description.getValue(),
      completed: todo.completed,
      createdAt: this.formatDate(todo.createdAt),
      updatedAt: this.formatDate(todo.updatedAt),
      createdAtDate: todo.createdAt,
      updatedAtDate: todo.updatedAt,
    };
  }

  static toViewModelList(todos: Todo[]): TodoViewModel[] {
    return todos.map((todo) => this.toViewModel(todo));
  }

  private static formatDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) {
      return 'just now';
    } else if (minutes < 60) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (days < 7) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  }

  static formatForCLI(todo: Todo): string {
    const status = todo.completed ? '✓' : '○';
    const title = todo.title.getValue();
    const desc = todo.description.getValue();

    let output = `${status} ${title}`;
    if (desc) {
      output += `\n  ${desc}`;
    }
    output += `\n  ID: ${todo.id.getValue()}`;
    output += `\n  Created: ${this.formatDate(todo.createdAt)}`;

    return output;
  }
}
