import { Todo } from '../../domain/entities/Todo';
import { ITodoRepository } from '../../use-cases/interfaces/ITodoRepository';

/**
 * LocalStorage implementation of ITodoRepository
 * For browser-based applications
 */
export class LocalStorageRepository implements ITodoRepository {
  private readonly storageKey: string;

  constructor(storageKey: string = 'clean-todos') {
    this.storageKey = storageKey;
  }

  async create(todo: Todo): Promise<Todo> {
    const todos = await this.loadTodos();
    todos.push(todo);
    await this.saveTodos(todos);
    return todo;
  }

  async findAll(): Promise<Todo[]> {
    const todos = await this.loadTodos();
    return todos.sort((a, b) => {
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  }

  async findById(id: string): Promise<Todo | null> {
    const todos = await this.loadTodos();
    return todos.find((todo) => todo.id.getValue() === id) || null;
  }

  async update(todo: Todo): Promise<Todo> {
    const todos = await this.loadTodos();
    const index = todos.findIndex((t) => t.id.getValue() === todo.id.getValue());

    if (index !== -1) {
      todos[index] = todo;
      await this.saveTodos(todos);
    }

    return todo;
  }

  async delete(id: string): Promise<boolean> {
    const todos = await this.loadTodos();
    const initialLength = todos.length;
    const filtered = todos.filter((todo) => todo.id.getValue() !== id);

    if (filtered.length < initialLength) {
      await this.saveTodos(filtered);
      return true;
    }

    return false;
  }

  async exists(id: string): Promise<boolean> {
    const todos = await this.loadTodos();
    return todos.some((todo) => todo.id.getValue() === id);
  }

  private async loadTodos(): Promise<Todo[]> {
    try {
      const data = localStorage.getItem(this.storageKey);

      if (!data) {
        return [];
      }

      const parsed = JSON.parse(data);

      return parsed.map((item: any) =>
        Todo.reconstitute({
          id: item.id,
          title: item.title,
          description: item.description,
          completed: item.completed,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        })
      );
    } catch (error) {
      console.error('Failed to load todos from localStorage:', error);
      return [];
    }
  }

  private async saveTodos(todos: Todo[]): Promise<void> {
    try {
      const serialized = todos.map((todo) => todo.toObject());
      localStorage.setItem(this.storageKey, JSON.stringify(serialized));
    } catch (error) {
      console.error('Failed to save todos to localStorage:', error);
      throw new Error('Failed to persist todos');
    }
  }

  // Utility method for testing/cleanup
  async clear(): Promise<void> {
    localStorage.removeItem(this.storageKey);
  }
}
