#!/usr/bin/env node

import { Command } from 'commander';
import { FileSystemRepository } from '../../adapters/repositories/FileSystemRepository.js';
import { CreateTodo } from '../../use-cases/CreateTodo.js';
import { GetAllTodos } from '../../use-cases/GetAllTodos.js';
import { UpdateTodo } from '../../use-cases/UpdateTodo.js';
import { DeleteTodo } from '../../use-cases/DeleteTodo.js';
import { MarkTodoAsCompleted } from '../../use-cases/MarkTodoAsCompleted.js';
import { createListCommand } from './commands/ListCommand.js';
import { createAddCommand } from './commands/AddCommand.js';
import { createCompleteCommand } from './commands/CompleteCommand.js';
import { createUpdateCommand } from './commands/UpdateCommand.js';
import { createDeleteCommand } from './commands/DeleteCommand.js';

/**
 * CLI Application Entry Point
 * This is the ONLY place in the CLI where we decide which repository to use
 */

// Initialize repository - using FileSystemRepository for CLI
const repository = new FileSystemRepository();

// Initialize use cases with the repository
const createTodo = new CreateTodo(repository);
const getAllTodos = new GetAllTodos(repository);
const updateTodo = new UpdateTodo(repository);
const deleteTodo = new DeleteTodo(repository);
const markTodoAsCompleted = new MarkTodoAsCompleted(repository);

// Create CLI program
const program = new Command();

program
  .name('todo')
  .description('Clean Architecture TODO CLI')
  .version('1.0.0');

// Add commands
program.addCommand(createListCommand(getAllTodos));
program.addCommand(createAddCommand(createTodo));
program.addCommand(createCompleteCommand(markTodoAsCompleted));
program.addCommand(createUpdateCommand(updateTodo));
program.addCommand(createDeleteCommand(deleteTodo));

// Parse command line arguments
program.parse(process.argv);
