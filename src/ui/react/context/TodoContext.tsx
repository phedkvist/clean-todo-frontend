import { createContext, useContext, ReactNode } from 'react';
import { ITodoRepository } from '../../../use-cases/interfaces/ITodoRepository';
import { CreateTodo } from '../../../use-cases/CreateTodo';
import { GetAllTodos } from '../../../use-cases/GetAllTodos';
import { GetTodoById } from '../../../use-cases/GetTodoById';
import { UpdateTodo } from '../../../use-cases/UpdateTodo';
import { DeleteTodo } from '../../../use-cases/DeleteTodo';
import { MarkTodoAsCompleted } from '../../../use-cases/MarkTodoAsCompleted';

/**
 * Use cases container for dependency injection
 */
export interface TodoUseCases {
  createTodo: CreateTodo;
  getAllTodos: GetAllTodos;
  getTodoById: GetTodoById;
  updateTodo: UpdateTodo;
  deleteTodo: DeleteTodo;
  markTodoAsCompleted: MarkTodoAsCompleted;
}

const TodoContext = createContext<TodoUseCases | null>(null);

interface TodoProviderProps {
  repository: ITodoRepository;
  children: ReactNode;
}

/**
 * Provider component that injects the repository into use cases
 * This is the only place where the UI knows about the repository implementation
 */
export function TodoProvider({ repository, children }: TodoProviderProps) {
  const useCases: TodoUseCases = {
    createTodo: new CreateTodo(repository),
    getAllTodos: new GetAllTodos(repository),
    getTodoById: new GetTodoById(repository),
    updateTodo: new UpdateTodo(repository),
    deleteTodo: new DeleteTodo(repository),
    markTodoAsCompleted: new MarkTodoAsCompleted(repository),
  };

  return <TodoContext.Provider value={useCases}>{children}</TodoContext.Provider>;
}

/**
 * Hook to access use cases
 */
export function useTodoUseCases(): TodoUseCases {
  const context = useContext(TodoContext);

  if (!context) {
    throw new Error('useTodoUseCases must be used within TodoProvider');
  }

  return context;
}
