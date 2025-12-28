import { Request, Response } from 'express';
import { crossChainTracking } from '../services/crossChainTracking';

export class BlockchainController {
  async getChainBalances(req: Request, res: Response): Promise<void> {
    try {
      const balances = await crossChainTracking.getChainBalances();
      res.json({ chains: balances });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch chain balances' });
    }
  }

  async getCrossChainStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await crossChainTracking.getCrossChainStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch cross-chain stats' });
    }
  }

  async verifySupply(req: Request, res: Response): Promise<void> {
    try {
      const verification = await crossChainTracking.verifySupplyIntegrity();
      res.json(verification);
    } catch (error) {
      res.status(500).json({ error: 'Failed to verify supply' });
    }
  }

  async getChainInfo(req: Request, res: Response): Promise<void> {
    try {
      const { chainName } = req.params;

      const info = await crossChainTracking.getChainInfo(chainName);

      if (!info) {
        res.status(404).json({ error: 'Chain not found' });
        return;
      }

      res.json(info);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch chain info' });
    }
  }
}

export const blockchainController = new BlockchainController();
