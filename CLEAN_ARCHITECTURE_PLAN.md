# Clean Architecture Frontend - TODO Application Plan

## Project Overview

This project demonstrates Clean Architecture principles applied to a frontend application. The core business logic remains completely independent of UI frameworks, allowing the same application to run on React, Vue, and CLI with minimal framework-specific code.

## Core Principles

1. **Independence of Frameworks** - Business logic doesn't depend on React, Vue, or any UI library
2. **Testability** - Business rules can be tested without UI, database, or external dependencies
3. **Independence of UI** - UI can change without affecting business rules
4. **Independence of Storage** - Can swap between localStorage, file system, or any storage mechanism
5. **Dependency Rule** - Dependencies point inward; inner layers know nothing about outer layers

## Architecture Layers

### 1. Domain Layer (Core/Innermost)
**Location**: `/src/domain/`

Contains pure business logic with zero external dependencies.

#### Entities
- **Todo Entity**
  - `id: string` - Unique identifier
  - `title: string` - Todo title
  - `description: string` - Detailed description
  - `completed: boolean` - Completion status
  - `createdAt: Date` - Creation timestamp
  - `updatedAt: Date` - Last update timestamp

#### Value Objects
- **TodoId** - Encapsulates ID validation and generation logic
- **TodoTitle** - Encapsulates title validation (min/max length, non-empty)
- **TodoDescription** - Encapsulates description validation

#### Domain Errors
- `InvalidTodoError` - Invalid todo data
- `TodoNotFoundError` - Todo doesn't exist
- `DuplicateTodoError` - Todo already exists

### 2. Use Cases Layer (Application Layer)
**Location**: `/src/use-cases/`

Contains application-specific business rules. Orchestrates data flow between entities and interfaces.

#### Use Cases (Interactors)
- **CreateTodo**
  - Input: `{ title, description }`
  - Output: Created Todo entity
  - Business rules: Validate title, generate ID, set timestamps

- **GetAllTodos**
  - Input: None or filter criteria
  - Output: Array of Todo entities
  - Business rules: Retrieve and sort todos

- **GetTodoById**
  - Input: `{ id }`
  - Output: Single Todo entity
  - Business rules: Validate ID exists

- **UpdateTodo**
  - Input: `{ id, title?, description?, completed? }`
  - Output: Updated Todo entity
  - Business rules: Validate exists, validate fields, update timestamp

- **DeleteTodo**
  - Input: `{ id }`
  - Output: Success boolean
  - Business rules: Validate exists, remove from storage

- **MarkTodoAsCompleted**
  - Input: `{ id }`
  - Output: Updated Todo entity
  - Business rules: Toggle completion status, update timestamp

#### Repository Interfaces (Ports)
- **ITodoRepository**
  ```typescript
  interface ITodoRepository {
    create(todo: Todo): Promise<Todo>
    findAll(): Promise<Todo[]>
    findById(id: string): Promise<Todo | null>
    update(id: string, data: Partial<Todo>): Promise<Todo>
    delete(id: string): Promise<boolean>
  }
  ```

### 3. Interface Adapters Layer
**Location**: `/src/adapters/`

Converts data between use cases and external agencies (UI, storage, etc.)

#### Repository Implementations (Adapters)
- **LocalStorageRepository** - Browser localStorage implementation
  - `create()` - Serialize and store in localStorage
  - `findAll()` - Deserialize from localStorage
  - `findById()` - Find specific todo
  - `update()` - Update and re-serialize
  - `delete()` - Remove from localStorage

- **FileSystemRepository** - Node.js file system implementation
  - Uses `fs` to read/write JSON file
  - Same interface as LocalStorageRepository
  - File location: `~/.todos.json` or configurable path

- **InMemoryRepository** - For testing
  - Simple Map-based storage
  - No persistence

#### Presenters/ViewModels
- **TodoPresenter** - Formats Todo entities for display
  - Converts Date to readable strings
  - Formats completion status
  - Provides display-ready data

- **TodoListPresenter** - Formats collections of todos
  - Groups by status (completed/active)
  - Sorts by date
  - Calculates statistics (total, completed count)

### 4. Frameworks & Drivers Layer (Outermost)
**Location**: `/src/ui/`

Contains framework-specific implementations.

#### React Implementation
**Location**: `/src/ui/react/`

- **Components**
  - `TodoList` - Displays list of todos
  - `TodoItem` - Individual todo display
  - `CreateTodoForm` - Form to create new todo
  - `EditTodoModal` - Modal for editing
  - `TodoStats` - Statistics display

- **Hooks**
  - `useTodos()` - Manages todo state and operations
  - `useCreateTodo()` - Create todo logic
  - `useUpdateTodo()` - Update todo logic

- **Dependency Injection**
  - Context provider for repository injection
  - Custom hooks consume use cases

#### Vue Implementation
**Location**: `/src/ui/vue/`

- **Components**
  - `TodoList.vue`
  - `TodoItem.vue`
  - `CreateTodoForm.vue`
  - `EditTodoModal.vue`
  - `TodoStats.vue`

- **Composables**
  - `useTodos()` - Composition API for todo management
  - `useCreateTodo()`
  - `useUpdateTodo()`

- **Dependency Injection**
  - Provide/inject for repository
  - Plugin for use case registration

#### CLI Implementation
**Location**: `/src/ui/cli/`

- **Commands**
  - `todo list` - List all todos
  - `todo add <title> [description]` - Create todo
  - `todo complete <id>` - Mark as completed
  - `todo update <id> [options]` - Update todo
  - `todo delete <id>` - Delete todo

- **Presenters**
  - Table formatter for list view
  - Color coding for status
  - ASCII art for empty states

- **Dependencies**
  - Commander.js or similar for CLI parsing
  - Chalk for colors
  - Uses FileSystemRepository

