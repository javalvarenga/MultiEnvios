import { Router } from "express";
import {
  createShipmentHandler,
  listShipmentsHandler,
} from "../controllers/shipmentController.js";

export const shipmentRouter = Router();

shipmentRouter.post("/", createShipmentHandler);
shipmentRouter.get("/", listShipmentsHandler);
