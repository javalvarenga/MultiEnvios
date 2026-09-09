import type { GuideRecord, GuideRecipient, GuideParcel } from "./api";
import {
  fetchGuides,
  createGuideApi,
  cancelGuideApi,
  deleteGuideApi,
  type GuideCreateInput,
} from "./api";

/**
 * Capa de persistencia de guías basada en la API.
 *
 * Sustituye al anterior almacenamiento en localStorage: ahora las
 * operaciones de lectura, creación y borrado se realizan contra los
 * endpoints REST del backend (`/api/guides`).
 */

/** Lee todas las guías del usuario autenticado (más recientes primero). */
export async function getGuides(): Promise<GuideRecord[]> {
  const guides = await fetchGuides();
  return guides.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

/** Crea una nueva guía a partir de los datos del formulario vía API. */
export async function createGuide(input: {
  courier: string;
  courierId?: number;
  recipient: GuideRecipient;
  parcel: GuideParcel;
  status?: string;
  cost?: number;
  pdfSize?: number;
}): Promise<GuideRecord> {
  const payload: GuideCreateInput = {
    courier: input.courier,
    courierId: input.courierId,
    recipient: input.recipient,
    parcel: input.parcel,
  };
  return createGuideApi(payload);
}

/**
 * Anula una guía (isCancelled = true, status = "Anulada").
 * Devuelve la guía actualizada o null si no existe.
 */
export async function cancelGuide(id: string): Promise<GuideRecord | null> {
  try {
    return await cancelGuideApi(id);
  } catch {
    return null;
  }
}

/** Elimina una guía por id. */
export async function deleteGuide(id: string): Promise<void> {
  await deleteGuideApi(id);
}