import { TodoProvider } from './context/TodoContext';
import { LocalStorageRepository } from '../../adapters/repositories/LocalStorageRepository';
import { CreateTodoForm } from './components/CreateTodoForm';
import { TodoList } from './components/TodoList';

/**
 * Main React application component
 * This is where we inject the repository implementation
 */
export function App() {
  // This is the ONLY place in the UI where we decide which repository to use
  // We could easily swap this for InMemoryRepository or any other implementation
  const repository = new LocalStorageRepository();

  return (
    <TodoProvider repository={repository}>
      <div className="app">
        <header className="app-header">
          <h1>Clean Architecture Todo</h1>
          <p className="subtitle">React Implementation</p>
        </header>

        <main className="app-main">
          <section className="create-section">
            <h2>Add New Todo</h2>
            <CreateTodoForm onCreated={() => window.location.reload()} />
          </section>

          <section className="list-section">
            <h2>My Todos</h2>
            <TodoList />
          </section>
        </main>

        <footer className="app-footer">
          <p>
            Built with Clean Architecture principles - Business logic is completely independent of React
          </p>
        </footer>
      </div>
    </TodoProvider>
  );
}
