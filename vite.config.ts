import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  root: resolve("src/renderer"),
  resolve: {
    alias: {
      "@": resolve("src/renderer/src"),
    },
  },
  plugins: [react(), tailwindcss()],
});
