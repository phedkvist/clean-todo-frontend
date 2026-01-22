import { Command } from 'commander';
import { GetAllTodos } from '../../../use-cases/GetAllTodos.js';
import { TodoPresenter } from '../../../adapters/presenters/TodoPresenter.js';
import { TodoListPresenter } from '../../../adapters/presenters/TodoListPresenter.js';
import { TableFormatter } from '../formatters/TableFormatter.js';

export function createListCommand(getAllTodos: GetAllTodos): Command {
  const command = new Command('list');

  command
    .description('List all todos')
    .option('-a, --active', 'Show only active todos')
    .option('-c, --completed', 'Show only completed todos')
    .action(async (options) => {
      try {
        let filterCompleted: boolean | undefined = undefined;

        if (options.active) {
          filterCompleted = false;
        } else if (options.completed) {
          filterCompleted = true;
        }

        const todos = await getAllTodos.execute({ filterCompleted });
        const viewModels = TodoPresenter.toViewModelList(todos);
        const listViewModel = TodoListPresenter.toViewModel(todos);

        // Print table
        console.log(TableFormatter.formatTodoTable(viewModels));

        // Print stats
        console.log(
          TableFormatter.formatStats(
            listViewModel.totalCount,
            listViewModel.activeCount,
            listViewModel.completedCount
          )
        );
      } catch (error) {
        console.error(
          TableFormatter.formatError(
            error instanceof Error ? error.message : 'Failed to list todos'
          )
        );
        process.exit(1);
      }
    });

  return command;
}
