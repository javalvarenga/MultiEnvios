import { api } from "./client";

export type PackageType = "package" | "envelope" | "other";

export interface PackageInput {
  type: PackageType;
  content: string;
  weight: number;
  quantity: number;
}

export interface Package extends PackageInput {
  id: string;
}

export interface Shipment {
  id: string;
  userId: string;
  recipientName: string;
  address: string;
  packages: Package[];
  status: string;
  cost: number;
  createdAt: string;
}

export interface CreateShipmentRequest {
  recipientName: string;
  address: string;
  packages: PackageInput[];
}

/**
 * Crea un envío mediante POST /shipments.
 * Requiere token JWT (inyectado automáticamente por el interceptor).
 */
export async function createShipment(
  payload: CreateShipmentRequest,
): Promise<Shipment> {
  const { data } = await api.post<Shipment>("/shipments", payload);
  return data;
}

/**
 * Lista los envíos del usuario autenticado (GET /shipments).
 */
export async function listShipments(): Promise<Shipment[]> {
  const { data } = await api.get<Shipment[]>("/shipments");
  return data;
}