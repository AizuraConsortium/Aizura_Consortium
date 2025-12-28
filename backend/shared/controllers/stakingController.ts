import { Request, Response } from 'express';
import { stakingCalculation } from '../services/stakingCalculation';

export class StakingController {
  async calculateAPY(req: Request, res: Response): Promise<void> {
    try {
      const { totalStaked, year, lockPeriodDays } = req.query;

      if (!totalStaked || !year || !lockPeriodDays) {
        res.status(400).json({
          error: 'totalStaked, year, and lockPeriodDays query params required',
        });
        return;
      }

      const apy = stakingCalculation.calculateAPY(
        parseInt(totalStaked as string),
        parseInt(year as string) as 1 | 2 | 3 | 4,
        parseInt(lockPeriodDays as string)
      );

      res.json({
        totalStaked: parseInt(totalStaked as string),
        year: parseInt(year as string),
        lockPeriodDays: parseInt(lockPeriodDays as string),
        apy,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to calculate APY' });
    }
  }

  async getAllAPYs(req: Request, res: Response): Promise<void> {
    try {
      const { totalStaked, year } = req.query;

      if (!totalStaked || !year) {
        res.status(400).json({ error: 'totalStaked and year query params required' });
        return;
      }

      const apys = stakingCalculation.getAllAPYs(
        parseInt(totalStaked as string),
        parseInt(year as string) as 1 | 2 | 3 | 4
      );

      res.json({
        totalStaked: parseInt(totalStaked as string),
        year: parseInt(year as string),
        apys,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch APYs' });
    }
  }

  async getEmissionSchedule(req: Request, res: Response): Promise<void> {
    try {
      const schedule = stakingCalculation.getEmissionSchedule();
      res.json({ schedule });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch emission schedule' });
    }
  }

  async calculatePostYear4(req: Request, res: Response): Promise<void> {
    try {
      const { monthlyProfit, aaicPrice } = req.query;

      if (!monthlyProfit || !aaicPrice) {
        res.status(400).json({ error: 'monthlyProfit and aaicPrice query params required' });
        return;
      }

      const result = stakingCalculation.calculatePostYear4Rewards(
        parseFloat(monthlyProfit as string),
        parseFloat(aaicPrice as string)
      );

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to calculate post-Year 4 rewards' });
    }
  }

  async calculateRequiredProfit(req: Request, res: Response): Promise<void> {
    try {
      const { desiredAAIC, aaicPrice } = req.query;

      if (!desiredAAIC || !aaicPrice) {
        res.status(400).json({ error: 'desiredAAIC and aaicPrice query params required' });
        return;
      }

      const requiredProfit = stakingCalculation.calculateRequiredProfit(
        parseFloat(desiredAAIC as string),
        parseFloat(aaicPrice as string)
      );

      res.json({
        desiredAAIC: parseFloat(desiredAAIC as string),
        aaicPrice: parseFloat(aaicPrice as string),
        requiredProfit,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to calculate required profit' });
    }
  }
}

export const stakingController = new StakingController();
