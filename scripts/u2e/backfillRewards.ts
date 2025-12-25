/**
 * U2E Rewards Backfill Script
 *
 * Recalculates and backfills U2E rewards for historical events when:
 * - Reward rates change retroactively
 * - System errors cause missed calculations
 * - Database migrations require recalculation
 *
 * Usage:
 *   tsx scripts/u2e/backfillRewards.ts --start-date=2024-01-01 --end-date=2024-12-31
 *   tsx scripts/u2e/backfillRewards.ts --user-id=user-123
 *   tsx scripts/u2e/backfillRewards.ts --dry-run
 */

import { getSupabaseClient } from '../../backend/shared/services/supabase/client';
import { ErrorLogger } from '../../backend/shared/services/errorLogger';

const supabaseClient = getSupabaseClient();
const errorLogger = ErrorLogger.getInstance();

interface BackfillOptions {
  startDate?: string;
  endDate?: string;
  userId?: string;
  businessId?: string;
  dryRun?: boolean;
  batchSize?: number;
}

interface BackfillStats {
  eventsProcessed: number;
  rewardsRecalculated: number;
  errorsEncountered: number;
  totalRewardsDifference: number;
}

export class RewardsBackfill {
  private stats: BackfillStats = {
    eventsProcessed: 0,
    rewardsRecalculated: 0,
    errorsEncountered: 0,
    totalRewardsDifference: 0,
  };

  async run(options: BackfillOptions): Promise<BackfillStats> {
    console.log('Starting U2E Rewards Backfill');
    console.log('Options:', JSON.stringify(options, null, 2));

    if (options.dryRun) {
      console.log('\n🚨 DRY RUN MODE - No changes will be made 🚨\n');
    }

    try {
      const events = await this.fetchEvents(options);
      console.log(`Found ${events.length} events to process`);

      await this.processEventsInBatches(events, options);

      console.log('\n✅ Backfill Complete');
      console.log('Stats:', JSON.stringify(this.stats, null, 2));

      return this.stats;
    } catch (error) {
      await errorLogger.logError({
        source: 'backend',
        severity: 'critical',
        errorType: 'U2E_BACKFILL_ERROR',
        message: `Backfill failed: ${(error as Error).message}`,
        details: {
          stackTrace: (error as Error).stack,
          metadata: options,
        },
      });
      throw error;
    }
  }

  private async fetchEvents(options: BackfillOptions) {
    let query = supabaseClient
      .from('u2e_usage_events')
      .select('id, user_id, business_id, action_type, created_at')
      .order('created_at', { ascending: true });

    if (options.startDate) {
      query = query.gte('created_at', options.startDate);
    }

    if (options.endDate) {
      query = query.lte('created_at', options.endDate);
    }

    if (options.userId) {
      query = query.eq('user_id', options.userId);
    }

    if (options.businessId) {
      query = query.eq('business_id', options.businessId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  private async processEventsInBatches(
    events: any[],
    options: BackfillOptions
  ) {
    const batchSize = options.batchSize || 100;
    const totalBatches = Math.ceil(events.length / batchSize);

    for (let i = 0; i < events.length; i += batchSize) {
      const batch = events.slice(i, i + batchSize);
      const batchNum = Math.floor(i / batchSize) + 1;

      console.log(`Processing batch ${batchNum}/${totalBatches}...`);

      await this.processBatch(batch, options);

      await this.sleep(100);
    }
  }

  private async processBatch(events: any[], options: BackfillOptions) {
    for (const event of events) {
      try {
        await this.processEvent(event, options);
        this.stats.eventsProcessed++;
      } catch (error) {
        this.stats.errorsEncountered++;
        console.error(`Error processing event ${event.id}:`, error);
      }
    }
  }

  private async processEvent(event: any, options: BackfillOptions) {
    const rate = await this.getRewardRate(
      event.business_id,
      event.action_type,
      event.created_at
    );

    if (!rate) {
      console.warn(`No rate found for event ${event.id}`);
      return;
    }

    const calculatedReward = rate.rate_per_action;

    const { data: existingReward } = await supabaseClient
      .from('u2e_usage_rewards')
      .select('rewards_earned')
      .eq('user_id', event.user_id)
      .eq('business_id', event.business_id)
      .eq('action_type', event.action_type)
      .maybeSingle();

    const difference = calculatedReward - (existingReward?.rewards_earned || 0);

    if (Math.abs(difference) > 0.01) {
      if (!options.dryRun) {
        await this.updateReward(event, calculatedReward);
      }

      this.stats.rewardsRecalculated++;
      this.stats.totalRewardsDifference += difference;

      console.log(
        `Event ${event.id}: ${existingReward?.rewards_earned || 0} → ${calculatedReward} (${difference > 0 ? '+' : ''}${difference.toFixed(2)} AAIC)`
      );
    }
  }

  private async getRewardRate(
    businessId: string,
    actionType: string,
    eventDate: string
  ) {
    const { data, error } = await supabaseClient
      .from('u2e_reward_rates')
      .select('rate_per_action')
      .eq('business_id', businessId)
      .eq('action_type', actionType)
      .lte('effective_from', eventDate)
      .or(`effective_to.gte.${eventDate},effective_to.is.null`)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  private async updateReward(event: any, newReward: number) {
    const { error } = await supabaseClient.from('u2e_usage_rewards').upsert({
      user_id: event.user_id,
      business_id: event.business_id,
      action_type: event.action_type,
      usage_count: 1,
      rewards_earned: newReward,
      period_start: event.created_at,
    });

    if (error) throw error;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const options: BackfillOptions = {
    dryRun: args.includes('--dry-run'),
    batchSize: 100,
  };

  args.forEach(arg => {
    if (arg.startsWith('--start-date=')) {
      options.startDate = arg.split('=')[1];
    } else if (arg.startsWith('--end-date=')) {
      options.endDate = arg.split('=')[1];
    } else if (arg.startsWith('--user-id=')) {
      options.userId = arg.split('=')[1];
    } else if (arg.startsWith('--business-id=')) {
      options.businessId = arg.split('=')[1];
    } else if (arg.startsWith('--batch-size=')) {
      options.batchSize = parseInt(arg.split('=')[1], 10);
    }
  });

  new RewardsBackfill()
    .run(options)
    .then(() => {
      console.log('\n✅ Backfill completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Backfill failed:', error);
      process.exit(1);
    });
}
