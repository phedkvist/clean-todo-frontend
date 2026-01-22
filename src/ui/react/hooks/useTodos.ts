import { useState, useEffect, useCallback } from 'react';
import { TodoListViewModel } from '../../../adapters/presenters/TodoListPresenter';
import { TodoListPresenter } from '../../../adapters/presenters/TodoListPresenter';
import { useTodoUseCases } from '../context/TodoContext';

export interface UseTodosResult {
  viewModel: TodoListViewModel | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * Hook to fetch and manage all todos
 */
export function useTodos(filterCompleted?: boolean): UseTodosResult {
  const { getAllTodos } = useTodoUseCases();
  const [viewModel, setViewModel] = useState<TodoListViewModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await getAllTodos.execute({ filterCompleted });

      const vm = TodoListPresenter.toViewModel(result);
      setViewModel(vm);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch todos');
      setViewModel(null);
    } finally {
      setIsLoading(false);
    }
  }, [getAllTodos, filterCompleted]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return {
    viewModel,
    isLoading,
    error,
    refresh: fetchTodos,
  };
}
