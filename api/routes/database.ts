import { Router } from "express";
import type { Response } from "express";
import { query } from "../db/client.js";

export const databaseRouter = Router();

/**
 * GET /database/list
 * Ejecuta `SHOW DATABASES;` y devuelve la lista de nombres de bases de datos.
 */
databaseRouter.get("/list", async (_req, res: Response): Promise<void> => {
  try {
    const rows = await query<{ Database: string }>("SHOW DATABASES;");
    const databases = rows.map((row) => row.Database);
    res.status(200).json(databases);
  } catch (err) {
    console.error("database list error:", err);
    res.status(500).json({ error: "Error al obtener las bases de datos" });
  }
});