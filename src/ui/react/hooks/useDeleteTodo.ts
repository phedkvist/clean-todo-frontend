import { useState } from 'react';
import { useTodoUseCases } from '../context/TodoContext';

export interface UseDeleteTodoResult {
  deleteTodo: (id: string) => Promise<boolean>;
  isDeleting: boolean;
  error: string | null;
}

/**
 * Hook to delete todos
 */
export function useDeleteTodo(): UseDeleteTodoResult {
  const { deleteTodo: deleteTodoUseCase } = useTodoUseCases();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteTodo = async (id: string): Promise<boolean> => {
    try {
      setIsDeleting(true);
      setError(null);

      await deleteTodoUseCase.execute({ id });
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete todo';
      setError(errorMessage);
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteTodo,
    isDeleting,
    error,
  };
}
