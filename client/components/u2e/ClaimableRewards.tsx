import { Gift, Clock, TrendingUp } from 'lucide-react';

interface ClaimableRewardsProps {
  claimableAmount: number;
  isSystemActive: boolean;
}

export function ClaimableRewards({ claimableAmount, isSystemActive }: ClaimableRewardsProps) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600 rounded-lg">
            <Gift className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Claimable at Token Launch
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your accumulated rewards
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {claimableAmount.toFixed(2)} AAIC
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {isSystemActive
            ? 'Unclaimed rewards ready for distribution'
            : 'Rewards will be available when U2E system activates'}
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
          <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <div className="font-medium text-gray-900 dark:text-white mb-1">
              Token Distribution Timeline
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              <div className="mb-2">
                <strong>Years 0-2:</strong> Fixed rewards from initial token supply
              </div>
              <div className="mb-2">
                <strong>Years 2-4:</strong> Hybrid model (fixed + revenue buyback)
              </div>
              <div>
                <strong>Year 4+:</strong> 100% revenue-buyback model
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
          <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <div className="font-medium text-gray-900 dark:text-white mb-1">
              How Claims Work
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              After token launch, you'll be able to claim your rewards directly to your wallet.
              All rewards are tracked on-chain for full transparency.
            </p>
          </div>
        </div>
      </div>

      {!isSystemActive && (
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-xs text-yellow-800 dark:text-yellow-200">
            The U2E system will activate after the airdrop concludes. Usage tracking before activation is for analytics only. Rewards begin accruing after system activation.
          </p>
        </div>
      )}
    </div>
  );
}
