import { getToken } from "./auth";

/** URL base del API. En desarrollo puede quedar vacía para usar el proxy de Vite. */
const API_URL = import.meta.env.VITE_API_URL ?? "";

export interface DashboardStats {
  totalShipments: number;
  balance: number;
  delivered: number;
  inTransit: number;
  returned: number;
  pending: number;
}

export interface RecentShipment {
  id: string;
  trackingNumber: string;
  recipientName: string;
  status: string;
  amount: number;
  createdAt: string;
}

export interface DashboardData {
  stats: DashboardStats;
  activity: {
    labels: string[];
    shipments: number[];
  };
  recent: RecentShipment[];
}

export async function fetchDashboard(): Promise<DashboardData> {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/dashboard/stats`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!res.ok) throw new Error("No se pudieron cargar los datos del dashboard");
  return res.json();
}

export interface GuideRecipient {
  name: string;
  phone: string;
  department: string;
  municipality: string;
  address: string;
  reference?: string;
}

export interface GuideParcel {
  description: string;
  quantity: number;
  codAmount: number;
  weight: number;
  type: string;
}

export interface GuideRecord {
  id: string;
  userId: string;
  trackingNumber: string;
  courier: string;
  courierId: number;
  recipient: GuideRecipient;
  parcel: GuideParcel;
  status: string;
  cost: number;
  pdfSize: number;
  createdAt: string;
  isCancelled: boolean;
}

export interface GuideCreateInput {
  courier: string;
  courierId?: number;
  recipient: GuideRecipient;
  parcel: GuideParcel;
}

/** Cabeceras de autenticación reutilizables para las llamadas a la API. */
function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** Obtiene todas las guías del usuario autenticado desde la API. */
export async function fetchGuides(): Promise<GuideRecord[]> {
  const res = await fetch(`${API_URL}/api/guides`, { headers: authHeaders() });
  if (!res.ok) throw new Error("No se pudieron cargar las guías");
  return res.json();
}

/** Obtiene una guía concreta (en JSON) desde la API. */
export async function fetchGuide(id: string): Promise<GuideRecord> {
  const res = await fetch(`${API_URL}/api/guides/${encodeURIComponent(id)}`, {
    headers: { Accept: "application/json", ...authHeaders() },
  });
  if (!res.ok) throw new Error("No se pudo obtener la guía");
  return res.json();
}

/**
 * Crea una guía en la API. El endpoint devuelve el PDF binario y el id
 * en la cabecera `X-Guide-Id`; tras crearla se recupera el registro en
 * JSON para devolverlo al llamador.
 */
export async function createGuideApi(
  input: GuideCreateInput,
): Promise<GuideRecord> {
  const res = await fetch(`${API_URL}/api/guides`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({
      courier: input.courier,
      courierId: input.courierId,
      recipient: input.recipient,
      parcel: input.parcel,
    }),
  });
  if (!res.ok) throw new Error("No se pudo crear la guía");
  const id = res.headers.get("X-Guide-Id");
  if (!id) throw new Error("No se pudo crear la guía");
  return fetchGuide(id);
}

/** Anula (cancela) una guía en la API y devuelve el registro actualizado. */
export async function cancelGuideApi(id: string): Promise<GuideRecord> {
  const res = await fetch(`${API_URL}/api/guides/${encodeURIComponent(id)}/cancel`, {
    method: "POST",
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error("No se pudo cancelar la guía");
  return res.json();
}

/** Elimina una guía en la API. */
export async function deleteGuideApi(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/guides/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok && res.status !== 204) throw new Error("No se pudo eliminar la guía");
}

/* ------------------------------------------------------------------ */
/* Configuración de couriers (integration_settings)                   */
/* ------------------------------------------------------------------ */

export interface CourierSettings {
  courier: string;
  isEnabled: boolean;
  config: Record<string, string>;
}

/** Obtiene todas las configuraciones de couriers desde la API. */
export async function fetchCourierSettings(): Promise<CourierSettings[]> {
  const res = await fetch(`${API_URL}/api/settings`, { headers: authHeaders() });
  if (!res.ok) throw new Error("No se pudieron cargar las configuraciones");
  return res.json();
}

/** Persiste la configuración de un courier en la API. */
export async function saveCourierSettings(
  courier: string,
  isEnabled: boolean,
  config: Record<string, string>,
): Promise<CourierSettings> {
  const res = await fetch(`${API_URL}/api/settings/${encodeURIComponent(courier)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ isEnabled, config }),
  });
  if (!res.ok) throw new Error("No se pudo guardar la configuración");
  return res.json();
}
