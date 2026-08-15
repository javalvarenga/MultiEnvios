import type { Response } from "express";
import type { AuthedRequest } from "../middleware/auth.js";
import { createShipment, listShipments } from "../services/shipmentService.js";
import type { PackageType } from "../models/types.js";

const VALID_PACKAGE_TYPES: PackageType[] = ["package", "envelope", "other"];

/**
 * Map Spanish and English package type labels to canonical English types.
 * This allows the API to accept both "Paquete" and "package".
 */
const PACKAGE_TYPE_MAP: Record<string, PackageType> = {
  package: "package",
  envelope: "envelope",
  other: "other",
  paquete: "package",
  sobre: "envelope",
  otros: "other",
};

function normalizePackageType(value: string): PackageType | null {
  const key = value.toLowerCase().trim();
  return PACKAGE_TYPE_MAP[key] ?? null;
}

interface NormalizedPackage {
  type: PackageType;
  content: string;
  weight: number;
  quantity: number;
}

export function createShipmentHandler(req: AuthedRequest, res: Response): void {
  try {
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

    const normalizedPackages: NormalizedPackage[] = [];

    for (const pkg of packages) {
      if (!pkg || typeof pkg.type !== "string") {
        res.status(400).json({
          error: "Cada paquete debe tener un tipo válido (package, envelope, other)",
        });
        return;
      }

      const normalizedType = normalizePackageType(pkg.type);
      if (!normalizedType || !VALID_PACKAGE_TYPES.includes(normalizedType)) {
        res.status(400).json({
          error: "Cada paquete debe tener un tipo válido (package, envelope, other)",
        });
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
        res.status(400).json({
          error: "Cada paquete debe tener una cantidad válida (mínimo 1)",
        });
        return;
      }

      normalizedPackages.push({
        type: normalizedType,
        content: pkg.content,
        weight: pkg.weight,
        quantity: pkg.quantity,
      });
    }

    // Use authenticated userId or fallback to default demo user
    const userId = req.userId ?? "u1";
    const shipment = createShipment(userId, recipientName, address, normalizedPackages);
    res.status(200).json(shipment);
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "Error interno del servidor",
    });
  }
}

export function listShipmentsHandler(req: AuthedRequest, res: Response): void {
  const userId = req.userId ?? "u1";
  res.json(listShipments(userId));
}
