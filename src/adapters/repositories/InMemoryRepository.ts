import { Todo } from '../../domain/entities/Todo.js';
import { ITodoRepository } from '../../use-cases/interfaces/ITodoRepository.js';

/**
 * In-memory implementation of ITodoRepository
 * Useful for testing and development
 */
export class InMemoryRepository implements ITodoRepository {
  private todos: Map<string, Todo> = new Map();

  async create(todo: Todo): Promise<Todo> {
    this.todos.set(todo.id.getValue(), todo);
    return todo;
  }

  async findAll(): Promise<Todo[]> {
    return Array.from(this.todos.values()).sort((a, b) => {
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  }

  async findById(id: string): Promise<Todo | null> {
    return this.todos.get(id) || null;
  }

  async update(todo: Todo): Promise<Todo> {
    this.todos.set(todo.id.getValue(), todo);
    return todo;
  }

  async delete(id: string): Promise<boolean> {
    return this.todos.delete(id);
  }

  async exists(id: string): Promise<boolean> {
    return this.todos.has(id);
  }

  // Utility method for testing
  clear(): void {
    this.todos.clear();
  }
}
