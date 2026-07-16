import type { Request, Response, NextFunction } from "express";
import { verify } from "../services/authService.js";

export interface AuthedRequest extends Request {
  userId?: string;
}

export function authMiddleware(
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
): void {
  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const userId = verify(token);
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  req.userId = userId;
  next();
}
