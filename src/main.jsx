import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router";

import App from "./App.jsx";
import TodoDetails from "./components/TodoDetails";
import NotFound from "./components/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";
import ErrorBoundryFailureComponent from "./components/ErrorBoundryFailureComponent";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/todo/:id" element={<TodoDetails />} />
            <Route
              path="/error-boundry-failure-component"
              element={<ErrorBoundryFailureComponent />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>
);
