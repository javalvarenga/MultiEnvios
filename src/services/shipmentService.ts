import { randomUUID } from "node:crypto";
import { shipmentRepository } from "../repositories/shipmentRepository.js";
import { userRepository } from "../repositories/userRepository.js";
import type { Shipment } from "../models/types.js";

const SHIPMENT_COST = 25;

export function createShipment(
  userId: string,
  recipientName: string,
  address: string,
): Shipment {
  const shipment: Shipment = {
    id: randomUUID(),
    userId,
    recipientName,
    address,
    status: "pending",
    cost: SHIPMENT_COST,
    createdAt: new Date().toISOString(),
  };
  userRepository.updateBalance(userId, -SHIPMENT_COST);
  return shipmentRepository.create(shipment);
}

export function listShipments(userId: string): Shipment[] {
  return shipmentRepository.findByUser(userId);
}
