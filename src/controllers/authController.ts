import type { Request, Response } from "express";
import { login } from "../services/authService.js";

export function loginHandler(req: Request, res: Response): void {
  const { email, password } = req.body ?? {};
  const result = login(email, password);
  if (!result) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  res.json(result);
}
