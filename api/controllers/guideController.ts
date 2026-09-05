import type { Response } from "express";
import type { AuthedRequest } from "../middleware/auth.js";
import { createGuide, getGuide, listGuides, cancelGuide, isValidCourier } from "../services/guideService.js";
import type { Guide, GuideInput } from "../models/types.js";

type SafeGuide = Omit<Guide, "pdf"> & { pdfSize: number };

function toSafeGuide(guide: Guide): SafeGuide {
  const { pdf: _pdf, ...rest } = guide;
  return { ...rest, pdfSize: guide.pdf.length };
}

export function createGuideHandler(req: AuthedRequest, res: Response): void {
  const { courier, recipient, parcel } = (req.body ?? {}) as Partial<GuideInput>;

  if (!courier || typeof courier !== "string" || !isValidCourier(courier)) {
    res.status(400).json({ error: "El courier es requerido y debe ser valido" });
    return;
  }

  if (!recipient || typeof recipient !== "object") {
    res.status(400).json({ error: "Los datos del destinatario son requeridos" });
    return;
  }

  const { name, phone, department, municipality, address, reference } = recipient;

  if (!name || typeof name !== "string") {
    res.status(400).json({ error: "El nombre del destinatario es requerido" });
    return;
  }
  if (!phone || typeof phone !== "string") {
    res.status(400).json({ error: "El telefono del destinatario es requerido" });
    return;
  }
  if (!department || typeof department !== "string") {
    res.status(400).json({ error: "El departamento es requerido" });
    return;
  }
  if (!municipality || typeof municipality !== "string") {
    res.status(400).json({ error: "El municipio es requerido" });
    return;
  }
  if (!address || typeof address !== "string") {
    res.status(400).json({ error: "La direccion es requerida" });
    return;
  }
  if (reference !== undefined && typeof reference !== "string") {
    res.status(400).json({ error: "La referencia debe ser texto" });
    return;
  }

  if (!parcel || typeof parcel !== "object") {
    res.status(400).json({ error: "Los datos del pedido son requeridos" });
    return;
  }

  const {
    description,
    quantity,
    codAmount,
    weight,
    type,
  } = parcel;

  if (!description || typeof description !== "string") {
    res.status(400).json({ error: "La descripcion del pedido es requerida" });
    return;
  }
  if (typeof quantity !== "number" || quantity < 1) {
    res.status(400).json({ error: "La cantidad debe ser un numero valido (minimo 1)" });
    return;
  }
  if (typeof codAmount !== "number" || codAmount < 0) {
    res.status(400).json({ error: "El valor contra entrega debe ser un numero valido" });
    return;
  }
  if (typeof weight !== "number" || weight <= 0) {
    res.status(400).json({ error: "El peso debe ser un numero valido mayor a 0" });
    return;
  }
  if (!type || typeof type !== "string") {
    res.status(400).json({ error: "El tipo de envio es requerido" });
    return;
  }

  const guide = createGuide(req.userId!, {
    courier,
    recipient: { name, phone, department, municipality, address, reference },
    parcel: { description, quantity, codAmount, weight, type },
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="guide-${guide.trackingNumber}.pdf"`,
  );
  res.setHeader("X-Guide-Id", guide.id);
  res.status(201).send(guide.pdf);
}

export function getGuideHandler(req: AuthedRequest, res: Response): void {
  const guide = getGuide(req.params.id);
  if (!guide || guide.userId !== req.userId) {
    res.status(404).json({ error: "Guia no encontrada" });
    return;
  }

  const accept = req.headers.accept ?? "";
  if (accept.includes("application/pdf")) {
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="guide-${guide.trackingNumber}.pdf"`,
    );
    res.status(200).send(guide.pdf);
    return;
  }

  res.json(toSafeGuide(guide));
}

export function listGuidesHandler(req: AuthedRequest, res: Response): void {
  const guides = listGuides(req.userId!);
  res.json(guides.map(toSafeGuide));
}

export function cancelGuideHandler(req: AuthedRequest, res: Response): void {
  const guide = cancelGuide(req.params.id, req.userId!);
  if (!guide) {
    res.status(404).json({ error: "Guia no encontrada" });
    return;
  }
  res.status(200).json(toSafeGuide(guide));
}