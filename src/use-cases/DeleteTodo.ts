import { TodoNotFoundError } from '../domain/errors/TodoErrors';
import { ITodoRepository } from './interfaces/ITodoRepository';

export interface DeleteTodoInput {
  id: string;
}

export class DeleteTodo {
  constructor(private readonly repository: ITodoRepository) {}

  async execute(input: DeleteTodoInput): Promise<void> {
    // Check if todo exists
    const exists = await this.repository.exists(input.id);

    if (!exists) {
      throw new TodoNotFoundError(input.id);
    }

    // Delete the todo
    await this.repository.delete(input.id);
  }
}
