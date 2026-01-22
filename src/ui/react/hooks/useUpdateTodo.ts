import { useState } from 'react';
import { Todo } from '../../../domain/entities/Todo';
import { useTodoUseCases } from '../context/TodoContext';

export interface UseUpdateTodoResult {
  update: (
    id: string,
    data: { title?: string; description?: string; completed?: boolean }
  ) => Promise<Todo | null>;
  toggleComplete: (id: string, completed: boolean) => Promise<Todo | null>;
  isUpdating: boolean;
  error: string | null;
}

/**
 * Hook to update todos
 */
export function useUpdateTodo(): UseUpdateTodoResult {
  const { updateTodo, markTodoAsCompleted } = useTodoUseCases();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = async (
    id: string,
    data: { title?: string; description?: string; completed?: boolean }
  ): Promise<Todo | null> => {
    try {
      setIsUpdating(true);
      setError(null);

      const todo = await updateTodo.execute({ id, ...data });
      return todo;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update todo';
      setError(errorMessage);
      return null;
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleComplete = async (id: string, completed: boolean): Promise<Todo | null> => {
    try {
      setIsUpdating(true);
      setError(null);

      const todo = await markTodoAsCompleted.execute({ id, completed });
      return todo;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle todo';
      setError(errorMessage);
      return null;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    update,
    toggleComplete,
    isUpdating,
    error,
  };
}
