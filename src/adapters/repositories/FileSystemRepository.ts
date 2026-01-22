import { Todo } from '../../domain/entities/Todo.js';
import { ITodoRepository } from '../../use-cases/interfaces/ITodoRepository.js';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

/**
 * FileSystem implementation of ITodoRepository
 * For CLI and Node.js applications
 */
export class FileSystemRepository implements ITodoRepository {
  private readonly filePath: string;

  constructor(filePath?: string) {
    this.filePath = filePath || path.join(os.homedir(), '.clean-todos.json');
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
      const data = await fs.readFile(this.filePath, 'utf-8');
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
    } catch (error: any) {
      // File doesn't exist yet, return empty array
      if (error.code === 'ENOENT') {
        return [];
      }
      console.error('Failed to load todos from file:', error);
      return [];
    }
  }

  private async saveTodos(todos: Todo[]): Promise<void> {
    try {
      const serialized = todos.map((todo) => todo.toObject());
      const dir = path.dirname(this.filePath);

      // Ensure directory exists
      await fs.mkdir(dir, { recursive: true });

      // Write to file
      await fs.writeFile(this.filePath, JSON.stringify(serialized, null, 2), 'utf-8');
    } catch (error) {
      console.error('Failed to save todos to file:', error);
      throw new Error('Failed to persist todos');
    }
  }

  // Utility method for testing/cleanup
  async clear(): Promise<void> {
    try {
      await fs.unlink(this.filePath);
    } catch (error: any) {
      // Ignore if file doesn't exist
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }

  getFilePath(): string {
    return this.filePath;
  }
}
