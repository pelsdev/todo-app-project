import React from 'react';
import TodoItem from './TodoItem';

const TodoList = ({ todos, onEdit, onDelete, onToggleCompleted }) => {
  return (
    <div className="space-y-4">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleCompleted={onToggleCompleted}
        />
      ))}
    </div>
  );
};

export default React.memo(TodoList);
