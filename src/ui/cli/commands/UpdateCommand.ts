import { Command } from 'commander';
import { UpdateTodo } from '../../../use-cases/UpdateTodo.js';
import { TableFormatter } from '../formatters/TableFormatter.js';

export function createUpdateCommand(updateTodo: UpdateTodo): Command {
  const command = new Command('update');

  command
    .description('Update a todo')
    .argument('<id>', 'Todo ID (or first 8 characters)')
    .option('-t, --title <title>', 'New title')
    .option('-d, --description <description>', 'New description')
    .action(async (id: string, options) => {
      try {
        if (!options.title && !options.description) {
          console.error(
            TableFormatter.formatError(
              'Please provide at least one field to update (--title or --description)'
            )
          );
          process.exit(1);
        }

        const todo = await updateTodo.execute({
          id,
          title: options.title,
          description: options.description,
        });

        console.log(TableFormatter.formatSuccess(`Todo updated: ${todo.title.getValue()}`));
      } catch (error) {
        console.error(
          TableFormatter.formatError(
            error instanceof Error ? error.message : 'Failed to update todo'
          )
        );
        process.exit(1);
      }
    });

  return command;
}
