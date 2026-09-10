import type { Response } from "express";
import type { AuthedRequest } from "../middleware/auth.js";
import {
  settingsRepository,
  type IntegrationSettings,
} from "../repositories/SettingsRepository.js";

/**
 * GET /api/settings
 * Devuelve la lista de configuraciones de couriers persistidas.
 */
export async function listSettingsHandler(
  _req: AuthedRequest,
  res: Response,
): Promise<void> {
  try {
    const settings = await settingsRepository.list();
    res.json(settings);
  } catch (err) {
    console.error("listSettings error:", err);
    res.status(500).json({ error: "Error al listar la configuracion" });
  }
}

/**
 * GET /api/settings/:courier
 * Devuelve la configuracion de un courier concreto.
 */
export async function getSettingsHandler(
  req: AuthedRequest,
  res: Response,
): Promise<void> {
  try {
    const settings = await settingsRepository.find(req.params.courier);
    if (!settings) {
      res.status(404).json({ error: "Configuracion no encontrada" });
      return;
    }
    res.json(settings);
  } catch (err) {
    console.error("getSettings error:", err);
    res.status(500).json({ error: "Error al obtener la configuracion" });
  }
}

/**
 * PUT /api/settings/:courier
 * Persiste (crea o actualiza) la configuracion de un courier.
 *
 * El cuerpo debe contener `isEnabled` (boolean) y `config` (objeto con los
 * campos del formulario de configuracion del courier).
 */
export async function upsertSettingsHandler(
  req: AuthedRequest,
  res: Response,
): Promise<void> {
  const { isEnabled, config } = req.body ?? {};

  if (typeof isEnabled !== "boolean") {
    res.status(400).json({ error: "isEnabled debe ser un valor booleano" });
    return;
  }

  if (!config || typeof config !== "object" || Array.isArray(config)) {
    res.status(400).json({ error: "config debe ser un objeto" });
    return;
  }

  const courier = req.params.courier;

  try {
    const settings: IntegrationSettings = {
      courier,
      isEnabled,
      config,
    };
    const saved = await settingsRepository.upsert(settings);
    res.json(saved);
  } catch (err) {
    console.error("upsertSettings error:", err);
    res.status(500).json({ error: "Error al guardar la configuracion" });
  }
}