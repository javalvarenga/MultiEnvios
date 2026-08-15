import { randomUUID } from "node:crypto";
import { shipmentRepository } from "../repositories/shipmentRepository.js";
import { userRepository } from "../repositories/userRepository.js";
import type { Shipment, Package } from "../models/types.js";

const SHIPMENT_COST = 25;

export function createShipment(
  userId: string,
  recipientName: string,
  address: string,
  packages: Array<Omit<Package, "id">>,
): Shipment {
  if (!packages || packages.length === 0) {
    throw new Error("Se requiere al menos un paquete para crear el envío");
  }

  if (!userId) {
    throw new Error("Se requiere un usuario válido");
  }

  const packagesWithIds: Package[] = packages.map((pkg) => ({
    ...pkg,
    id: randomUUID(),
  }));

  const shipment: Shipment = {
    id: randomUUID(),
    userId,
    recipientName,
    address,
    packages: packagesWithIds,
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
