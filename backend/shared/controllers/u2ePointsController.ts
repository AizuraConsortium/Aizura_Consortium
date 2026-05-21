import { Request, Response } from 'express';
import { pointsEngine } from '../services/pointsCalculationEngine';

export class U2EPointsController {
  async getPointValues(_req: Request, res: Response): Promise<void> {
    try {
      await pointsEngine.refreshPointValues();
      const values = Array.from((pointsEngine as any).pointValuesCache.values());

      res.json({ pointValues: values });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch point values' });
    }
  }

  async trackAction(_req: Request, res: Response): Promise<void> {
    try {
      const { userId, actionType, metadata } = req.body;

      if (!userId || !actionType) {
        res.status(400).json({ error: 'userId and actionType are required' });
        return;
      }

      const result = await pointsEngine.calculatePoints(userId, actionType, metadata);

      if (!result.success) {
        res.status(400).json(result);
        return;
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to track action' });
    }
  }

  async getUserPoints(_req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { month, year } = req.query;

      if (!month || !year) {
        res.status(400).json({ error: 'month and year query params required' });
        return;
      }

      const result = await pointsEngine.getUserMonthlyPoints(
        userId,
        parseInt(month as string),
        parseInt(year as string)
      );

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user points' });
    }
  }

  async calculateDistribution(_req: Request, res: Response): Promise<void> {
    try {
      const { month, year } = req.query;

      if (!month || !year) {
        res.status(400).json({ error: 'month and year query params required' });
        return;
      }

      const result = await pointsEngine.calculateMonthlyDistribution(
        parseInt(month as string),
        parseInt(year as string)
      );

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to calculate distribution' });
    }
  }
}

export const u2ePointsController = new U2EPointsController();
