import { Todo } from '../domain/entities/Todo';
import { ITodoRepository } from './interfaces/ITodoRepository';

export interface CreateTodoInput {
  title: string;
  description?: string;
}

export class CreateTodo {
  constructor(private readonly repository: ITodoRepository) {}

  async execute(input: CreateTodoInput): Promise<Todo> {
    // Create the todo entity (validation happens here)
    const todo = Todo.create({
      title: input.title,
      description: input.description,
    });

    // Persist the todo
    return await this.repository.create(todo);
  }
}
