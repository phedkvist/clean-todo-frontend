import { Todo } from '../domain/entities/Todo.js';
import { TodoNotFoundError } from '../domain/errors/TodoErrors.js';
import { ITodoRepository } from './interfaces/ITodoRepository.js';

export interface UpdateTodoInput {
  id: string;
  title?: string;
  description?: string;
  completed?: boolean;
}

export class UpdateTodo {
  constructor(private readonly repository: ITodoRepository) {}

  async execute(input: UpdateTodoInput): Promise<Todo> {
    // Find the existing todo
    const existingTodo = await this.repository.findById(input.id);

    if (!existingTodo) {
      throw new TodoNotFoundError(input.id);
    }

    // Update the todo (validation happens in the entity)
    const updatedTodo = existingTodo.update({
      title: input.title,
      description: input.description,
      completed: input.completed,
    });

    // Persist the updated todo
    return await this.repository.update(updatedTodo);
  }
}
