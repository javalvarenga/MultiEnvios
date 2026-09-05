import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
  createGuideHandler,
  getGuideHandler,
  listGuidesHandler,
} from "../controllers/guideController.js";

export const guideRouter = Router();

guideRouter.use(authMiddleware);
guideRouter.post("/", createGuideHandler);
guideRouter.get("/", listGuidesHandler);
guideRouter.get("/:id", getGuideHandler);