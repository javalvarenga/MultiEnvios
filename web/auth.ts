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
const USER_ID_KEY = "multienvios_user_id";

const AUTH_ENDPOINT = "/api/auth/login";

/** Guarda el token JWT, el usuario y el userId en sessionStorage. */
export function setSession(auth: AuthResponse): void {
  sessionStorage.setItem(TOKEN_KEY, auth.token);
  sessionStorage.setItem(USER_KEY, JSON.stringify(auth.user));
  sessionStorage.setItem(USER_ID_KEY, auth.user.id);
}

/** Recupera el token almacenado (o null si no existe). */
export function getToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}

/** Recupera el userId almacenado (o null si no existe). */
export function getUserId(): string | null {
  const direct = sessionStorage.getItem(USER_ID_KEY);
  if (direct) return direct;
  const user = getUser();
  return user?.id ?? null;
}

/** Recupera el usuario almacenado (o null si no existe). */
export function getUser(): AuthUser | null {
  const raw = sessionStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

/** Elimina el token, el usuario y el userId almacenados (logout). */
export function clearSession(): void {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(USER_ID_KEY);
}

/**
 * Autentica al usuario contra el endpoint de la API (/api/auth/login).
 * Persista la sesión devuelta (token + usuario) en sessionStorage.
 * Lanza un error descriptivo si la petición falla o las credenciales
 * son inválidas.
 */
export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  const res = await fetch(AUTH_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (res.status === 401) {
    throw new Error("Credenciales inválidas");
  }

  if (!res.ok) {
    throw new Error("No se pudo iniciar sesión. Intente nuevamente.");
  }

  const auth = (await res.json()) as AuthResponse;
  setSession(auth);
  return auth;
}

/** Cierra sesión eliminando los datos locales. */
export function logout(): void {
  clearSession();
}