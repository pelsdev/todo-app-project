import React from "react";
import { Button } from "./ui/button";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white text-center p-4">
          <h1 className="text-4xl font-bold text-red-500 mb-4">
            Something went wrong.
          </h1>
          <p className="text-gray-400 mb-8">
            We've logged the error and will look into it. Please try refreshing
            the page.
          </p>
          {this.state.error && (
            <pre className="text-left bg-gray-800 p-4 rounded-lg text-red-400 max-w-2xl overflow-auto mb-8">
              {this.state.error.toString()}
            </pre>
          )}
          <Button onClick={() => window.location.reload()}>Refresh Page</Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
