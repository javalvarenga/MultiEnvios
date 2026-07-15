import { Router } from "express";
import { loginHandler } from "../controllers/authController.js";

export const authRouter = Router();

authRouter.post("/login", loginHandler);
