/**
 * P2U (Pay-to-Use / Use-to-Earn) Routes
 *
 * Public-facing routes for P2U information
 */

import { Router } from 'express';
import { getP2UStats, getRewardRates, getRateHistory, getEarningExamples } from '../controllers/p2uController';

const router = Router();

// Public routes - no authentication required
router.get('/stats', getP2UStats);
router.get('/rates', getRewardRates);
router.get('/history', getRateHistory);
router.get('/examples', getEarningExamples);

export default router;
