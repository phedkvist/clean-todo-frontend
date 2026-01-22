/**
 * Domain-specific errors for Todo operations
 */

export class TodoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TodoError';
    Object.setPrototypeOf(this, TodoError.prototype);
  }
}

export class InvalidTodoError extends TodoError {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidTodoError';
    Object.setPrototypeOf(this, InvalidTodoError.prototype);
  }
}

export class TodoNotFoundError extends TodoError {
  constructor(id: string) {
    super(`Todo with id '${id}' not found`);
    this.name = 'TodoNotFoundError';
    Object.setPrototypeOf(this, TodoNotFoundError.prototype);
  }
}

export class DuplicateTodoError extends TodoError {
  constructor(id: string) {
    super(`Todo with id '${id}' already exists`);
    this.name = 'DuplicateTodoError';
    Object.setPrototypeOf(this, DuplicateTodoError.prototype);
  }
}
