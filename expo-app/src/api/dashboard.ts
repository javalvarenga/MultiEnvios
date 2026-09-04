import { api } from "./client";

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

/**
 * Obtiene los datos del dashboard desde GET /dashboard/stats.
 */
export async function fetchDashboard(): Promise<DashboardData> {
  const { data } = await api.get<DashboardData>("/dashboard/stats");
  return data;
}