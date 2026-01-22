import { useState } from 'react';
import { Todo } from '../../../domain/entities/Todo';
import { useTodoUseCases } from '../context/TodoContext';

export interface UseCreateTodoResult {
  create: (title: string, description?: string) => Promise<Todo | null>;
  isCreating: boolean;
  error: string | null;
}

/**
 * Hook to create a new todo
 */
export function useCreateTodo(): UseCreateTodoResult {
  const { createTodo } = useTodoUseCases();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (title: string, description?: string): Promise<Todo | null> => {
    try {
      setIsCreating(true);
      setError(null);

      const todo = await createTodo.execute({ title, description });
      return todo;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create todo';
      setError(errorMessage);
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    create,
    isCreating,
    error,
  };
}
