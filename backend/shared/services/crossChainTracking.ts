import { TOKENOMICS } from '../../../shared/constants/tokenomics';

interface ChainBalance {
  chain: string;
  balance: number;
  lastUpdated: Date;
}

interface CrossChainStats {
  totalSupply: number;
  expectedSupply: number;
  balanced: boolean;
  chains: ChainBalance[];
  canonicalChain: string;
}

export class CrossChainTrackingService {
  private readonly MAX_SUPPLY = TOKENOMICS.MAX_SUPPLY;
  private readonly CANONICAL_CHAIN = TOKENOMICS.CHAINS.CANONICAL;

  async getChainBalances(): Promise<ChainBalance[]> {
    const allChains = [...TOKENOMICS.CHAINS.V1, ...TOKENOMICS.CHAINS.V2];

    const balances: ChainBalance[] = allChains.map(chain => ({
      chain,
      balance: this.mockGetBalance(chain),
      lastUpdated: new Date(),
    }));

    return balances;
  }

  async getCrossChainStats(): Promise<CrossChainStats> {
    const chains = await this.getChainBalances();
    const totalSupply = chains.reduce((sum, chain) => sum + chain.balance, 0);

    return {
      totalSupply,
      expectedSupply: this.MAX_SUPPLY,
      balanced: Math.abs(totalSupply - this.MAX_SUPPLY) < 1,
      chains,
      canonicalChain: this.CANONICAL_CHAIN,
    };
  }

  async verifySupplyIntegrity(): Promise<{
    valid: boolean;
    discrepancy?: number;
    message: string;
  }> {
    const stats = await this.getCrossChainStats();
    const discrepancy = stats.totalSupply - stats.expectedSupply;

    if (Math.abs(discrepancy) < 1) {
      return {
        valid: true,
        message: 'Supply integrity verified across all chains',
      };
    }

    return {
      valid: false,
      discrepancy,
      message: `Supply discrepancy detected: ${discrepancy > 0 ? '+' : ''}${discrepancy} AAIC`,
    };
  }

  private mockGetBalance(chain: string): number {
    const allocations: Record<string, number> = {
      'BNB Chain': 40_000_000,
      'Base': 15_000_000,
      'Avalanche': 15_000_000,
      'Sui': 15_000_000,
      'Hyperliquid': 15_000_000,
      'Optimism': 0,
      'Fantom': 0,
      'Solana': 0,
    };

    return allocations[chain] || 0;
  }

  async getChainInfo(chainName: string): Promise<{
    chain: string;
    balance: number;
    percentage: number;
    isCanonical: boolean;
    phase: 'v1' | 'v2';
    active: boolean;
  } | null> {
    const allChains: string[] = [...TOKENOMICS.CHAINS.V1, ...TOKENOMICS.CHAINS.V2];

    if (!allChains.includes(chainName)) {
      return null;
    }

    const balance = this.mockGetBalance(chainName);
    const percentage = (balance / this.MAX_SUPPLY) * 100;
    const v1Chains: string[] = [...TOKENOMICS.CHAINS.V1];

    return {
      chain: chainName,
      balance,
      percentage,
      isCanonical: chainName === this.CANONICAL_CHAIN,
      phase: v1Chains.includes(chainName) ? 'v1' : 'v2',
      active: balance > 0,
    };
  }
}

export const crossChainTracking = new CrossChainTrackingService();
