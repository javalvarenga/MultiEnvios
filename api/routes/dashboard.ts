import { Router } from "express";
import type { Response } from "express";
import type { AuthedRequest } from "../middleware/auth.js";
import { authMiddleware } from "../middleware/auth.js";
import { getDashboardData } from "../services/dashboardService.js";

export const dashboardRouter = Router();

dashboardRouter.use(authMiddleware);

dashboardRouter.get("/stats", async (req: AuthedRequest, res: Response): Promise<void> => {
  try {
    const data = await getDashboardData(req.userId!);
    res.json(data);
  } catch (err) {
    console.error("dashboard stats error:", err);
    res.status(500).json({ error: "Error al obtener las estadisticas" });
  }
});