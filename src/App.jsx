import "./App.css";
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "./components/ui/button";
import TodoList from "./components/TodoList";
import TodoFormDialog from "./components/TodoFormDialog";
import ConfirmationDialog from "./components/ConfirmationDialog";
import { getCachedTodos, setCachedTodos } from "./lib/todosCache";
import {
  fetchTodos as fetchTodosApi,
  addTodo,
  editTodo as editTodoApi,
  deleteTodo,
  toggleTodoCompleted,
} from "./api";
import { Input } from "./components/ui/input";

function App() {
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTodo, setEditTodo] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState(null);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const PAGE_SIZE = 10;

  const queryClient = useQueryClient();

  const addTodoMutation = useMutation({
    mutationFn: (newTodoData) => addTodo({ ...newTodoData, userId: 1 }),
    onMutate: async (newTodoData) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });
      const previousTodos = (await getCachedTodos()) || [];
      const maxId = previousTodos.reduce(
        (max, todo) => (todo.id > max ? todo.id : max),
        0
      );
      const optimisticTodo = {
        ...newTodoData,
        id: maxId + 1,
        userId: 1,
      };
      const newTodos = [optimisticTodo, ...previousTodos];
      setCachedTodos(newTodos);
      queryClient.setQueryData(["todos"], newTodos);
      setDialogOpen(false);
      return { previousTodos };
    },
    onError: async (err, newTodo, context) => {
      queryClient.setQueryData(["todos"], context.previousTodos);
      await setCachedTodos(context.previousTodos);
      alert("Failed to add todo: " + err.message);
    },
  });

  const editTodoMutation = useMutation({
    mutationFn: (formData) =>
      editTodoApi(editTodo.id, { ...editTodo, ...formData }),
    onMutate: async (formData) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });
      const previousTodos = queryClient.getQueryData(["todos"]);
      const newTodos = previousTodos.map((todo) =>
        todo.id === editTodo.id ? { ...todo, ...formData } : todo
      );
      queryClient.setQueryData(["todos"], newTodos);
      await setCachedTodos(newTodos);
      setDialogOpen(false);
      setEditTodo(null);
      return { previousTodos };
    },
    onError: async (err, formData, context) => {
      queryClient.setQueryData(["todos"], context.previousTodos);
      await setCachedTodos(context.previousTodos);
      alert("Failed to edit todo: " + err.message);
    },
  });

  const deleteTodoMutation = useMutation({
    mutationFn: deleteTodo,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });
      const previousTodos = queryClient.getQueryData(["todos"]);
      const newTodos = previousTodos.filter((todo) => todo.id !== id);
      queryClient.setQueryData(["todos"], newTodos);
      await setCachedTodos(newTodos);
      return { previousTodos };
    },
    onError: async (err, id, context) => {
      queryClient.setQueryData(["todos"], context.previousTodos);
      await setCachedTodos(context.previousTodos);
      alert("Failed to delete todo: " + err.message);
    },
  });

  const toggleCompletedMutation = useMutation({
    mutationFn: (todo) => toggleTodoCompleted(todo.id, !todo.completed),
    onMutate: async (toggledTodo) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });
      const previousTodos = queryClient.getQueryData(["todos"]);
      const newTodos = previousTodos.map((todo) =>
        todo.id === toggledTodo.id
          ? { ...todo, completed: !todo.completed }
          : todo
      );
      queryClient.setQueryData(["todos"], newTodos);
      await setCachedTodos(newTodos);
      return { previousTodos };
    },
    onError: async (err, toggledTodo, context) => {
      queryClient.setQueryData(["todos"], context.previousTodos);
      await setCachedTodos(context.previousTodos);
      alert("Failed to update todo: " + err.message);
    },
  });

  const fetchTodos = async () => {
    const cached = await getCachedTodos();
    if (cached) return cached;
    const response = await fetchTodosApi();
    await setCachedTodos(response);
    return response;
  };

  const {
    data: todos = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: () => fetchTodos(),
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const filteredTodos =
    todos?.filter(
      (todo) =>
        (todo.title?.toLowerCase() || "").includes(
          debouncedSearchQuery.toLowerCase()
        ) ||
        (todo.description?.toLowerCase() || "").includes(
          debouncedSearchQuery.toLowerCase()
        )
    ) ?? [];

  const totalPages = Math.ceil(filteredTodos.length / PAGE_SIZE);
  const paginatedTodos = filteredTodos.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

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

  return (
    <main className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="sticky top-0 bg-gray-900 py-4 z-20 transform">
          <header className="flex justify-between items-center mb-4">
            <h1 className="text-4xl font-bold">Todo App</h1>
            <Button
              onClick={() => {
                setEditTodo(null);
                setDialogOpen(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Todo
            </Button>
          </header>
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <Input
              type="search"
              placeholder="Search todos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-800 border-gray-700 w-full"
            />
          </div>
        </div>

        {paginatedTodos.length > 0 ? (
          <>
            <TodoList
              todos={paginatedTodos}
              onEdit={(todo) => {
                setEditTodo(todo);
                setDialogOpen(true);
              }}
              onDelete={(id) => {
                setTodoToDelete(id);
                setConfirmOpen(true);
              }}
              onToggleCompleted={(todo) => toggleCompletedMutation.mutate(todo)}
            />
            <div className="flex items-center justify-center space-x-4 mt-8">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="bg-gray-700 hover:bg-gray-600 text-white"
              >
                Previous
              </Button>
              <span className="text-sm font-medium text-gray-400">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="bg-gray-700 hover:bg-gray-600 text-white"
              >
                Next
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center bg-gray-800 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-2">No Todos Yet!</h2>
            <p className="text-gray-400 mb-4">
              Click "Add Todo" to get started.
            </p>
          </div>
        )}

        <TodoFormDialog
          open={dialogOpen}
          onClose={() => {
            setDialogOpen(false);
            setEditTodo(null);
          }}
          onSubmit={editTodo ? editTodoMutation.mutate : addTodoMutation.mutate}
          initialData={editTodo}
          loading={addTodoMutation.isPending || editTodoMutation.isPending}
          title={editTodo ? "Edit Todo" : "Add New Todo"}
        />

        <ConfirmationDialog
          open={isConfirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={() => {
            if (todoToDelete) {
              deleteTodoMutation.mutate(todoToDelete, {
                onSuccess: () => {
                  setConfirmOpen(false);
                  setTodoToDelete(null);
                },
              });
            }
          }}
          title="Are you sure you want to delete this todo?"
          description="This action cannot be undone. This will permanently delete the todo item."
          loading={deleteTodoMutation.isPending}
        />
      </div>
    </main>
  );
}

export default App;
