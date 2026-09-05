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

export interface LoginRequest {
  email: string;
  password: string;
}

const TOKEN_KEY = "multienvios_token";
const USER_KEY = "multienvios_user";

/** Guarda el token JWT y el usuario en localStorage. */
export function setSession(auth: AuthResponse): void {
  localStorage.setItem(TOKEN_KEY, auth.token);
  localStorage.setItem(USER_KEY, JSON.stringify(auth.user));
}

/** Recupera el token almacenado (o null si no existe). */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/** Recupera el usuario almacenado (o null si no existe). */
export function getUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

/** Elimina el token y el usuario almacenados (logout). */
export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/**
 * Autentica al usuario contra el endpoint POST /api/auth/login.
 * Almacena el JWT recibido en localStorage.
 */
export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? "Credenciales inválidas");
  }
  const auth = (await res.json()) as AuthResponse;
  setSession(auth);
  return auth;
}

/** Cierra sesión eliminando los datos locales. */
export function logout(): void {
  clearSession();
}