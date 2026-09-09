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
 * Autentica al usuario contra credenciales hardcodeadas (login local).
 * No realiza ninguna llamada HTTP al backend.
 * Si las credenciales coinciden, crea una sesión demo y la persiste
 * en localStorage. En caso contrario lanza un error descriptivo.
 */
export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  const emailMatch =
    credentials.email.trim().toLowerCase() === DEFAULT_EMAIL;
  const passwordMatch = credentials.password === DEFAULT_PASSWORD;

  if (!emailMatch || !passwordMatch) {
    throw new Error(
      "Credenciales inválidas. Use el usuario demo: demo@multienvios.gt / demo123",
    );
  }

  const auth: AuthResponse = {
    token: `demo-token-${Date.now()}`,
    user: DEFAULT_USER,
  };
  setSession(auth);
  return auth;
}

/** Cierra sesión eliminando los datos locales. */
export function logout(): void {
  clearSession();
}