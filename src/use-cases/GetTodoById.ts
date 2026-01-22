import { Todo } from '../domain/entities/Todo';
import { TodoNotFoundError } from '../domain/errors/TodoErrors';
import { ITodoRepository } from './interfaces/ITodoRepository';

export interface GetTodoByIdInput {
  id: string;
}

export class GetTodoById {
  constructor(private readonly repository: ITodoRepository) {}

  async execute(input: GetTodoByIdInput): Promise<Todo> {
    const todo = await this.repository.findById(input.id);

    if (!todo) {
      throw new TodoNotFoundError(input.id);
    }

    return todo;
  }
}
