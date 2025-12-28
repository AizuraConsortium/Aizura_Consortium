export const TOKENOMICS = {
  MAX_SUPPLY: 100_000_000,

  ALLOCATION: {
    AIRDROP: {
      amount: 8_000_000,
      percentage: 8,
      description: 'Community airdrop for early supporters',
    },
    USE_TO_EARN: {
      amount: 22_000_000,
      percentage: 22,
      description: 'Use-to-Earn rewards pool (48 months)',
      monthlyEmission: 458_333,
    },
    STAKING: {
      amount: 15_000_000,
      percentage: 15,
      description: 'Staking rewards pool (48 months)',
      yearlyEmissions: {
        1: 5_000_000,
        2: 4_000_000,
        3: 3_500_000,
        4: 2_500_000,
      },
    },
    TREASURY: {
      amount: 15_000_000,
      percentage: 15,
      description: 'DAO-controlled treasury',
    },
    LIQUIDITY: {
      amount: 6_000_000,
      percentage: 6,
      description: 'Multi-chain DEX liquidity',
    },
    MARKET_OPS: {
      amount: 7_000_000,
      percentage: 7,
      description: 'Market operations and business development',
    },
    TEAM: {
      amount: 16_000_000,
      percentage: 16,
      description: '36-month linear vesting, NO CLIFF',
      vestingMonths: 36,
    },
    INVESTORS: {
      amount: 8_000_000,
      percentage: 8,
      description: 'NO VESTING (immediate unlock, labeled wallets)',
    },
    ADVISORS: {
      amount: 3_000_000,
      percentage: 3,
      description: '12-month linear vesting, NO CLIFF',
      vestingMonths: 12,
    },
  },

  BURN: {
    targetAmount: 21_000_000,
    finalSupply: 79_000_000,
    revenuePercentage: 30,
  },

  REVENUE_DISTRIBUTION: {
    BUYBACK_BURN: {
      percentage: 30,
      description: 'Market buyback → permanent burn',
    },
    STAKING: {
      percentage: 15,
      description: 'Staking rewards (post-Year 4)',
    },
    USE_TO_EARN: {
      percentage: 15,
      description: 'Use-to-Earn pool (post-Year 4)',
    },
    TREASURY: {
      percentage: 20,
      description: 'DAO treasury allocation',
    },
    VARIABLE: {
      percentage: 20,
      description: 'Governance-adjustable bucket',
    },
  },

  STAKING_MULTIPLIERS: {
    LOCK_30: 1.0,
    LOCK_90: 1.2,
    LOCK_180: 1.5,
    LOCK_365: 2.0,
  },

  GOVERNANCE: {
    DAO: {
      minTokens: 50_000,
      votingDays: 14,
      quorumPercentage: 20,
    },
    LAUNCHPAD: {
      depositAmount: 1_000,
      votingDays: 7,
      quorumPercentage: 5,
    },
  },

  CHAINS: {
    V1: ['BNB Chain', 'Base', 'Avalanche', 'Sui', 'Hyperliquid'],
    V2: ['Optimism', 'Fantom', 'Solana'],
    CANONICAL: 'BNB Chain',
  },

  TREASURY_GUARDRAILS: {
    WEEKLY_SPEND_CAP: 100_000,
    BUYBACK_MIN_FREQUENCY_HOURS: 24,
    LP_WITHDRAWAL_MAX_PERCENTAGE: 20,
    ALLOWLIST_REQUIRED: true,
  },
} as const;

export type TokenAllocation = typeof TOKENOMICS.ALLOCATION;
export type RevenueDistribution = typeof TOKENOMICS.REVENUE_DISTRIBUTION;
export type StakingMultipliers = typeof TOKENOMICS.STAKING_MULTIPLIERS;
export type GovernanceParams = typeof TOKENOMICS.GOVERNANCE;
