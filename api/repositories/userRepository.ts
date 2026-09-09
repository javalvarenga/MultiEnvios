import { query, execute } from "../db/client.js";
import type { User } from "../models/types.js";

interface UserRow {
  id: string;
  email: string;
  password: string;
  name: string;
  balance: number;
}

function toUser(row: UserRow): User {
  return {
    id: row.id,
    email: row.email,
    password: row.password,
    name: row.name,
    balance: Number(row.balance),
  };
}

export const userRepository = {
  async findByEmail(email: string): Promise<User | undefined> {
    const rows = await query<UserRow>(
      "SELECT id, email, password, name, balance FROM users WHERE email = ?",
      [email],
    );
    return rows[0] ? toUser(rows[0]) : undefined;
  },

  async findById(id: string): Promise<User | undefined> {
    const rows = await query<UserRow>(
      "SELECT id, email, password, name, balance FROM users WHERE id = ?",
      [id],
    );
    return rows[0] ? toUser(rows[0]) : undefined;
  },

  async updateBalance(id: string, delta: number): Promise<void> {
    await execute("UPDATE users SET balance = balance + ? WHERE id = ?", [
      delta,
      id,
    ]);
  },
};