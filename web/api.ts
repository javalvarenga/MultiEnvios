import { getToken } from "./auth";

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
  const res = await fetch("/api/dashboard/stats", {
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
  recipient: GuideRecipient;
  parcel: GuideParcel;
  status: string;
  cost: number;
  pdfSize: number;
  createdAt: string;
  isCancelled: boolean;
}

export async function fetchGuides(): Promise<GuideRecord[]> {
  const token = getToken();
  const res = await fetch("/api/guides", {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!res.ok) throw new Error("No se pudieron cargar las guías");
  return res.json();
}

export async function cancelGuide(id: string): Promise<GuideRecord> {
  const token = getToken();
  const res = await fetch(`/api/guides/${id}/cancel`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!res.ok) throw new Error("No se pudo anular la guía");
  return res.json();
}
