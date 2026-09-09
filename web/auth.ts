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

/** Credenciales y usuario demo por defecto (login por defecto). */
const DEFAULT_EMAIL = "demo@multienvios.gt";
const DEFAULT_PASSWORD = "demo123";
const DEFAULT_USER: AuthUser = {
  id: "u1",
  email: DEFAULT_EMAIL,
  name: "Demo",
  balance: 500,
};

/** Guarda el token JWT, el usuario y el userId en localStorage. */
export function setSession(auth: AuthResponse): void {
  localStorage.setItem(TOKEN_KEY, auth.token);
  localStorage.setItem(USER_KEY, JSON.stringify(auth.user));
  localStorage.setItem(USER_ID_KEY, auth.user.id);
}

/** Recupera el token almacenado (o null si no existe). */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/** Recupera el userId almacenado (o null si no existe). */
export function getUserId(): string | null {
  const direct = localStorage.getItem(USER_ID_KEY);
  if (direct) return direct;
  const user = getUser();
  return user?.id ?? null;
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

/** Elimina el token, el usuario y el userId almacenados (logout). */
export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(USER_ID_KEY);
}

/**
 * Autentica al usuario contra el endpoint POST /api/auth/login.
 * Almacena el JWT recibido en localStorage.
 * Si el backend no está disponible y las credenciales coinciden con las
 * por defecto, crea una sesión demo local para que el login funcione
 * también offline.
 */
export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  try {
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
  } catch (err) {
    // Fallback de login por defecto: si el backend no responde y las
    // credenciales son las demo, se persiste una sesión local.
    const isNetworkError =
      err instanceof TypeError && err.message.includes("fetch");
    const isDefaultCredentials =
      credentials.email.trim().toLowerCase() === DEFAULT_EMAIL &&
      credentials.password === DEFAULT_PASSWORD;
    if (isNetworkError && isDefaultCredentials) {
      const demoAuth: AuthResponse = {
        token: `demo-token-${Date.now()}`,
        user: DEFAULT_USER,
      };
      setSession(demoAuth);
      return demoAuth;
    }
    throw err;
  }
}

/** Cierra sesión eliminando los datos locales. */
export function logout(): void {
  clearSession();
}