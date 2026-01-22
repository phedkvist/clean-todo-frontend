import { TodoListViewModel } from '../../../adapters/presenters/TodoListPresenter';

interface TodoStatsProps {
  viewModel: TodoListViewModel;
}

/**
 * Component to display todo statistics
 */
export function TodoStats({ viewModel }: TodoStatsProps) {
  const { totalCount, activeCount, completedCount, completionPercentage } = viewModel;

  return (
    <div className="todo-stats">
      <div className="stat">
        <span className="stat-label">Total:</span>
        <span className="stat-value">{totalCount}</span>
      </div>
      <div className="stat">
        <span className="stat-label">Active:</span>
        <span className="stat-value">{activeCount}</span>
      </div>
      <div className="stat">
        <span className="stat-label">Completed:</span>
        <span className="stat-value">{completedCount}</span>
      </div>
      <div className="stat">
        <span className="stat-label">Progress:</span>
        <span className="stat-value">{completionPercentage}%</span>
      </div>
    </div>
  );
}
