import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Gestor de logs basado en archivo de texto.
 *
 * Escribe cada entrada en `logs.txt` ubicado en la raiz del proyecto (el
 * directorio de trabajo actual al ejecutar el proceso). Las entradas se
 * anexan con una marca de tiempo para facilitar la trazabilidad.
 *
 * Disenado para no depender de librerias externas: usa exclusivamente la API
 * de `node:fs` promisificada.
 */

const LOG_FILE = path.resolve(process.cwd(), "logs.txt");

/**
 * Anexa un mensaje al archivo de logs con su marca de tiempo.
 *
 * @param message Texto a registrar.
 */
export async function log(message: string): Promise<void> {
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] ${message}\n`;
  await fs.appendFile(LOG_FILE, line, "utf8");
}

/**
 * Devuelve el contenido completo del archivo de logs.
 *
 * Si el archivo aun no existe, devuelve una cadena vacia en lugar de lanzar,
 * para que los consumidores puedan leer los logs de forma segura en cualquier
 * momento del ciclo de vida de la aplicacion.
 */
export async function getLogs(): Promise<string> {
  try {
    return await fs.readFile(LOG_FILE, "utf8");
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === "ENOENT") return "";
    throw error;
  }
}

/**
 * Reinicia el archivo de logs. util para pruebas: borra el contenido previo
 * para que cada ejecucion parta de un estado conocido.
 */
export async function clearLogs(): Promise<void> {
  await fs.writeFile(LOG_FILE, "", "utf8");
}