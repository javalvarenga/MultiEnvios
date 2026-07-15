import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
  createShipmentHandler,
  listShipmentsHandler,
} from "../controllers/shipmentController.js";

export const shipmentRouter = Router();

shipmentRouter.use(authMiddleware);
shipmentRouter.post("/", createShipmentHandler);
shipmentRouter.get("/", listShipmentsHandler);
