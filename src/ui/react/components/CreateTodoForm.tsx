import { useState, FormEvent } from 'react';
import { useCreateTodo } from '../hooks/useCreateTodo';

interface CreateTodoFormProps {
  onCreated?: () => void;
}

/**
 * Form component to create new todos
 */
export function CreateTodoForm({ onCreated }: CreateTodoFormProps) {
  const { create, isCreating, error } = useCreateTodo();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    const todo = await create(title, description);

    if (todo) {
      setTitle('');
      setDescription('');
      onCreated?.();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-todo-form">
      <div className="form-group">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          disabled={isCreating}
          className="todo-input"
          autoFocus
        />
      </div>

      <div className="form-group">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          disabled={isCreating}
          className="todo-textarea"
          rows={3}
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <button type="submit" disabled={isCreating || !title.trim()} className="btn-primary">
        {isCreating ? 'Creating...' : 'Add Todo'}
      </button>
    </form>
  );
}
