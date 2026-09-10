import { query, callProcedure } from "../db/client.js";
import type { Shipment, Package } from "../models/types.js";

interface ShipmentRow {
  id: string;
  userId: string;
  recipientName: string;
  address: string;
  status: string;
  cost: number;
  createdAt: Date;
}

interface PackageRow {
  id: string;
  shipmentId: string;
  type: string;
  content: string;
  weight: number;
  quantity: number;
}

function toPackage(row: PackageRow): Package {
  return {
    id: row.id,
    type: row.type as Package["type"],
    content: row.content,
    weight: Number(row.weight),
    quantity: Number(row.quantity),
  };
}

export const shipmentRepository = {
  async create(shipment: Shipment): Promise<Shipment> {
    await callProcedure(
      "CALL sp_CreateShipment(?, ?, ?, ?, ?, ?)",
      [
        shipment.id,
        shipment.userId,
        shipment.recipientName,
        shipment.address,
        shipment.status,
        shipment.cost,
      ],
    );

    for (const pkg of shipment.packages) {
      await callProcedure(
        "CALL sp_CreatePackage(?, ?, ?, ?, ?, ?)",
        [pkg.id, shipment.id, pkg.type, pkg.content, pkg.weight, pkg.quantity],
      );
    }
    return shipment;
  },

  async findByUser(userId: string): Promise<Shipment[]> {
    const rows = await query<ShipmentRow>(
      "CALL sp_GetShipmentsByUser(?)",
      [userId],
    );

    if (rows.length === 0) return [];

    const pkgRows = await query<PackageRow>(
      "CALL sp_GetPackagesByUser(?)",
      [userId],
    );

    const packagesByShipment = new Map<string, Package[]>();
    for (const row of pkgRows) {
      const list = packagesByShipment.get(row.shipmentId) ?? [];
      list.push(toPackage(row));
      packagesByShipment.set(row.shipmentId, list);
    }

    return rows.map((row): Shipment => ({
      id: row.id,
      userId: row.userId,
      recipientName: row.recipientName,
      address: row.address,
      packages: packagesByShipment.get(row.id) ?? [],
      status: row.status,
      cost: Number(row.cost),
      createdAt: new Date(row.createdAt).toISOString(),
    }));
  },
};