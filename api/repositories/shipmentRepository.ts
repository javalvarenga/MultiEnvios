import { randomUUID } from "node:crypto";
import { query, execute } from "../db/client.js";
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
    await execute(
      `INSERT INTO shipments
         (id, userId, recipientName, address, status, cost, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        shipment.id,
        shipment.userId,
        shipment.recipientName,
        shipment.address,
        shipment.status,
        shipment.cost,
        new Date(shipment.createdAt),
      ],
    );

    for (const pkg of shipment.packages) {
      await execute(
        `INSERT INTO packages (id, shipmentId, type, content, weight, quantity)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [pkg.id, shipment.id, pkg.type, pkg.content, pkg.weight, pkg.quantity],
      );
    }
    return shipment;
  },

  async findByUser(userId: string): Promise<Shipment[]> {
    const rows = await query<ShipmentRow>(
      `SELECT id, userId, recipientName, address, status, cost, createdAt
         FROM shipments
        WHERE userId = ?
        ORDER BY createdAt DESC`,
      [userId],
    );

    if (rows.length === 0) return [];

    const ids = rows.map((r) => r.id);
    const pkgRows = await query<PackageRow>(
      `SELECT id, shipmentId, type, content, weight, quantity
         FROM packages
        WHERE shipmentId IN (?)`,
      [ids],
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