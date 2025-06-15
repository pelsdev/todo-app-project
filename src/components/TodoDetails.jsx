import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getTodoById } from "../api";
import { getCachedTodos } from "../lib/todosCache";
import { Button } from "./ui/button";
import { Loader2, ArrowLeft } from "lucide-react";

const TodoDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: todo,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["todo", id],
    queryFn: async () => {
      const cachedTodos = await getCachedTodos();
      const foundTodo = cachedTodos?.find((t) => String(t.id) === String(id));
      if (foundTodo) {
        return foundTodo;
      }

      try {
        return await getTodoById(id);
      } catch {
        throw new Error(`Todo with ID ${id} not found.`);
      }
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-red-500">
        Error: {error.message}
      </div>
    );
  }

  if (!todo) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        Todo not found.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-4">{todo.title}</h1>
          <p
            className={`text-lg ${
              todo.completed ? "text-green-400" : "text-yellow-400"
            }`}
          >
            Status: {todo.completed ? "Completed" : "Pending"}
          </p>
          <p className="text-gray-400 mt-4">User ID: {todo.userId}</p>
        </div>
      </div>
    </main>
  );
};

export default TodoDetails;
