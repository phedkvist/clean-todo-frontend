import { useState } from 'react';
import { TodoViewModel } from '../../../adapters/presenters/TodoPresenter';
import { useUpdateTodo } from '../hooks/useUpdateTodo';
import { useDeleteTodo } from '../hooks/useDeleteTodo';

interface TodoItemProps {
  todo: TodoViewModel;
  onUpdated?: () => void;
  onDeleted?: () => void;
}

/**
 * Component to display a single todo item
 */
export function TodoItem({ todo, onUpdated, onDeleted }: TodoItemProps) {
  const { toggleComplete, update, isUpdating } = useUpdateTodo();
  const { deleteTodo, isDeleting } = useDeleteTodo();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description);

  const handleToggleComplete = async () => {
    const result = await toggleComplete(todo.id, !todo.completed);
    if (result) {
      onUpdated?.();
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      const success = await deleteTodo(todo.id);
      if (success) {
        onDeleted?.();
      }
    }
  };

  const handleSaveEdit = async () => {
    const result = await update(todo.id, {
      title: editTitle,
      description: editDescription,
    });

    if (result) {
      setIsEditing(false);
      onUpdated?.();
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="todo-item editing">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="todo-input"
          disabled={isUpdating}
        />
        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          className="todo-textarea"
          rows={3}
          disabled={isUpdating}
        />
        <div className="todo-actions">
          <button
            onClick={handleSaveEdit}
            disabled={isUpdating || !editTitle.trim()}
            className="btn-save"
          >
            Save
          </button>
          <button onClick={handleCancelEdit} disabled={isUpdating} className="btn-cancel">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-content">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggleComplete}
          disabled={isUpdating || isDeleting}
          className="todo-checkbox"
        />
        <div className="todo-details">
          <h3 className="todo-title">{todo.title}</h3>
          {todo.description && <p className="todo-description">{todo.description}</p>}
          <div className="todo-meta">
            <span className="todo-date">Created {todo.createdAt}</span>
            {todo.updatedAt !== todo.createdAt && (
              <span className="todo-date"> • Updated {todo.updatedAt}</span>
            )}
          </div>
        </div>
      </div>
      <div className="todo-actions">
        <button
          onClick={() => setIsEditing(true)}
          disabled={isUpdating || isDeleting}
          className="btn-edit"
        >
          Edit
        </button>
        <button onClick={handleDelete} disabled={isUpdating || isDeleting} className="btn-delete">
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
}
