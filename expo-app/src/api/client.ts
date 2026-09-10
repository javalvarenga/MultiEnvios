import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

/* eslint-disable @typescript-eslint/no-explicit-any */
declare const process: { env: Record<string, string | undefined> };

/**
 * URL base del API.
 * Se obtiene de la variable de entorno API_URL; si no está definida
 * se usa el backend local por defecto.
 */
export const API_BASE_URL =
  process.env.API_URL ?? "http://localhost:8000/api";

/** Clave usada para persistir el JWT en AsyncStorage. */
export const TOKEN_STORAGE_KEY = "@multienvios_token";

/**
 * Instancia de axios con configuración base.
 * Inyecta automáticamente el token JWT en cada petición
 * a través de un interceptor de solicitud.
 */
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);

/** Guarda el token en AsyncStorage. */
export async function setToken(token: string): Promise<void> {
  await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
}

/** Recupera el token almacenado (o null si no existe). */
export async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_STORAGE_KEY);
}

/** Elimina el token almacenado (logout). */
export async function clearToken(): Promise<void> {
  await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
}