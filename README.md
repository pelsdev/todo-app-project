# React Todo Application

This is a modern, feature-rich Todo application built with React and Vite. It is designed to be fast, responsive, and works offline, providing a seamless user experience.

## Features

- **Full CRUD Functionality**: Add, edit, delete, and toggle the completion status of todos.
- **Optimistic UI Updates**: Changes are reflected instantly in the UI and synchronized with the backend, with rollbacks on error.
- **Offline First**: Uses `localforage` to cache data, allowing the app to be fully functional without an internet connection.
- **Search and Pagination**: A debounced search input allows for quick filtering, and pagination handles large lists of todos efficiently.
- **Delete Confirmation**: A confirmation dialog prevents accidental deletion of todos.
- **Modern UI**: Styled with Tailwind CSS and `shadcn/ui` for a clean and modern look.
- **Error Handling**: Implements a global `ErrorBoundary` to catch and gracefully handle runtime errors.

## Installation and Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd todo-app
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## Available Scripts

- `npm run dev`: Starts the development server with Hot Module Replacement (HMR).
- `npm run build`: Builds the application for production.
- `npm run lint`: Lints the codebase using ESLint.
- `npm run preview`: Serves the production build locally for preview.

## Testing the Error Boundary

The application includes a dedicated route to test the `ErrorBoundary` component.

1.  Navigate to `/error-boundry-failure-component`.
2.  Click the "Trigger Error" button.
3.  The application should display the error fallback UI, demonstrating that the error boundary has successfully caught the runtime error.

## Technology Stack and Architecture

- **Framework**: [React](https://react.dev/) with [Vite](https://vitejs.dev/) for a fast development experience.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) and [shadcn/ui](https://ui.shadcn.com/) for a utility-first, component-based UI.
- **State Management**: [TanStack React Query](https://tanstack.com/query) is used to manage server state, caching, and optimistic updates.
- **Offline Storage**: [localforage](https://github.com/localForage/localForage) provides an asynchronous, IndexedDB-based storage layer for offline support.
- **Data Fetching**: [Axios](https://axios-http.com/) is used for making HTTP requests to the [JSONPlaceholder](https://jsonplaceholder.typicode.com/) API.
- **Architecture**: The application follows a component-based architecture with all primary logic consolidated within the `App.jsx` component. This includes data fetching, mutations, and state management, providing a single source of truth for the application's core functionality.
