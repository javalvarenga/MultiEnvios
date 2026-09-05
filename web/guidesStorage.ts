import type { GuideRecord, GuideRecipient, GuideParcel } from "./api";
import { getUser } from "./auth";

const GUIDES_KEY = "multienvios_guides";

/** Lee todas las guías almacenadas en localStorage (más recientes primero). */
export function getGuides(): GuideRecord[] {
  const raw = localStorage.getItem(GUIDES_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as GuideRecord[];
    return Array.isArray(parsed)
      ? parsed.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
      : [];
  } catch {
    return [];
  }
}

function persist(guides: GuideRecord[]): void {
  localStorage.setItem(GUIDES_KEY, JSON.stringify(guides));
}

/** Crea una nueva guía a partir de los datos del formulario y la guarda en localStorage. */
export function createGuide(input: {
  courier: string;
  recipient: GuideRecipient;
  parcel: GuideParcel;
  status?: string;
  cost?: number;
  pdfSize?: number;
}): GuideRecord {
  const user = getUser();
  const now = new Date();
  const guide: GuideRecord = {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `guide-${Date.now()}`,
    userId: user?.id ?? "local",
    trackingNumber: `ME-${now.getFullYear()}-${String(now.getTime()).slice(-6)}`,
    courier: input.courier,
    recipient: input.recipient,
    parcel: input.parcel,
    status: input.status ?? "Pendiente",
    cost: input.cost ?? 0,
    pdfSize: input.pdfSize ?? 0,
    createdAt: now.toISOString(),
    isCancelled: false,
  };
  const guides = getGuides();
  guides.unshift(guide);
  persist(guides);
  return guide;
}

/** Actualiza los campos de una guía existente. Devuelve la guía actualizada o null. */
export function updateGuide(
  id: string,
  patch: Partial<GuideRecord>,
): GuideRecord | null {
  const guides = getGuides();
  const index = guides.findIndex((g) => g.id === id);
  if (index === -1) return null;
  const updated = { ...guides[index], ...patch, id: guides[index].id };
  guides[index] = updated;
  persist(guides);
  return updated;
}

/** Cambia el estado de una guía. Devuelve la guía actualizada o null. */
export function setGuideStatus(
  id: string,
  status: string,
): GuideRecord | null {
  return updateGuide(id, { status });
}

/** Anula una guía (isCancelled = true, status = "Anulada"). Devuelve la guía actualizada o null. */
export function cancelGuide(id: string): GuideRecord | null {
  return updateGuide(id, { isCancelled: true, status: "Anulada" });
}

/** Elimina una guía por id. */
export function deleteGuide(id: string): void {
  const guides = getGuides().filter((g) => g.id !== id);
  persist(guides);
}