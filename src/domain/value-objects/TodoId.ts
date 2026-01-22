/**
 * TodoId Value Object
 * Encapsulates ID validation and generation logic
 */
export class TodoId {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(id?: string): TodoId {
    if (id) {
      return new TodoId(id);
    }
    // Generate UUID v4
    return new TodoId(TodoId.generateUUID());
  }

  public static from(id: string): TodoId {
    if (!id || id.trim().length === 0) {
      throw new Error('TodoId cannot be empty');
    }
    return new TodoId(id);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: TodoId): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }

  private static generateUUID(): string {
    // Simple UUID v4 implementation without external dependencies
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
