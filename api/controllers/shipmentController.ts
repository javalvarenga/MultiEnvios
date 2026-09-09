import type { Response } from "express";
import type { AuthedRequest } from "../middleware/auth.js";
import { createShipment, listShipments } from "../services/shipmentService.js";
import type { PackageType } from "../models/types.js";

const VALID_PACKAGE_TYPES: PackageType[] = ["package", "envelope", "other"];

export async function createShipmentHandler(req: AuthedRequest, res: Response): Promise<void> {
  const { recipientName, address, packages } = req.body ?? {};

  if (!recipientName || typeof recipientName !== "string") {
    res.status(400).json({ error: "El nombre del destinatario es requerido" });
    return;
  }

  if (!address || typeof address !== "string") {
    res.status(400).json({ error: "La dirección es requerida" });
    return;
  }

  if (!Array.isArray(packages) || packages.length === 0) {
    res.status(400).json({
      error: "Debe agregar al menos un paquete para generar la guía",
    });
    return;
  }

  for (const pkg of packages) {
    if (
      !pkg ||
      typeof pkg.type !== "string" ||
      !VALID_PACKAGE_TYPES.includes(pkg.type as PackageType)
    ) {
      res.status(400).json({ error: "Cada paquete debe tener un tipo válido (package, envelope, other)" });
      return;
    }
    if (!pkg.content || typeof pkg.content !== "string") {
      res.status(400).json({ error: "Cada paquete debe indicar su contenido" });
      return;
    }
    if (typeof pkg.weight !== "number" || pkg.weight <= 0) {
      res.status(400).json({ error: "Cada paquete debe tener un peso válido" });
      return;
    }
    if (typeof pkg.quantity !== "number" || pkg.quantity < 1) {
      res.status(400).json({ error: "Cada paquete debe tener una cantidad válida (mínimo 1)" });
      return;
    }
  }

  try {
    const shipment = await createShipment(req.userId!, recipientName, address, packages);
    res.status(201).json(shipment);
  } catch (err) {
    console.error("createShipment error:", err);
    res.status(500).json({ error: "Error al crear el envio" });
  }
}

export async function listShipmentsHandler(req: AuthedRequest, res: Response): Promise<void> {
  try {
    res.json(await listShipments(req.userId!));
  } catch (err) {
    console.error("listShipments error:", err);
    res.status(500).json({ error: "Error al listar los envios" });
  }
}
