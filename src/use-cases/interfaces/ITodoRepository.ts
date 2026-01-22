import { Todo } from '../../domain/entities/Todo';

/**
 * Repository interface for Todo persistence
 * This is a port that will be implemented by adapters in the outer layers
 */
export interface ITodoRepository {
  /**
   * Create a new todo
   */
  create(todo: Todo): Promise<Todo>;

  /**
   * Find all todos
   */
  findAll(): Promise<Todo[]>;

  /**
   * Find a todo by its ID
   */
  findById(id: string): Promise<Todo | null>;

  /**
   * Update an existing todo
   */
  update(todo: Todo): Promise<Todo>;

  /**
   * Delete a todo by its ID
   */
  delete(id: string): Promise<boolean>;

  /**
   * Check if a todo exists by ID
   */
  exists(id: string): Promise<boolean>;
}