## Project Structure

```
clean-todo-frontend/
├── src/
│   ├── domain/
│   │   ├── entities/
│   │   │   └── Todo.ts
│   │   ├── value-objects/
│   │   │   ├── TodoId.ts
│   │   │   ├── TodoTitle.ts
│   │   │   └── TodoDescription.ts
│   │   └── errors/
│   │       └── TodoErrors.ts
│   ├── use-cases/
│   │   ├── CreateTodo.ts
│   │   ├── GetAllTodos.ts
│   │   ├── GetTodoById.ts
│   │   ├── UpdateTodo.ts
│   │   ├── DeleteTodo.ts
│   │   ├── MarkTodoAsCompleted.ts
│   │   └── interfaces/
│   │       └── ITodoRepository.ts
│   ├── adapters/
│   │   ├── repositories/
│   │   │   ├── LocalStorageRepository.ts
│   │   │   ├── FileSystemRepository.ts
│   │   │   └── InMemoryRepository.ts
│   │   └── presenters/
│   │       ├── TodoPresenter.ts
│   │       └── TodoListPresenter.ts
│   └── ui/
│       ├── react/
│       │   ├── components/
│       │   ├── hooks/
│       │   ├── context/
│       │   └── App.tsx
│       ├── vue/
│       │   ├── components/
│       │   ├── composables/
│       │   ├── plugins/
│       │   └── App.vue
│       └── cli/
│           ├── commands/
│           ├── formatters/
│           └── index.ts
├── tests/
│   ├── domain/
│   ├── use-cases/
│   ├── adapters/
│   └── ui/
└── README.md
```

## Implementation Phases

### Phase 1: Domain Layer
1. Create Todo entity with validation
2. Implement value objects (TodoId, TodoTitle, TodoDescription)
3. Define domain errors
4. Write unit tests for domain logic

### Phase 2: Use Cases Layer
1. Define ITodoRepository interface
2. Implement CreateTodo use case
3. Implement GetAllTodos use case
4. Implement GetTodoById use case
5. Implement UpdateTodo use case
6. Implement DeleteTodo use case
7. Implement MarkTodoAsCompleted use case
8. Write unit tests with mock repository

### Phase 3: Adapters Layer
1. Implement InMemoryRepository (for testing)
2. Implement LocalStorageRepository (for web)
3. Implement FileSystemRepository (for CLI)
4. Implement TodoPresenter
5. Implement TodoListPresenter
6. Write integration tests

### Phase 4: React UI
1. Set up React project structure
2. Create repository context provider
3. Implement useTodos hook
4. Build TodoList component
5. Build TodoItem component
6. Build CreateTodoForm component
7. Build EditTodoModal component
8. Build TodoStats component
9. Wire everything together in App.tsx

### Phase 5: Vue UI
1. Set up Vue project structure
2. Create repository plugin
3. Implement useTodos composable
4. Build TodoList.vue component
5. Build TodoItem.vue component
6. Build CreateTodoForm.vue component
7. Build EditTodoModal.vue component
8. Build TodoStats.vue component
9. Wire everything together in App.vue

### Phase 6: CLI UI
1. Set up CLI project with Commander.js
2. Implement list command
3. Implement add command
4. Implement complete command
5. Implement update command
6. Implement delete command
7. Add table formatting
8. Add color coding
9. Make CLI executable

### Phase 7: Documentation & Polish
1. Write comprehensive README
2. Document architecture decisions
3. Add code examples
4. Create diagram of dependency flow
5. Add E2E tests for each UI
6. Performance optimization

## Key Concepts Demonstrated

### 1. Dependency Inversion
- Use cases depend on ITodoRepository interface
- Concrete repositories implement the interface
- UI provides the concrete implementation at runtime

### 2. Single Responsibility
- Each use case does one thing
- Each entity manages its own validation
- Each adapter converts data for one specific framework

### 3. Open/Closed Principle
- Can add new storage implementations without changing use cases
- Can add new UI frameworks without changing business logic

### 4. Interface Segregation
- Small, focused interfaces
- Clients only depend on methods they use

### 5. Liskov Substitution
- Any ITodoRepository implementation is interchangeable
- UI doesn't know or care which repository is used

## Testing Strategy

### Domain Layer Tests
- Unit tests for entities
- Unit tests for value objects
- Test validation rules
- No mocks needed (pure logic)

### Use Cases Tests
- Unit tests with mock repository
- Test business rules
- Test error handling
- Test edge cases

### Adapters Tests
- Integration tests for repositories
- Test with real localStorage/filesystem
- Test serialization/deserialization
- Test error handling

### UI Tests
- Component tests (isolated)
- Integration tests (with InMemoryRepository)
- E2E tests (full flow)

## Build Configuration

### React Build
- Vite or Create React App
- Bundle size optimization
- Tree shaking

### Vue Build
- Vite
- Bundle size optimization
- Tree shaking

### CLI Build
- TypeScript compilation
- Create executable with shebang
- Package as npm module

## Success Metrics

1. **Zero framework coupling in domain/use-cases** - No imports from React, Vue, or Node.js
2. **Shared code percentage** - 80%+ of code is shared across all UIs
3. **Test coverage** - 90%+ for domain and use-cases layers
4. **Easy framework swap** - Can add new UI in < 1 day
5. **Easy storage swap** - Can add new storage in < 2 hours

## Future Enhancements

1. Add filtering (by status, date, search)
2. Add sorting options
3. Add todo categories/tags
4. Add due dates
5. Add priority levels
6. Add undo/redo functionality
7. Add data synchronization across UIs
8. Add cloud storage adapter (API repository)
9. Add mobile UI (React Native)
10. Add desktop UI (Electron)
