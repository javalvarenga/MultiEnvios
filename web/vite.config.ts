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
      // El target usa VITE_API_URL (definida en web/.env) para apuntar al backend
      // correspondiente; si no esta definida, cae al backend local en :8000.
      // changeOrigin reescribe el Host al del target y secure:false ignora
      // certificados invalidos para evitar errores de conexion (ECONNREFUSED/SSL).
      "/api": {
        target: process.env.VITE_API_URL || "http://localhost:8000",
        changeOrigin: true,
        secure: false,
      },
      "/health": {
        target: process.env.VITE_API_URL || "http://localhost:8000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
