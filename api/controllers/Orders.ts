import { pool } from "../db/client.js";
import { guideRepository } from "../repositories/guideRepository.js";
import type { Guide } from "../models/types.js";

/**
 * Persiste la guia generada/cancelada contra el courier invocando el stored
 * procedure MySQL `CT_Orders_AssignGuides`.
 *
 * @param _sql  SQL original del ejemplo (ignorado; se usa el SP fijo).
 * @param params `[orderId, guideNumber, typeOfService]`.
 */
export async function assignGuides(
  _sql: string,
  params: [string, string, number],
): Promise<Guide | null> {
  const [orderId, guideNumber, typeOfService] = params;
  const guide = await guideRepository.findById(orderId);
  if (!guide) return null;

  await pool.query("CALL CT_Orders_AssignGuides(?, ?, ?)", [
    orderId,
    guideNumber ?? "",
    typeOfService,
  ]);

  if (typeOfService === 0) {
    guide.status = "cancelled";
  } else {
    guide.trackingNumber = guideNumber || guide.trackingNumber;
    guide.status = "created";
  }
  return guide;
}