import { Command } from 'commander';
import { MarkTodoAsCompleted } from '../../../use-cases/MarkTodoAsCompleted.js';
import { TableFormatter } from '../formatters/TableFormatter.js';

export function createCompleteCommand(markTodoAsCompleted: MarkTodoAsCompleted): Command {
  const command = new Command('complete');

  command
    .description('Toggle todo completion status')
    .argument('<id>', 'Todo ID (or first 8 characters)')
    .option('-u, --uncomplete', 'Mark as incomplete instead')
    .action(async (id: string, options) => {
      try {
        const completed = !options.uncomplete;

        const todo = await markTodoAsCompleted.execute({ id, completed });

        const status = todo.completed ? 'completed' : 'incomplete';
        console.log(
          TableFormatter.formatSuccess(`Todo marked as ${status}: ${todo.title.getValue()}`)
        );
      } catch (error) {
        console.error(
          TableFormatter.formatError(
            error instanceof Error ? error.message : 'Failed to toggle todo'
          )
        );
        process.exit(1);
      }
    });

  return command;
}
