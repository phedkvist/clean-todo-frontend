# Clean Architecture - Questions & Answers

## Q: Can you really claim Clean Architecture if you depend on Node.js to run the CLI? Where do we draw the line? Node is okay, but Node with jsdom is not?

**Great question!** This touches on a fundamental misconception about Clean Architecture. Let's break it down:

### What Clean Architecture Actually Says

Clean Architecture isn't about having **zero dependencies** - it's about having **zero dependencies on frameworks and UI delivery mechanisms** in your **business logic**.

The key distinction is:

**❌ What's Forbidden in Domain/Use Cases:**
- UI frameworks (React, Vue, Angular, Svelte)
- Web frameworks (Express, Fastify, NestJS)
- Specific databases (MongoDB, PostgreSQL drivers)
- External libraries that couple to frameworks

**✅ What's Allowed:**
- JavaScript/TypeScript language runtime (Node.js, Deno, Bun, Browser)
- Standard library features (Map, Set, Date, Promise, Array)
- Platform APIs through **abstractions** (filesystem through repository interface)
- Pure utility libraries (lodash, date-fns - though use sparingly)

### Why Node.js is Different from React

Let's look at our actual code structure:

```typescript
// ✅ Domain Layer - NO framework dependencies
// src/domain/entities/Todo.ts
export class Todo {
  // Uses only JavaScript primitives and our own types
  // Could run in Node, Deno, Browser, or even embedded JS runtime
  private readonly props: TodoProps;

  public markAsCompleted(): Todo {
    // Pure business logic - no external dependencies
  }
}

// ✅ Use Cases Layer - Only depends on abstractions
// src/use-cases/CreateTodo.ts
export class CreateTodo {
  constructor(private readonly repository: ITodoRepository) {}
  // ↑ Depends on INTERFACE, not concrete implementation
}

// ✅ Adapter Layer - Platform dependencies isolated HERE
// src/adapters/repositories/FileSystemRepository.ts
import * as fs from 'fs/promises';  // ← Node-specific dependency

export class FileSystemRepository implements ITodoRepository {
  // Node dependency is in the ADAPTER layer, not the domain
  // This is EXACTLY where it should be
}
```

**The business logic doesn't know Node.js exists.** It only knows about the `ITodoRepository` interface.

### The Dependency Hierarchy

```
┌─────────────────────────────────────┐
│  Runtime (Node.js, Deno, Browser)  │  ← Platform/Runtime
└────────────┬────────────────────────┘
             │
┌────────────▼────────────────────────┐
│  Framework (React, Express, etc.)  │  ← Clean Architecture forbids this in core
└────────────┬────────────────────────┘
             │
┌────────────▼────────────────────────┐
│  Business Logic (Domain + Uses)    │  ← Must be framework-agnostic
└─────────────────────────────────────┘
```

**Our architecture adheres to this:**
- ✅ **Domain layer**: Pure TypeScript - runs anywhere JavaScript runs
- ✅ **Use Cases**: TypeScript + interfaces - still completely portable
- ✅ **Adapters**: Platform-specific (`fs` for Node, `localStorage` for Browser)
- ✅ **UI**: Framework-specific (React components, CLI commands)

### What This Project Demonstrates

**We ARE framework-agnostic where it matters:**

1. **Same business logic in React AND CLI** - Zero duplication
2. **Could easily add Vue, Svelte, or Angular** - Just implement UI layer
3. **Could swap Node for Deno** by changing ONE file:
   ```typescript
   // Before (Node)
   import * as fs from 'fs/promises';

   // After (Deno)
   const fs = {
     readFile: (path: string) => Deno.readTextFile(path),
     writeFile: (path: string, data: string) => Deno.writeTextFile(path, data)
   };
   ```
4. **Could add a REST API** by adding an HTTP adapter - business logic unchanged
5. **Easy to test** - Use `InMemoryRepository` for tests, no mocking frameworks needed

### The Honest Answer

**We're not 100% runtime-agnostic** because:
- We use Node.js runtime features (but only in adapters)
- We import `fs` from Node (but through the repository pattern)
- The CLI needs some JavaScript runtime (Node, Deno, or Bun)

**But we ARE framework-agnostic:**
- Same business logic runs in React (browser) AND CLI (Node)
- Could add Vue with zero changes to business logic
- Could swap storage implementations with one line change
- Could change runtimes by updating only adapter layer

### What Would Be "Even More Pure"?

If you wanted maximum runtime portability, you could add another abstraction layer:

