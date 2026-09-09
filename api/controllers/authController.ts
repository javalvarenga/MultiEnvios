import type { Request, Response } from "express";
import { login } from "../services/authService.js";

export async function loginHandler(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body ?? {};
  try {
    const result = await login(email, password);
    if (!result) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    res.json(result);
  } catch (err) {
    console.error("login error:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
