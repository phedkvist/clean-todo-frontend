# Clean Architecture Todo Frontend

A demonstration of Clean Architecture principles applied to a frontend application. The same business logic runs on React, Vue, and CLI with minimal framework-specific code.

## Project Philosophy

This project showcases how to build a frontend application where:
- **Business logic is completely independent of UI frameworks**
- **Storage can be swapped without affecting the application**
- **Testing is straightforward at every layer**
- **New UI frameworks can be added with minimal effort**

## Architecture Overview

```
┌─────────────────────────────────────────────┐
│         UI Layer (React/Vue/CLI)            │
│  - Framework-specific components & hooks    │
│  - Dependency injection                     │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│         Adapters Layer                      │
│  - Repository implementations               │
│  - Presenters/ViewModels                    │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│         Use Cases Layer                     │
│  - Application business rules               │
│  - Repository interfaces (ports)            │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│         Domain Layer                        │
│  - Entities (Todo)                          │
│  - Value Objects (TodoId, TodoTitle, etc.)  │
│  - Domain errors                            │
│  - Pure business logic (NO dependencies)    │
└─────────────────────────────────────────────┘
```

### Dependency Rule

Dependencies only point inward. The domain layer has **zero** external dependencies. Use cases only depend on the domain. Adapters depend on use cases. UI depends on adapters and use cases.

## Project Structure

```
src/
├── domain/                    # Core business logic (NO dependencies)
│   ├── entities/
│   │   └── Todo.ts           # Todo entity with business rules
│   ├── value-objects/
│   │   ├── TodoId.ts         # ID validation & generation
│   │   ├── TodoTitle.ts      # Title validation
│   │   └── TodoDescription.ts
│   └── errors/
│       └── TodoErrors.ts     # Domain-specific errors
│
├── use-cases/                # Application business rules
│   ├── interfaces/
│   │   └── ITodoRepository.ts  # Repository port (interface)
│   ├── CreateTodo.ts
│   ├── GetAllTodos.ts
│   ├── GetTodoById.ts
│   ├── UpdateTodo.ts
│   ├── DeleteTodo.ts
│   └── MarkTodoAsCompleted.ts
│
├── adapters/                 # Adapters for external systems
│   ├── repositories/
│   │   ├── InMemoryRepository.ts      # For testing
│   │   ├── LocalStorageRepository.ts  # Browser localStorage
│   │   └── FileSystemRepository.ts    # Node.js file system
│   └── presenters/
│       ├── TodoPresenter.ts           # Format single todo
│       └── TodoListPresenter.ts       # Format todo collections
│
└── ui/                       # Framework-specific UI implementations
    ├── react/
    │   ├── components/
    │   ├── hooks/
    │   ├── context/
    │   ├── App.tsx
    │   ├── main.tsx
    │   └── styles.css
    ├── vue/                  # (Coming soon)
    └── cli/
        ├── commands/
        ├── formatters/
        └── index.ts
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Running the React App

```bash
# Development mode
npm run dev:react

# Build for production
npm run build:react

# Preview production build
npm run preview:react
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Running the CLI

```bash
# List all todos
npm run todo list

# Add a new todo
npm run todo add "Your task title"

# Add a todo with description
npm run todo add "Task title" -d "Task description"

# Mark a todo as completed
npm run todo complete <todo-id>

# Mark as incomplete
npm run todo complete <todo-id> --uncomplete

# Update a todo
npm run todo update <todo-id> --title "New title"
npm run todo update <todo-id> --description "New description"

# Delete a todo (with confirmation)
npm run todo delete <todo-id> --yes

# Filter todos
npm run todo list --active      # Show only active todos
npm run todo list --completed   # Show only completed todos
```

**Note**: The CLI uses FileSystemRepository and stores todos in `~/.clean-todos.json`

## Key Features

### Domain Layer Features
- ✅ Todo creation with validation
- ✅ Title validation (1-200 characters)
- ✅ Description validation (max 2000 characters)
- ✅ Completion status tracking
- ✅ Timestamps (created/updated)
- ✅ Immutable entities (returns new instances on updates)

