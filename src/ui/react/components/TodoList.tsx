import { useState } from 'react';
import { useTodos } from '../hooks/useTodos';
import { TodoItem } from './TodoItem';
import { TodoStats } from './TodoStats';

type FilterType = 'all' | 'active' | 'completed';

/**
 * Component to display a list of todos
 */
export function TodoList() {
  const [filter, setFilter] = useState<FilterType>('all');

  const filterCompleted =
    filter === 'all' ? undefined : filter === 'completed' ? true : false;

  const { viewModel, isLoading, error, refresh } = useTodos(filterCompleted);

  if (isLoading) {
    return <div className="loading">Loading todos...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={refresh} className="btn-retry">
          Retry
        </button>
      </div>
    );
  }

  if (!viewModel) {
    return null;
  }

  return (
    <div className="todo-list-container">
      <TodoStats viewModel={viewModel} />

      <div className="filter-tabs">
        <button
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'active' : ''}
        >
          All ({viewModel.totalCount})
        </button>
        <button
          onClick={() => setFilter('active')}
          className={filter === 'active' ? 'active' : ''}
        >
          Active ({viewModel.activeCount})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={filter === 'completed' ? 'active' : ''}
        >
          Completed ({viewModel.completedCount})
        </button>
      </div>

      {viewModel.todos.length === 0 ? (
        <div className="empty-state">
          <p>No todos {filter !== 'all' && filter}. Add one to get started!</p>
        </div>
      ) : (
        <div className="todo-list">
          {viewModel.todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} onUpdated={refresh} onDeleted={refresh} />
          ))}
        </div>
      )}
    </div>
  );
}
