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
