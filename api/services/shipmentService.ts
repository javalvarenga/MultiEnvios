import { randomUUID } from "node:crypto";
import { shipmentRepository } from "../repositories/shipmentRepository.js";
import { userRepository } from "../repositories/userRepository.js";
import type { Shipment, Package } from "../models/types.js";

const SHIPMENT_COST = 25;

export async function createShipment(
  userId: string,
  recipientName: string,
  address: string,
  packages: Array<Omit<Package, "id">>,
): Promise<Shipment> {
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
  await userRepository.updateBalance(userId, -SHIPMENT_COST);
  return shipmentRepository.create(shipment);
}

export async function listShipments(userId: string): Promise<Shipment[]> {
  return shipmentRepository.findByUser(userId);
}