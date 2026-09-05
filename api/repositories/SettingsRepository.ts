/**
 * Repositorio en memoria para la configuracion de integraciones por courier.
 *
 * Sustituye a la tabla `IntegrationSettings` del diseno multi-tenant: cada
 * tenant (schema) guarda una fila por courier con su habilitacion y los campos
 * del formulario de configuracion (ver `CourierConfig` en la app web).
 *
 * En una futura migracion a MySQL este repositorio se reescribira contra la
 * tabla real sin cambiar su interfaz publica.
 */
export interface IntegrationSettings {
  courier: string;
  tenantSchema: string;
  isEnabled: boolean;
  config: Record<string, string>;
}

const store: Map<string, IntegrationSettings> = new Map();

function key(courier: string, tenantSchema: string): string {
  return `${tenantSchema ?? "default"}:${courier}`;
}

export const settingsRepository = {
  upsert(settings: IntegrationSettings): IntegrationSettings {
    store.set(key(settings.courier, settings.tenantSchema), settings);
    return settings;
  },
  find(courier: string, tenantSchema: string): IntegrationSettings | undefined {
    return store.get(key(courier, tenantSchema));
  },
  list(tenantSchema: string): IntegrationSettings[] {
    const prefix = `${tenantSchema ?? "default"}:`;
    return [...store.values()].filter((s) =>
      key(s.courier, s.tenantSchema).startsWith(prefix),
    );
  },
};

/**
 * Devuelve la configuracion cruda de la integracion de un courier para un
 * tenant: `undefined` cuando no existe fila (causa que el llamador caiga a
 * variables de entorno), o `{ isEnabled, config }` cuando existe.
 */
export function getIntegrationRaw(
  courier: string,
  tenantSchema?: string,
): IntegrationSettings | undefined {
  return settingsRepository.find(courier, tenantSchema ?? "default");
}