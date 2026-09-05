import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
  createGuideHandler,
  getGuideHandler,
  listGuidesHandler,
  cancelGuideHandler,
} from "../controllers/guideController.js";

export const guideRouter = Router();

guideRouter.use(authMiddleware);
guideRouter.post("/", createGuideHandler);
guideRouter.get("/", listGuidesHandler);
guideRouter.get("/:id", getGuideHandler);
guideRouter.post("/:id/cancel", cancelGuideHandler);