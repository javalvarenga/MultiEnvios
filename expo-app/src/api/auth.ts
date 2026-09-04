import { api, setToken, clearToken } from "./client";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  balance: number;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

/**
 * Autentica al usuario contra el endpoint POST /auth/login.
 * Almacena el JWT recibido en AsyncStorage.
 */
export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/login", credentials);
  await setToken(data.token);
  return data;
}

/** Cierra sesión eliminando el token local. */
export async function logout(): Promise<void> {
  await clearToken();
}