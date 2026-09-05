/**
 * Repositorio en memoria para la configuracion de integraciones por courier.
 *
 * Cada courier guarda una fila con su habilitacion y los campos del formulario
 * de configuracion (ver `CourierConfig` en la app web).
 *
 * En una futura migracion a MySQL este repositorio se reescribira contra la
 * tabla real sin cambiar su interfaz publica.
 */
export interface IntegrationSettings {
  courier: string;
  isEnabled: boolean;
  config: Record<string, string>;
}

const store: Map<string, IntegrationSettings> = new Map();

export const settingsRepository = {
  upsert(settings: IntegrationSettings): IntegrationSettings {
    store.set(settings.courier, settings);
    return settings;
  },
  find(courier: string): IntegrationSettings | undefined {
    return store.get(courier);
  },
  list(): IntegrationSettings[] {
    return [...store.values()];
  },
};

/**
 * Devuelve la configuracion cruda de la integracion de un courier:
 * `undefined` cuando no existe fila (causa que el llamador caiga a variables
 * de entorno), o `{ isEnabled, config }` cuando existe.
 */
export function getIntegrationRaw(
  courier: string,
): IntegrationSettings | undefined {
  return settingsRepository.find(courier);
}