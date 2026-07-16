import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  root: __dirname,
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
  },
  server: {
    port: 8001,
    strictPort: true,
    hmr: {
      overlay: true,
    },
    proxy: {
      "/api": `http://localhost:${process.env.PORT ?? "8000"}`,
      "/health": `http://localhost:${process.env.PORT ?? "8000"}`,
    },
  },
});
