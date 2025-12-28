import { Router } from 'express';
import { tokenomicsController } from '../controllers/tokenomicsController';
import { u2ePointsController } from '../controllers/u2ePointsController';
import { stakingController } from '../controllers/stakingController';
import { treasuryController } from '../controllers/treasuryController';
import { blockchainController } from '../controllers/blockchainController';

const router = Router();

router.get('/supply', tokenomicsController.getSupply.bind(tokenomicsController));
router.get('/allocation', tokenomicsController.getAllocation.bind(tokenomicsController));
router.get('/revenue-distribution', tokenomicsController.getRevenueDistribution.bind(tokenomicsController));
router.get('/burn-target', tokenomicsController.getBurnTarget.bind(tokenomicsController));
router.get('/governance-params', tokenomicsController.getGovernanceParams.bind(tokenomicsController));

router.get('/u2e/points/values', u2ePointsController.getPointValues.bind(u2ePointsController));
router.post('/u2e/points/track', u2ePointsController.trackAction.bind(u2ePointsController));
router.get('/u2e/user/:userId/points', u2ePointsController.getUserPoints.bind(u2ePointsController));
router.get('/u2e/distribution/calculate', u2ePointsController.calculateDistribution.bind(u2ePointsController));

router.get('/staking/apy/calculate', stakingController.calculateAPY.bind(stakingController));
router.get('/staking/apy/all', stakingController.getAllAPYs.bind(stakingController));
router.get('/staking/emissions/schedule', stakingController.getEmissionSchedule.bind(stakingController));
router.get('/staking/post-year4', stakingController.calculatePostYear4.bind(stakingController));
router.get('/staking/required-profit', stakingController.calculateRequiredProfit.bind(stakingController));

router.get('/treasury/guardrails/status', treasuryController.getGuardrailsStatus.bind(treasuryController));
router.get('/treasury/weekly-spend', treasuryController.getWeeklySpend.bind(treasuryController));
router.get('/treasury/buyback-frequency', treasuryController.getBuybackFrequency.bind(treasuryController));
router.get('/treasury/lp-withdrawal', treasuryController.getLPWithdrawal.bind(treasuryController));

router.get('/blockchain/chains/balances', blockchainController.getChainBalances.bind(blockchainController));
router.get('/blockchain/chains/stats', blockchainController.getCrossChainStats.bind(blockchainController));
router.get('/blockchain/supply/verify', blockchainController.verifySupply.bind(blockchainController));
router.get('/blockchain/chain/:chainName', blockchainController.getChainInfo.bind(blockchainController));

export default router;
