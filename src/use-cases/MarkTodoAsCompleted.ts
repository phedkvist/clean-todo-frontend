import { Todo } from '../domain/entities/Todo.js';
import { TodoNotFoundError } from '../domain/errors/TodoErrors.js';
import { ITodoRepository } from './interfaces/ITodoRepository.js';

export interface MarkTodoAsCompletedInput {
  id: string;
  completed: boolean;
}

export class MarkTodoAsCompleted {
  constructor(private readonly repository: ITodoRepository) {}

  async execute(input: MarkTodoAsCompletedInput): Promise<Todo> {
    // Find the existing todo
    const existingTodo = await this.repository.findById(input.id);

    if (!existingTodo) {
      throw new TodoNotFoundError(input.id);
    }

    // Toggle completion status using domain logic
    const updatedTodo = input.completed
      ? existingTodo.markAsCompleted()
      : existingTodo.markAsIncomplete();

    // If no change, return existing todo
    if (updatedTodo === existingTodo) {
      return existingTodo;
    }

    // Persist the updated todo
    return await this.repository.update(updatedTodo);
  }
}
