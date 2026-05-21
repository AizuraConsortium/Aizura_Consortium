import { Request, Response } from 'express';
import { treasuryGuardrails } from '../services/treasuryGuardrails';

export class TreasuryController {
  async getGuardrailsStatus(_req: Request, res: Response): Promise<void> {
    try {
      const health = await treasuryGuardrails.getTreasuryHealth();
      res.json(health);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch guardrails status' });
    }
  }

  async getWeeklySpend(_req: Request, res: Response): Promise<void> {
    try {
      const status = await treasuryGuardrails.checkWeeklySpendCap();
      res.json(status);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch weekly spend' });
    }
  }

  async getBuybackFrequency(_req: Request, res: Response): Promise<void> {
    try {
      const status = await treasuryGuardrails.checkBuybackFrequency();
      res.json(status);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch buyback frequency' });
    }
  }

  async getLPWithdrawal(_req: Request, res: Response): Promise<void> {
    try {
      const status = await treasuryGuardrails.checkLPWithdrawalLimit();
      res.json(status);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch LP withdrawal status' });
    }
  }
}

export const treasuryController = new TreasuryController();
