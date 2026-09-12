import type { Request, Response } from "express";
import { login, register } from "../services/authService.js";

export async function loginHandler(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body ?? {};

  if (!email || typeof email !== "string" ||
      !password || typeof password !== "string") {
    res.status(400).json({ error: "Email y contraseña son requeridos" });
    return;
  }

  try {
    const result = await login(email, password);
    if (!result) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("login error:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function registerHandler(req: Request, res: Response): Promise<void> {
  const { email, password, name } = req.body ?? {};

  if (!email || typeof email !== "string" ||
      !password || typeof password !== "string" ||
      !name || typeof name !== "string") {
    res.status(400).json({ error: "Email, contraseña y nombre son requeridos" });
    return;
  }

  try {
    const result = await register(email, password, name);
    if (!result) {
      res.status(409).json({ error: "El email ya está registrado" });
      return;
    }
    res.status(201).json(result);
  } catch (err) {
    console.error("register error:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
