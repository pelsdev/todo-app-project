// localforage setup for todos cache
import localforage from "localforage";

const TODOS_CACHE_KEY = "todos-cache";

export async function getCachedTodos() {
  const cached = await localforage.getItem(TODOS_CACHE_KEY);
  return cached || null;
}

export async function setCachedTodos(todos) {
  await localforage.setItem(TODOS_CACHE_KEY, todos);
}

export async function clearTodosCache() {
  await localforage.removeItem(TODOS_CACHE_KEY);
}
