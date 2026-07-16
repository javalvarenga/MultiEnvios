export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  balance: number;
}

export interface Shipment {
  id: string;
  userId: string;
  recipientName: string;
  address: string;
  status: string;
  cost: number;
  createdAt: string;
};
