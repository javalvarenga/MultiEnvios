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
  const res = await fetch("/api/dashboard/stats");
  if (!res.ok) throw new Error("No se pudieron cargar los datos del dashboard");
  return res.json();
}

// ---------------------------------------------------------------------------
// Auth & Shipment creation
// ---------------------------------------------------------------------------

export type PackageType = "package" | "envelope" | "other";

export interface ShipmentPackageInput {
  type: PackageType;
  content: string;
  weight: number;
  quantity: number;
}

export interface CreateShipmentRequest {
  recipientName: string;
  address: string;
  packages: ShipmentPackageInput[];
}

export interface ShipmentPackageResponse {
  id: string;
  type: string;
  content: string;
  weight: number;
  quantity: number;
}

export interface ShipmentResponse {
  id: string;
  userId: string;
  recipientName: string;
  address: string;
  packages: ShipmentPackageResponse[];
  status: string;
  cost: number;
  createdAt: string;
}

const TOKEN_KEY = "multienvios_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export async function login(email: string, password: string): Promise<void> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? "Credenciales inválidas");
  }
  const data = await res.json();
  setToken(data.token);
}

/**
 * Ensures there is a valid JWT in localStorage.
 * If none exists, logs in with the demo credentials.
 */
export async function ensureAuthenticated(): Promise<void> {
  if (getToken()) return;
  await login("demo@multienvios.gt", "demo123");
}

export async function createShipment(
  data: CreateShipmentRequest,
): Promise<ShipmentResponse> {
  await ensureAuthenticated();
  const token = getToken();
  const res = await fetch("/api/shipments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? `Error al crear el envío (HTTP ${res.status})`);
  }
  return res.json();
}
