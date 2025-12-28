import { Request, Response } from 'express';
import { TOKENOMICS } from '../../../shared/constants/tokenomics';

export class TokenomicsController {
  async getSupply(req: Request, res: Response): Promise<void> {
    try {
      res.json({
        maxSupply: TOKENOMICS.MAX_SUPPLY,
        currentSupply: TOKENOMICS.MAX_SUPPLY,
        burned: 0,
        circulating: 40_000_000,
        locked: 60_000_000,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch supply data' });
    }
  }

  async getAllocation(req: Request, res: Response): Promise<void> {
    try {
      const allocation = Object.entries(TOKENOMICS.ALLOCATION).map(([key, value]) => ({
        category: key.toLowerCase().replace(/_/g, ' '),
        ...value,
      }));

      res.json({
        totalSupply: TOKENOMICS.MAX_SUPPLY,
        allocation,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch allocation data' });
    }
  }

  async getRevenueDistribution(req: Request, res: Response): Promise<void> {
    try {
      const distribution = Object.entries(TOKENOMICS.REVENUE_DISTRIBUTION).map(([key, value]) => ({
        bucket: key.toLowerCase().replace(/_/g, ' '),
        ...value,
      }));

      res.json({ distribution });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch distribution data' });
    }
  }

  async getBurnTarget(req: Request, res: Response): Promise<void> {
    try {
      res.json(TOKENOMICS.BURN);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch burn data' });
    }
  }

  async getGovernanceParams(req: Request, res: Response): Promise<void> {
    try {
      res.json(TOKENOMICS.GOVERNANCE);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch governance params' });
    }
  }
}

export const tokenomicsController = new TokenomicsController();
