import { query, callProcedure } from "../db/client.js";
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
      "CALL sp_GetUserByEmail(?)",
      [email],
    );
    return rows[0] ? toUser(rows[0]) : undefined;
  },

  async findById(id: string): Promise<User | undefined> {
    const rows = await query<UserRow>(
      "CALL sp_GetUserById(?)",
      [id],
    );
    return rows[0] ? toUser(rows[0]) : undefined;
  },

  async create(email: string, password: string, name: string): Promise<User | undefined> {
    await callProcedure("CALL sp_InsertUser(?, ?, ?)", [
      email,
      password,
      name,
    ]);
    return this.findByEmail(email);
  },

  async updateBalance(id: string, delta: number): Promise<void> {
    await callProcedure("CALL sp_UpdateUserBalance(?, ?)", [
      id,
      delta,
    ]);
  },
};