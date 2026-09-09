import { setToken, clearToken } from "./client";

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

/** Credenciales y usuario demo por defecto (login local, sin backend). */
const DEFAULT_EMAIL = "demo@multienvios.gt";
const DEFAULT_PASSWORD = "demo123";
const DEFAULT_USER: AuthUser = {
  id: "u1",
  email: DEFAULT_EMAIL,
  name: "Demo",
  balance: 500,
};

/**
 * Autentica al usuario contra credenciales hardcodeadas (login local).
 * No realiza ninguna llamada HTTP al backend.
 * Si las credenciales coinciden, crea una sesión demo y la persiste
 * en AsyncStorage. En caso contrario lanza un error descriptivo.
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
  await setToken(auth.token);
  return auth;
}

/** Cierra sesión eliminando el token local. */
export async function logout(): Promise<void> {
  await clearToken();
}