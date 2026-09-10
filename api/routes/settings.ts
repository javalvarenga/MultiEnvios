import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
  listSettingsHandler,
  getSettingsHandler,
  upsertSettingsHandler,
} from "../controllers/settingsController.js";

export const settingsRouter = Router();

settingsRouter.use(authMiddleware);
settingsRouter.get("/", listSettingsHandler);
settingsRouter.get("/:courier", getSettingsHandler);
settingsRouter.put("/:courier", upsertSettingsHandler);