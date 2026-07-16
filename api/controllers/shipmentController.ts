import type { Response } from "express";
import type { AuthedRequest } from "../middleware/auth.js";
import { createShipment, listShipments } from "../services/shipmentService.js";

export function createShipmentHandler(req: AuthedRequest, res: Response): void {
  const { recipientName, address } = req.body ?? {};
  const shipment = createShipment(req.userId!, recipientName, address);
  res.status(201).json(shipment);
}

export function listShipmentsHandler(req: AuthedRequest, res: Response): void {
  res.json(listShipments(req.userId!));
}