### Application Features
- ✅ Create todos
- ✅ View all todos
- ✅ Filter todos (all/active/completed)
- ✅ Update todo title and description
- ✅ Mark todos as completed/incomplete
- ✅ Delete todos
- ✅ Statistics (total, active, completed, progress %)
- ✅ Persistent storage (localStorage in React, file system in CLI)
- ✅ CLI interface with colored output and table formatting

## How Clean Architecture is Demonstrated

### 1. Zero Framework Coupling in Core Layers

The `domain/` and `use-cases/` folders contain **zero** imports from React, Vue, or any UI framework:

```typescript
// domain/entities/Todo.ts - Pure TypeScript, no framework imports
export class Todo {
  // Pure business logic only
}
```

### 2. Dependency Inversion

Use cases depend on the `ITodoRepository` **interface**, not concrete implementations:

```typescript
// Use case depends on interface
export class CreateTodo {
  constructor(private readonly repository: ITodoRepository) {}
}

// UI injects the concrete implementation
const repository = new LocalStorageRepository();
const createTodo = new CreateTodo(repository);
```

### 3. Easy Storage Swapping

Change storage by swapping one line in `App.tsx`:

```typescript
// Use localStorage
const repository = new LocalStorageRepository();

// Switch to in-memory (for testing)
const repository = new InMemoryRepository();

// Switch to file system (for CLI)
const repository = new FileSystemRepository();
```

### 4. Framework Independence

80%+ of the code is shared across all UI implementations:
- `domain/` - 100% shared
- `use-cases/` - 100% shared
- `adapters/` - 100% shared (except UI-specific presenters)
- `ui/` - Only this layer is framework-specific

Adding a new UI framework (like Vue or CLI) only requires implementing the UI layer.

### 5. Testable at Every Layer

Each layer can be tested independently:

```typescript
// Test domain logic (no mocks needed)
const todo = Todo.create({ title: 'Test' });
expect(todo.completed).toBe(false);

// Test use cases with mock repository
const mockRepo = new InMemoryRepository();
const createTodo = new CreateTodo(mockRepo);
await createTodo.execute({ title: 'Test' });

// Test UI with real use cases
<TodoProvider repository={new InMemoryRepository()}>
  <App />
</TodoProvider>
```

## Architecture Benefits

### ✅ Benefits Achieved

1. **Framework Independence** - Business logic doesn't know about React
2. **Easy Testing** - Each layer can be tested in isolation
3. **Storage Flexibility** - Swap between localStorage, file system, API, etc.
4. **Code Reusability** - Same logic works in React, Vue, CLI
5. **Maintainability** - Changes to one layer don't affect others
6. **Type Safety** - Full TypeScript support throughout

### 🎯 Real-World Applications

This architecture is ideal for:
- Applications that need to support multiple platforms
- Projects where business logic is complex and needs to be framework-agnostic
- Teams that want to migrate between frameworks without rewriting logic
- Applications requiring different storage strategies (online/offline)

## Next Steps

### Completed Implementations

- [x] React UI with hooks and context
- [x] CLI implementation with Commander and Chalk

### Planned Implementations

- [ ] Vue.js UI
- [ ] Unit tests for domain layer
- [ ] Integration tests for use cases
- [ ] E2E tests for React UI
- [ ] API-based repository (cloud storage)
- [ ] Undo/redo functionality
- [ ] Todo categories and tags
- [ ] Due dates and priorities

## Learn More

### Clean Architecture Resources

- [Clean Architecture by Robert C. Martin](https://www.amazon.com/Clean-Architecture-Craftsmans-Software-Structure/dp/0134494164)
- [The Clean Architecture Blog Post](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

### Key Concepts

- **Entities**: Business objects with business rules
- **Use Cases**: Application-specific business rules
- **Interface Adapters**: Convert data between use cases and external systems
- **Frameworks & Drivers**: UI, database, external interfaces

## Contributing

This is a demonstration project, but feedback and suggestions are welcome!

## License

MIT
