import React from "react";
import { Link } from "react-router";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Pencil, Trash2 } from "lucide-react";
import { cn } from "../lib/utils";

const TodoItem = ({ todo, onEdit, onDelete, onToggleCompleted }) => {
  // Prevents the Link from navigating when a button or checkbox is clicked
  const handleActionClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <Link
      to={`/todo/${todo.id}`}
      className="block"
      aria-label={`View details for ${todo.title}`}
    >
      <div
        className={cn(
          "flex items-center p-4 rounded-lg border bg-gray-800 border-gray-700 transition-colors hover:bg-gray-700/50",
          todo.completed && "bg-gray-800/50 border-gray-800"
        )}
      >
        <div onClick={handleActionClick}>
          <Checkbox
            id={`todo-${todo.id}`}
            checked={todo.completed}
            onCheckedChange={() =>
              onToggleCompleted({ id: todo.id, completed: !todo.completed })
            }
            aria-label={`Mark ${todo.title} as ${
              todo.completed ? "incomplete" : "complete"
            }`}
            className="mr-4"
          />
        </div>
        <label
          htmlFor={`todo-${todo.id}`}
          className={cn(
            "flex-grow text-lg cursor-pointer",
            todo.completed && "line-through text-gray-500"
          )}
        >
          {todo.title}
        </label>
        <div
          className="flex items-center gap-2 ml-4"
          onClick={handleActionClick}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(todo)}
            aria-label={`Edit ${todo.title}`}
          >
            <Pencil className="h-5 w-5 text-gray-400 hover:text-white" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(todo.id)}
            aria-label={`Delete ${todo.title}`}
          >
            <Trash2 className="h-5 w-5 text-red-500 hover:text-red-400" />
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default React.memo(TodoItem);
