import { Command } from 'commander';
import { DeleteTodo } from '../../../use-cases/DeleteTodo.js';
import { TableFormatter } from '../formatters/TableFormatter.js';

export function createDeleteCommand(deleteTodo: DeleteTodo): Command {
  const command = new Command('delete');

  command
    .description('Delete a todo')
    .argument('<id>', 'Todo ID (or first 8 characters)')
    .option('-y, --yes', 'Skip confirmation')
    .action(async (id: string, options) => {
      try {
        // In a real CLI, we'd use a prompt library for confirmation
        // For simplicity, we'll just use the --yes flag
        if (!options.yes) {
          console.log(
            TableFormatter.formatInfo(
              'Use --yes flag to confirm deletion, or implement interactive prompt'
            )
          );
          console.log(TableFormatter.formatInfo(`To delete, run: todo delete ${id} --yes`));
          return;
        }

        await deleteTodo.execute({ id });

        console.log(TableFormatter.formatSuccess('Todo deleted successfully'));
      } catch (error) {
        console.error(
          TableFormatter.formatError(
            error instanceof Error ? error.message : 'Failed to delete todo'
          )
        );
        process.exit(1);
      }
    });

  return command;
}
