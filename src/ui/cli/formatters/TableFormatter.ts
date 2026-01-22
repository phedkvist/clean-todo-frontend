import chalk from 'chalk';
import { TodoViewModel } from '../../../adapters/presenters/TodoPresenter.js';

/**
 * Table formatter for CLI output
 */
export class TableFormatter {
  static formatTodoTable(todos: TodoViewModel[]): string {
    if (todos.length === 0) {
      return chalk.yellow('\nNo todos found. Add one with: todo add "Your task"\n');
    }

    const rows: string[] = [];

    // Header
    rows.push('');
    rows.push(
      chalk.bold(
        this.padRight('Status', 8) +
          this.padRight('Title', 40) +
          this.padRight('Created', 20) +
          'ID'
      )
    );
    rows.push(chalk.gray('─'.repeat(100)));

    // Rows
    for (const todo of todos) {
      const status = todo.completed ? chalk.green('✓') : chalk.yellow('○');
      const title = todo.completed
        ? chalk.gray(this.truncate(todo.title, 38))
        : this.truncate(todo.title, 38);
      const created = chalk.gray(this.padRight(todo.createdAt, 20));
      const id = chalk.dim(todo.id.substring(0, 8));

      rows.push(`${this.padRight(status, 8)}${this.padRight(title, 40)}${created}${id}`);

      // Add description if present
      if (todo.description) {
        const desc = chalk.dim(this.truncate(todo.description, 90));
        rows.push(`  ${desc}`);
      }
    }

    rows.push('');
    return rows.join('\n');
  }

  static formatStats(total: number, active: number, completed: number): string {
    return (
      chalk.bold('\nStatistics: ') +
      chalk.blue(`Total: ${total}`) +
      '  |  ' +
      chalk.yellow(`Active: ${active}`) +
      '  |  ' +
      chalk.green(`Completed: ${completed}`) +
      '\n'
    );
  }

  static formatSuccess(message: string): string {
    return chalk.green(`✓ ${message}`);
  }

  static formatError(message: string): string {
    return chalk.red(`✗ ${message}`);
  }

  static formatInfo(message: string): string {
    return chalk.blue(`ℹ ${message}`);
  }

  private static padRight(str: string, length: number): string {
    // Remove ANSI codes for length calculation
    const plainStr = str.replace(/\u001b\[[0-9;]*m/g, '');
    const padding = length - plainStr.length;
    return str + ' '.repeat(Math.max(0, padding));
  }

  private static truncate(str: string, maxLength: number): string {
    if (str.length <= maxLength) {
      return str;
    }
    return str.substring(0, maxLength - 3) + '...';
  }
}
