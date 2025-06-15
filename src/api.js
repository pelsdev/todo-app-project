import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
});

export const fetchTodos = async () => {
  const response = await apiClient.get('/todos');
  return response.data;
};

export const addTodo = async (todo) => {
  // The API expects a certain shape, but we'll let the caller define it.
  const response = await apiClient.post('/todos', todo);
  return response.data;
};

export const editTodo = async (id, updatedFields) => {
  const response = await apiClient.put(`/todos/${id}`, updatedFields);
  return response.data;
};

export const deleteTodo = async (id) => {
  await apiClient.delete(`/todos/${id}`);
  // No content is returned on successful deletion
};

export const toggleTodoCompleted = async (id, completed) => {
  const response = await apiClient.patch(`/todos/${id}`, { completed });
  return response.data;
};

export const getTodoById = async (id) => {
  const response = await apiClient.get(`/todos/${id}`);
  return response.data;
};
