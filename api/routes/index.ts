import { Router } from 'express';
import { authRouter } from './auth.js';
import { shipmentRouter } from './shipments.js';
import { dashboardRouter } from './dashboard.js';
import { guideRouter } from './guides.js';

export const router = Router();

router.get('/health', (_req, res) => {
  res.json({ status: "ok" });
});

router.use('/auth', authRouter);
router.use('/shipments', shipmentRouter);
router.use('/dashboard', dashboardRouter);
router.use('/guides', guideRouter);
