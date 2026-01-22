/**
 * TodoTitle Value Object
 * Encapsulates title validation rules
 */
export class TodoTitle {
  private static readonly MIN_LENGTH = 1;
  private static readonly MAX_LENGTH = 200;

  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(title: string): TodoTitle {
    const trimmed = title.trim();

    if (trimmed.length < TodoTitle.MIN_LENGTH) {
      throw new Error('Todo title cannot be empty');
    }

    if (trimmed.length > TodoTitle.MAX_LENGTH) {
      throw new Error(`Todo title cannot exceed ${TodoTitle.MAX_LENGTH} characters`);
    }

    return new TodoTitle(trimmed);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: TodoTitle): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }
}
