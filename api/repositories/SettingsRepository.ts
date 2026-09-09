import { query, execute } from "../db/client.js";

/**
 * Repositorio para la configuracion de integraciones por courier, persistido
 * en la tabla `integration_settings` de MySQL.
 *
 * Cada courier guarda una fila con su habilitacion y los campos del formulario
 * de configuracion (ver `CourierConfig` en la app web).
 */
export interface IntegrationSettings {
  courier: string;
  isEnabled: boolean;
  config: Record<string, string>;
}

interface SettingsRow {
  courier: string;
  isEnabled: number;
  config: string | null;
}

function toSettings(row: SettingsRow): IntegrationSettings {
  return {
    courier: row.courier,
    isEnabled: Boolean(row.isEnabled),
    config: row.config ? (JSON.parse(row.config) as Record<string, string>) : {},
  };
}

export const settingsRepository = {
  async upsert(settings: IntegrationSettings): Promise<IntegrationSettings> {
    await execute(
      `INSERT INTO integration_settings (courier, isEnabled, config)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE isEnabled = VALUES(isEnabled), config = VALUES(config)`,
      [settings.courier, settings.isEnabled, JSON.stringify(settings.config)],
    );
    return settings;
  },

  async find(courier: string): Promise<IntegrationSettings | undefined> {
    const rows = await query<SettingsRow>(
      "SELECT courier, isEnabled, config FROM integration_settings WHERE courier = ?",
      [courier],
    );
    return rows[0] ? toSettings(rows[0]) : undefined;
  },

  async list(): Promise<IntegrationSettings[]> {
    const rows = await query<SettingsRow>(
      "SELECT courier, isEnabled, config FROM integration_settings",
    );
    return rows.map(toSettings);
  },
};

/**
 * Devuelve la configuracion cruda de la integracion de un courier:
 * `undefined` cuando no existe fila (causa que el llamador caiga a variables
 * de entorno), o `{ isEnabled, config }` cuando existe.
 */
export async function getIntegrationRaw(
  courier: string,
): Promise<IntegrationSettings | undefined> {
  return settingsRepository.find(courier);
}