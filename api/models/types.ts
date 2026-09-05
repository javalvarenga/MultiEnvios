export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  balance: number;
}

export type PackageType = "package" | "envelope" | "other";

export interface Package {
  id: string;
  type: PackageType;
  content: string;
  weight: number;
  quantity: number;
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

export type CourierType = "cargo_expreso" | "forza" | "guatex" | "mock";

export const COURIER_TYPES: CourierType[] = [
  "cargo_expreso",
  "forza",
  "guatex",
  "mock",
];

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

export interface GuideInput {
  courier: CourierType;
  recipient: GuideRecipient;
  parcel: GuideParcel;
}

export interface Guide {
  id: string;
  userId: string;
  trackingNumber: string;
  courier: CourierType;
  recipient: GuideRecipient;
  parcel: GuideParcel;
  status: string;
  cost: number;
  pdf: Buffer;
  createdAt: string;
  isCancelled: boolean;
}
