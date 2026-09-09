import { query } from "../db/client.js";
import { userRepository } from "../repositories/userRepository.js";

/**
 * Datos agregados del dashboard para un usuario, obtenidos desde la base de
 * datos MySQL. Reemplaza los datos de ejemplo (hardcoded) que se devolvian
 * antes de conectar la base.
 */

interface DashboardStats {
  totalShipments: number;
  balance: number;
  delivered: number;
  inTransit: number;
  returned: number;
  pending: number;
}

interface RecentShipment {
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

const WEEKDAY_LABELS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

interface StatusCountRow {
  status: string;
  total: number;
}

interface ActivityRow {
  dayIndex: number;
  total: number;
}

interface RecentRow {
  id: string;
  trackingNumber: string;
  recipientName: string;
  status: string;
  amount: number;
  createdAt: Date;
}

/**
 * Devuelve las metricas del dashboard del `userId`: conteo de envios por
 * estado, saldo del usuario, actividad semanal y envios recientes.
 *
 * Combina datos de las tablas `shipments` y `guides` para que el dashboard
 * refleje todo el movimiento del usuario.
 */
export async function getDashboardData(userId: string): Promise<DashboardData> {
  const user = await userRepository.findById(userId);

  // 1. Conteo de guias por estado para el usuario.
  const guideStatusRows = await query<StatusCountRow>(
    `SELECT status, COUNT(*) AS total
       FROM guides
      WHERE userId = ?
        AND isCancelled = FALSE
      GROUP BY status`,
    [userId],
  );

  const shipmentStatusRows = await query<StatusCountRow>(
    `SELECT status, COUNT(*) AS total
       FROM shipments
      WHERE userId = ?
      GROUP BY status`,
    [userId],
  );

  const statusTotals = new Map<string, number>();
  for (const row of [...guideStatusRows, ...shipmentStatusRows]) {
    const key = normalizeStatus(row.status);
    statusTotals.set(key, (statusTotals.get(key) ?? 0) + Number(row.total));
  }

  const totalShipments =
    guideStatusRows.reduce((acc, r) => acc + Number(r.total), 0) +
    shipmentStatusRows.reduce((acc, r) => acc + Number(r.total), 0);

  const stats: DashboardStats = {
    totalShipments,
    balance: user?.balance ?? 0,
    delivered: statusTotals.get("delivered") ?? 0,
    inTransit: statusTotals.get("in_transit") ?? 0,
    returned: statusTotals.get("returned") ?? 0,
    pending: statusTotals.get("pending") ?? 0,
  };

  // 2. Actividad semanal (ultimos 7 dias) combinando guias y envios.
  const activityRows = await query<ActivityRow>(
    `SELECT (WEEKDAY(createdAt) + 1) AS dayIndex, COUNT(*) AS total
       FROM (
         SELECT createdAt FROM guides WHERE userId = ? AND isCancelled = FALSE
         UNION ALL
         SELECT createdAt FROM shipments WHERE userId = ?
       ) AS combined
      WHERE createdAt >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY dayIndex`,
    [userId, userId],
  );

  const activityMap = new Map<number, number>();
  for (const row of activityRows) {
    activityMap.set(Number(row.dayIndex), Number(row.total));
  }

  // dayIndex de MySQL WEEKDAY(): Lunes=0 ... Domingo=6. Lo mapeamos a 1..7.
  const shipments = WEEKDAY_LABELS.map((_, idx) => activityMap.get(idx + 1) ?? 0);

  // 3. Envios recientes (guias + shipments), limitado a 5.
  const recentRows = await query<RecentRow>(
    `SELECT id, trackingNumber, recipientName, status, amount, createdAt FROM (
        SELECT id,
               trackingNumber,
               JSON_UNQUOTE(JSON_EXTRACT(recipient, '$.name')) AS recipientName,
               status,
               cost AS amount,
               createdAt
          FROM guides
         WHERE userId = ?
           AND isCancelled = FALSE
         UNION ALL
        SELECT id,
               '' AS trackingNumber,
               recipientName,
               status,
               cost AS amount,
               createdAt
          FROM shipments
         WHERE userId = ?
     ) AS recent
     ORDER BY createdAt DESC
     LIMIT 5`,
    [userId, userId],
  );

  const recent: RecentShipment[] = recentRows.map((row) => ({
    id: row.id,
    trackingNumber: row.trackingNumber,
    recipientName: row.recipientName,
    status: row.status,
    amount: Number(row.amount),
    createdAt: new Date(row.createdAt).toISOString(),
  }));

  return {
    stats,
    activity: { labels: WEEKDAY_LABELS, shipments },
    recent,
  };
}

/**
 * Normaliza los estados almacenados en la base a las claves que usa el
 * dashboard (delivered, in_transit, returned, pending). Los estados que no
 * encajan se agrupan bajo "pending".
 */
function normalizeStatus(status: string): string {
  const s = status.toLowerCase();
  if (s === "delivered" || s === "entregado" || s === "created") return "delivered";
  if (s === "in_transit" || s === "transito" || s === "in-transit") return "in_transit";
  if (s === "returned" || s === "devuelto") return "returned";
  if (s === "pending" || s === "pendiente") return "pending";
  return "pending";
}