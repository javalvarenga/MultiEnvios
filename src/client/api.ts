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
