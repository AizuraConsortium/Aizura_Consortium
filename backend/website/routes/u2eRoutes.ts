/**
 * U2E (Use-to-Earn) Routes
 *
 * Public-facing routes for U2E information
 */

import { Router } from 'express';
import { getU2EStats, getRewardRates, getRateHistory, getEarningExamples } from '../controllers/u2eController';

const router = Router();

// Public routes - no authentication required
router.get('/stats', getU2EStats);
router.get('/rates', getRewardRates);
router.get('/history', getRateHistory);
router.get('/examples', getEarningExamples);

export default router;
