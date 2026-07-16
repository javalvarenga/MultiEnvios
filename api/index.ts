import express from "express";
import cors from "cors";
import { config } from "./config/index.js";
import { router } from "./routes/index.js";

const app = express();

// Habilitar CORS para que el frontend en puerto 8001 pueda consumir el API en 8000
app.use(cors());
app.use(express.json());

// Ruta raíz: Estado del API
app.get("/", (_req, res) => {
  res.json({
    status: "online",
    message: "MultiEnviosGT API is running",
    version: "0.1.0",
    endpoint: "/api"
  });
});

app.get("/health", (_req, res) => {
  const memUsage = process.memoryUsage().rss / (1024 * 1024);
  const systemUptime = process.uptime();

  res.json({
    status: "ok",
    uptime: systemUptime,
    memoryUsage: `${memUsage.toFixed(2)} MB`,
  });
});

// Rutas del API
app.use("/api", router);

app.listen(config.port, () => {
  console.log(`🚀 MultiEnviosGT API running on http://localhost:${config.port}`);
  console.log(`🛠️ API endpoints available at http://localhost:${config.port}/api`);
});