```typescript
// Create a platform-agnostic file system interface
interface IFileSystem {
  readFile(path: string): Promise<string>;
  writeFile(path: string, data: string): Promise<void>;
}

// Node adapter
class NodeFileSystem implements IFileSystem {
  async readFile(path: string) {
    return fs.readFile(path, 'utf-8');
  }
  async writeFile(path: string, data: string) {
    await fs.writeFile(path, data, 'utf-8');
  }
}

// Deno adapter
class DenoFileSystem implements IFileSystem {
  async readFile(path: string) {
    return Deno.readTextFile(path);
  }
  async writeFile(path: string, data: string) {
    await Deno.writeTextFile(path, data);
  }
}

// Then inject into repository
class FileSystemRepository implements ITodoRepository {
  constructor(private readonly fs: IFileSystem) {}
}
```

**However, this is typically over-engineering** for most projects. The current implementation strikes a good balance between purity and pragmatism.

### The Philosophical Answer

**"Clean Architecture" doesn't mean "zero dependencies"** - it means:

| Principle | Our Implementation | Status |
|-----------|-------------------|---------|
| Dependencies point inward | Use cases depend on interfaces, not implementations | ✅ |
| Business rules are isolated | Domain layer has zero framework imports | ✅ |
| Frameworks are plugins | React and CLI are both outer layer plugins | ✅ |
| Easy to test | Can test with InMemoryRepository, no mocking needed | ✅ |
| Easy to swap implementations | LocalStorage ↔ FileSystem ↔ Future API adapter | ✅ |

### Uncle Bob's Perspective

Uncle Bob (Robert C. Martin, creator of Clean Architecture) uses Java/C# in his examples. He doesn't abstract away the JVM or .NET runtime - that's not the point.

**The point is**: Don't couple your business logic to frameworks like Spring, Angular, or React.

From his book:
> "The purpose of the architecture is to facilitate the development, deployment, operation, and maintenance of the software system. The strategy is to leave options open for as long as possible."

We've kept our options open:
- Want to switch from React to Vue? ✅ Easy - just UI layer changes
- Want to add a GraphQL API? ✅ Easy - add an adapter
- Want to switch from Node to Deno? ✅ Moderate - update one adapter
- Want to change business rules? ✅ Easy - change domain, everything else works

### The Node.js vs jsdom Distinction

**Why Node.js is acceptable:**
- Node.js is a **runtime** (like JVM for Java)
- It provides the execution environment
- Our business logic doesn't import Node-specific APIs

**Why jsdom would be questionable:**
- jsdom simulates a **browser environment**
- If domain logic needed jsdom, it would mean we're coupling to browser concepts
- That would violate Clean Architecture

**In our code:**
```typescript
// ❌ BAD - Domain depending on framework
// src/domain/entities/Todo.ts
import { useState } from 'react';  // NO! Domain knows about React

// ✅ GOOD - Adapter depending on platform
// src/adapters/repositories/FileSystemRepository.ts
import * as fs from 'fs/promises';  // YES! Adapter uses platform features

// ✅ GOOD - UI depending on framework
// src/ui/react/App.tsx
import { useState } from 'react';  // YES! UI layer can use React
```

### Real-World Analogy

Think of it like building a car:

- **Engine (Domain)**: Works the same regardless of body style - pure mechanics
- **Transmission (Use Cases)**: Connects engine to wheels via standard interfaces
- **Body (Adapters)**: Sedan, SUV, truck - different implementations, same engine
- **Dashboard (UI)**: React, CLI, Vue - different interfaces, same functionality

The engine doesn't care if it's in a sedan or truck. Similarly, our `CreateTodo` use case doesn't care if it's called from React or CLI.

### Conclusion

**Yes, this is Clean Architecture** because:

1. ✅ Business logic is framework-independent
2. ✅ Dependencies point inward (domain ← use cases ← adapters ← UI)
3. ✅ Easy to test without complex mocking
4. ✅ Easy to swap implementations (LocalStorage ↔ FileSystem)
5. ✅ The "Node dependency" is in the adapter layer where it belongs

**Your colleague's observation is astute** - we're not runtime-agnostic. But Clean Architecture was never about that. It's about:
- Framework-agnosticism ✅
- Testability ✅
- Maintainability ✅
- Flexibility ✅

We achieve all of these goals.

### Further Reading

- [Clean Architecture by Robert C. Martin](https://www.amazon.com/Clean-Architecture-Craftsmans-Software-Structure/dp/0134494164)
- [The Clean Architecture Blog Post](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Dependency Inversion Principle](https://en.wikipedia.org/wiki/Dependency_inversion_principle)

---

Have more questions about the architecture? Open an issue or submit a PR to this Q&A! 🚀
