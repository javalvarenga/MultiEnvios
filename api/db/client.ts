import mysql, { type Pool, type PoolOptions } from "mysql2/promise";

/**
 * Pool unico de conexiones a MySQL compartido por todos los repositorios.
 *
 * La configuracion se toma de variables de entorno (DB_*). Si faltan, se usan
 * valores por defecto razonables para desarrollo local.
 */
const poolOptions: PoolOptions = {
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? "3306"),
  user: process.env.DB_USER ?? "root",
  password: process.env.DB_PASSWORD ?? "",
  database: process.env.DB_NAME ?? "multienviosgt",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

export const pool: Pool = mysql.createPool(poolOptions);

/**
 * Ejecuta una consulta parametrizada y devuelve las filas tipadas.
 */
export async function query<T = Record<string, unknown>>(
  sql: string,
  values: unknown[] = [],
): Promise<T[]> {
  const [rows] = await pool.query(sql, values as any[]);
  return rows as T[];
}

/**
 * Ejecuta una sentencia (INSERT/UPDATE/DELETE) y devuelve metadatos utiles.
 */
export async function execute(
  sql: string,
  values: unknown[] = [],
): Promise<{ affectedRows: number; insertId: number }> {
  const [result] = await pool.execute(sql, values as any[]);
  const info = result as { affectedRows: number; insertId: number };
  return { affectedRows: info.affectedRows, insertId: info.insertId };
}