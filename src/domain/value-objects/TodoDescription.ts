/**
 * TodoDescription Value Object
 * Encapsulates description validation rules
 */
export class TodoDescription {
  private static readonly MAX_LENGTH = 2000;

  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(description: string): TodoDescription {
    const trimmed = description.trim();

    if (trimmed.length > TodoDescription.MAX_LENGTH) {
      throw new Error(`Todo description cannot exceed ${TodoDescription.MAX_LENGTH} characters`);
    }

    return new TodoDescription(trimmed);
  }

  public static empty(): TodoDescription {
    return new TodoDescription('');
  }

  public getValue(): string {
    return this.value;
  }

  public isEmpty(): boolean {
    return this.value.length === 0;
  }

  public equals(other: TodoDescription): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }
}
