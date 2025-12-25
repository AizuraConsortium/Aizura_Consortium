/**
 * U2E Routes
 *
 * Defines API endpoints for U2E system.
 */

import { Router } from 'express';
import { u2eController } from '../controllers/u2eController';
import { requireAuth } from '../../shared/middleware/auth';

const router = Router();

router.use(requireAuth);

router.get('/stats', (req, res) => u2eController.getStats(req, res));

router.get('/breakdown', (req, res) => u2eController.getBreakdown(req, res));

router.get('/history', (req, res) => u2eController.getHistory(req, res));

router.get('/rates', (req, res) => u2eController.getRates(req, res));

router.post('/track', (req, res) => u2eController.trackUsage(req, res));

export default router;
