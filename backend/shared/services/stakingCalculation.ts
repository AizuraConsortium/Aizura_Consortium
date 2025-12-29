import { TOKENOMICS } from '../../../shared/constants/tokenomics';

interface StakingAPY {
  lockPeriodDays: number;
  baseAPY: number;
  multiplier: number;
  finalAPY: number;
}

interface EmissionSchedule {
  year: number;
  yearlyEmission: number;
  monthlyEmission: number;
}

export class StakingCalculationService {
  calculateAPY(
    totalStaked: number,
    year: 1 | 2 | 3 | 4,
    lockPeriodDays: number
  ): number {
    const yearlyEmissions = TOKENOMICS.ALLOCATION.STAKING.yearlyEmissions;
    const emission = yearlyEmissions[year];

    const baseAPY = (emission / totalStaked) * 100;

    const multiplier = this.getLockMultiplier(lockPeriodDays);

    return baseAPY * multiplier;
  }

  getLockMultiplier(lockPeriodDays: number): number {
    const multipliers = TOKENOMICS.STAKING_MULTIPLIERS;

    if (lockPeriodDays >= 365) return multipliers.LOCK_365;
    if (lockPeriodDays >= 180) return multipliers.LOCK_180;
    if (lockPeriodDays >= 90) return multipliers.LOCK_90;
    return multipliers.LOCK_30;
  }

  getAllAPYs(totalStaked: number, year: 1 | 2 | 3 | 4): StakingAPY[] {
    const lockPeriods = [
      { days: 30, multiplier: TOKENOMICS.STAKING_MULTIPLIERS.LOCK_30 },
      { days: 90, multiplier: TOKENOMICS.STAKING_MULTIPLIERS.LOCK_90 },
      { days: 180, multiplier: TOKENOMICS.STAKING_MULTIPLIERS.LOCK_180 },
      { days: 365, multiplier: TOKENOMICS.STAKING_MULTIPLIERS.LOCK_365 },
    ];

    const yearlyEmissions = TOKENOMICS.ALLOCATION.STAKING.yearlyEmissions;
    const emission = yearlyEmissions[year];
    const baseAPY = (emission / totalStaked) * 100;

    return lockPeriods.map(period => ({
      lockPeriodDays: period.days,
      baseAPY,
      multiplier: period.multiplier,
      finalAPY: baseAPY * period.multiplier,
    }));
  }

  getEmissionSchedule(): EmissionSchedule[] {
    const yearlyEmissions = TOKENOMICS.ALLOCATION.STAKING.yearlyEmissions;

    return Object.entries(yearlyEmissions).map(([year, amount]) => ({
      year: parseInt(year),
      yearlyEmission: amount,
      monthlyEmission: Math.round(amount / 12),
    }));
  }

  calculatePostYear4Rewards(monthlyProfit: number, aaicPrice: number): {
    rewardBudgetUSD: number;
    stakingShareUSD: number;
    stakingShareAAIC: number;
  } {
    const rewardPercentage = TOKENOMICS.REVENUE_DISTRIBUTION.STAKING.percentage +
                             TOKENOMICS.REVENUE_DISTRIBUTION.USE_TO_EARN.percentage;

    const rewardBudgetUSD = monthlyProfit * (rewardPercentage / 100);
    const stakingShareUSD = rewardBudgetUSD * 0.5;
    const stakingShareAAIC = stakingShareUSD / aaicPrice;

    return {
      rewardBudgetUSD,
      stakingShareUSD,
      stakingShareAAIC,
    };
  }

  calculateRequiredProfit(
    desiredAAICDistribution: number,
    aaicPrice: number
  ): number {
    const totalNeededUSD = desiredAAICDistribution * aaicPrice;

    const rewardPercentage = TOKENOMICS.REVENUE_DISTRIBUTION.STAKING.percentage +
                             TOKENOMICS.REVENUE_DISTRIBUTION.USE_TO_EARN.percentage;

    const requiredProfit = totalNeededUSD / (rewardPercentage / 100);

    return requiredProfit;
  }
}

export const stakingCalculation = new StakingCalculationService();
