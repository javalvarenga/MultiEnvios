import { guideRepository } from "../repositories/guideRepository.js";
import type { Guide } from "../models/types.js";

/**
 * Persiste la guia generada/cancelada contra el courier.
 *
 * En el ejemplo original se invoca un stored procedure MySQL
 * (`CT_Orders_AssignGuides`); aqui el proyecto aun opera con repositorios en
 * memoria, por lo que la asignacion se traduce a actualizar el estado de la
 * guia. La firma se mantiene estable para una futura migracion a DB.
 *
 * @param _sql  SQL original del ejemplo (ignorado en memoria).
 * @param params `[orderId, guideNumber, typeOfService]`.
 * @param _tenantSchema  Reservado para multi-tenant.
 */
export async function assignGuides(
  _sql: string,
  params: [string, string, number],
  _tenantSchema?: string,
): Promise<Guide | null> {
  const [orderId, guideNumber, typeOfService] = params;
  const guide = guideRepository.findById(orderId);
  if (!guide) return null;

  guide.trackingNumber = guideNumber || guide.trackingNumber;
  guide.status = typeOfService === 0 ? "cancelled" : "created";
  return guide;
}