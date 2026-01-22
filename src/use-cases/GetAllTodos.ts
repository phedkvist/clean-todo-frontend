import { Todo } from '../domain/entities/Todo';
import { ITodoRepository } from './interfaces/ITodoRepository';

export interface GetAllTodosInput {
  filterCompleted?: boolean; // undefined = all, true = only completed, false = only active
}

export class GetAllTodos {
  constructor(private readonly repository: ITodoRepository) {}

  async execute(input: GetAllTodosInput = {}): Promise<Todo[]> {
    const todos = await this.repository.findAll();

    // Apply filter if specified
    if (input.filterCompleted !== undefined) {
      return todos.filter((todo) => todo.completed === input.filterCompleted);
    }

    return todos;
  }
}
