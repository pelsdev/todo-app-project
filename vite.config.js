import path from "path";
// vite.config.js
// This is a Vite configuration file that sets up a React project with Tailwind CSS.
// It uses the Vite plugin for React and Tailwind CSS, and configures an alias for the source directory.
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(path.dirname(import.meta.url), "./src"),
    },
  },
});
