import type { Shipment } from "../models/types.js";

const shipments: Shipment[] = [];

export const shipmentRepository = {
  create(shipment: Shipment): Shipment {
    shipments.push(shipment);
    return shipment;
  },
  findByUser(userId: string): Shipment[] {
    return shipments.filter((s) => s.userId === userId);
  },
};
