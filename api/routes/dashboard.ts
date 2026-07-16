import { Router } from "express";

export const dashboardRouter = Router();

/** Datos de ejemplo para el dashboard hasta conectar MySQL. */
dashboardRouter.get("/stats", (_req, res) => {
  res.json({
    stats: {
      totalShipments: 128,
      balance: 450.5,
      delivered: 89,
      inTransit: 24,
      returned: 3,
      pending: 12,
    },
    activity: {
      labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
      shipments: [12, 19, 8, 15, 22, 10, 14],
    },
    recent: [
      {
        id: "1",
        trackingNumber: "CE-2026-00128",
        recipientName: "María López",
        status: "in_transit",
        amount: 125.0,
        createdAt: "2026-07-09T10:30:00Z",
      },
      {
        id: "2",
        trackingNumber: "CE-2026-00127",
        recipientName: "Carlos Ruiz",
        status: "delivered",
        amount: 89.5,
        createdAt: "2026-07-09T09:15:00Z",
      },
      {
        id: "3",
        trackingNumber: "CE-2026-00126",
        recipientName: "Ana Morales",
        status: "pending",
        amount: 210.0,
        createdAt: "2026-07-08T18:40:00Z",
      },
    ],
  });
});
