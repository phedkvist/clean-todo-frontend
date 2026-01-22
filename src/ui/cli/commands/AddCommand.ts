import { Command } from 'commander';
import { CreateTodo } from '../../../use-cases/CreateTodo.js';
import { TableFormatter } from '../formatters/TableFormatter.js';

export function createAddCommand(createTodo: CreateTodo): Command {
  const command = new Command('add');

  command
    .description('Add a new todo')
    .argument('<title>', 'Todo title')
    .option('-d, --description <description>', 'Todo description')
    .action(async (title: string, options) => {
      try {
        const todo = await createTodo.execute({
          title,
          description: options.description,
        });

        console.log(TableFormatter.formatSuccess(`Todo created: ${todo.title.getValue()}`));
        console.log(TableFormatter.formatInfo(`ID: ${todo.id.getValue()}`));
      } catch (error) {
        console.error(
          TableFormatter.formatError(
            error instanceof Error ? error.message : 'Failed to create todo'
          )
        );
        process.exit(1);
      }
    });

  return command;
}
