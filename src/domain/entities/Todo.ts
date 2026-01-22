import { TodoId } from '../value-objects/TodoId.js';
import { TodoTitle } from '../value-objects/TodoTitle.js';
import { TodoDescription } from '../value-objects/TodoDescription.js';
import { InvalidTodoError } from '../errors/TodoErrors.js';

/**
 * Todo Entity
 * Core business object with validation and business rules
 */
export interface TodoProps {
  id: TodoId;
  title: TodoTitle;
  description: TodoDescription;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Todo {
  private readonly props: TodoProps;

  private constructor(props: TodoProps) {
    this.props = props;
  }

  /**
   * Create a new Todo from raw data
   */
  public static create(data: {
    title: string;
    description?: string;
    id?: string;
  }): Todo {
    try {
      const now = new Date();
      return new Todo({
        id: data.id ? TodoId.from(data.id) : TodoId.create(),
        title: TodoTitle.create(data.title),
        description: data.description
          ? TodoDescription.create(data.description)
          : TodoDescription.empty(),
        completed: false,
        createdAt: now,
        updatedAt: now,
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new InvalidTodoError(error.message);
      }
      throw new InvalidTodoError('Failed to create todo');
    }
  }

  /**
   * Reconstitute a Todo from persistence (used by repositories)
   */
  public static reconstitute(props: {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): Todo {
    try {
      return new Todo({
        id: TodoId.from(props.id),
        title: TodoTitle.create(props.title),
        description: TodoDescription.create(props.description),
        completed: props.completed,
        createdAt: props.createdAt,
        updatedAt: props.updatedAt,
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new InvalidTodoError(error.message);
      }
      throw new InvalidTodoError('Failed to reconstitute todo');
    }
  }

  // Getters
  public get id(): TodoId {
    return this.props.id;
  }

  public get title(): TodoTitle {
    return this.props.title;
  }

  public get description(): TodoDescription {
    return this.props.description;
  }

  public get completed(): boolean {
    return this.props.completed;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // Business logic methods

  /**
   * Mark the todo as completed
   */
  public markAsCompleted(): Todo {
    if (this.props.completed) {
      return this; // Already completed, return same instance
    }

    return new Todo({
      ...this.props,
      completed: true,
      updatedAt: new Date(),
    });
  }

  /**
   * Mark the todo as incomplete
   */
  public markAsIncomplete(): Todo {
    if (!this.props.completed) {
      return this; // Already incomplete, return same instance
    }

    return new Todo({
      ...this.props,
      completed: false,
      updatedAt: new Date(),
    });
  }

  /**
   * Toggle completion status
   */
  public toggleCompletion(): Todo {
    return new Todo({
      ...this.props,
      completed: !this.props.completed,
      updatedAt: new Date(),
    });
  }

  /**
   * Update the todo with new data
   */
  public update(data: {
    title?: string;
    description?: string;
    completed?: boolean;
  }): Todo {
    try {
      return new Todo({
        ...this.props,
        title: data.title ? TodoTitle.create(data.title) : this.props.title,
        description:
          data.description !== undefined
            ? TodoDescription.create(data.description)
            : this.props.description,
        completed: data.completed !== undefined ? data.completed : this.props.completed,
        updatedAt: new Date(),
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new InvalidTodoError(error.message);
      }
      throw new InvalidTodoError('Failed to update todo');
    }
  }

  /**
   * Convert to plain object for persistence
   */
  public toObject(): {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: this.props.id.getValue(),
      title: this.props.title.getValue(),
      description: this.props.description.getValue(),
      completed: this.props.completed,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }

  /**
   * Check equality with another Todo
   */
  public equals(other: Todo): boolean {
    return this.props.id.equals(other.id);
  }
}
