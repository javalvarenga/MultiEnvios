import { query, execute } from "../db/client.js";
import type { Guide, GuideRecipient, GuideParcel, CourierType } from "../models/types.js";

interface GuideRow {
  id: string;
  userId: string;
  trackingNumber: string;
  courier: string;
  courierId: number;
  recipient: string;
  parcel: string;
  status: string;
  cost: number;
  pdf: Buffer;
  createdAt: Date;
  isCancelled: number;
}

function toGuide(row: GuideRow): Guide {
  return {
    id: row.id,
    userId: row.userId,
    trackingNumber: row.trackingNumber,
    courier: row.courier as CourierType,
    courierId: Number(row.courierId),
    recipient: JSON.parse(row.recipient) as GuideRecipient,
    parcel: JSON.parse(row.parcel) as GuideParcel,
    status: row.status,
    cost: Number(row.cost),
    pdf: row.pdf ?? Buffer.alloc(0),
    createdAt: new Date(row.createdAt).toISOString(),
    isCancelled: Boolean(row.isCancelled),
  };
}

export const guideRepository = {
  async create(guide: Guide): Promise<Guide> {
    await execute(
      `INSERT INTO guides
         (id, userId, trackingNumber, courier, courierId, recipient, parcel, status, cost, pdf, createdAt, isCancelled)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        guide.id,
        guide.userId,
        guide.trackingNumber,
        guide.courier,
        guide.courierId,
        JSON.stringify(guide.recipient),
        JSON.stringify(guide.parcel),
        guide.status,
        guide.cost,
        guide.pdf,
        new Date(guide.createdAt),
        guide.isCancelled,
      ],
    );
    return guide;
  },

  async findById(id: string): Promise<Guide | undefined> {
    const rows = await query<GuideRow>(
      `SELECT id, userId, trackingNumber, courier, courierId, recipient, parcel,
              status, cost, pdf, createdAt, isCancelled
         FROM guides
        WHERE id = ?`,
      [id],
    );
    return rows[0] ? toGuide(rows[0]) : undefined;
  },

  async findByUser(userId: string): Promise<Guide[]> {
    const rows = await query<GuideRow>(
      `SELECT id, userId, trackingNumber, courier, courierId, recipient, parcel,
              status, cost, pdf, createdAt, isCancelled
         FROM guides
        WHERE userId = ?
        ORDER BY createdAt DESC`,
      [userId],
    );
    return rows.map(toGuide);
  },

  async update(guide: Guide): Promise<Guide> {
    await execute(
      `UPDATE guides
          SET trackingNumber = ?,
              status = ?,
              isCancelled = ?,
              pdf = ?
        WHERE id = ?`,
      [guide.trackingNumber, guide.status, guide.isCancelled, guide.pdf, guide.id],
    );
    return guide;
  },

  async deleteById(id: string, userId: string): Promise<boolean> {
    const result = await execute(
      `DELETE FROM guides WHERE id = ? AND userId = ?`,
      [id, userId],
    );
    return result.affectedRows > 0;
  },
};