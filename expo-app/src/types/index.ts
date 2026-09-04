export type PackageType = "package" | "envelope" | "other";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  balance: number;
}

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
};

export type MainTabsParamList = {
  Dashboard: undefined;
  ShipmentForm: undefined;
  Reports: undefined;
  Config: undefined;
};