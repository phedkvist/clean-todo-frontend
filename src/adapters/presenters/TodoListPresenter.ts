import { Todo } from '../../domain/entities/Todo.js';
import { TodoPresenter, TodoViewModel } from './TodoPresenter.js';

/**
 * View model for a list of Todos with statistics
 */
export interface TodoListViewModel {
  todos: TodoViewModel[];
  activeTodos: TodoViewModel[];
  completedTodos: TodoViewModel[];
  totalCount: number;
  activeCount: number;
  completedCount: number;
  completionPercentage: number;
}

/**
 * TodoListPresenter - Formats collections of todos with statistics
 */
export class TodoListPresenter {
  static toViewModel(todos: Todo[]): TodoListViewModel {
    const viewModels = TodoPresenter.toViewModelList(todos);
    const activeTodos = viewModels.filter((todo) => !todo.completed);
    const completedTodos = viewModels.filter((todo) => todo.completed);

    const totalCount = viewModels.length;
    const activeCount = activeTodos.length;
    const completedCount = completedTodos.length;
    const completionPercentage =
      totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return {
      todos: viewModels,
      activeTodos,
      completedTodos,
      totalCount,
      activeCount,
      completedCount,
      completionPercentage,
    };
  }

  static formatStatsForCLI(viewModel: TodoListViewModel): string {
    const { totalCount, activeCount, completedCount, completionPercentage } = viewModel;

    return `
Total: ${totalCount} | Active: ${activeCount} | Completed: ${completedCount} | Progress: ${completionPercentage}%
    `.trim();
  }
}
