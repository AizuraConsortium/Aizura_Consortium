import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { U2EService } from '../../../backend/client/services/u2eService';
import * as supabaseClient from '../../../backend/shared/services/supabase/client';
import { ErrorLogger } from '../../../backend/shared/services/errorLogger';

vi.mock('../../../backend/shared/services/supabase/client');
vi.mock('../../../backend/shared/services/errorLogger');

describe('U2EService', () => {
  let service: U2EService;
  let mockSupabase: any;
  let mockErrorLogger: any;

  beforeEach(() => {
    service = new U2EService();

    mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      is: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      range: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn(),
    };

    vi.mocked(supabaseClient.getSupabaseClient).mockReturnValue(mockSupabase);

    mockErrorLogger = {
      logError: vi.fn().mockResolvedValue({}),
    };
    vi.mocked(ErrorLogger.getInstance).mockReturnValue(mockErrorLogger as any);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getUserStats', () => {
    it('should return user stats successfully', async () => {
      mockSupabase.maybeSingle
        .mockResolvedValueOnce({
          data: {
            total_rewards_earned: 1500,
            current_month_rewards: 500,
            total_usage_count: 150,
            businesses_used: 3,
            top_business: 'AI Traders',
            last_activity_date: '2024-12-01',
            unclaimed_rewards: 1500,
          },
          error: null,
        })
        .mockResolvedValueOnce({
          data: { is_active: true },
          error: null,
        });

      const result = await service.getUserStats('user-123');

      expect(result.total_earned).toBe(1500);
      expect(result.current_month_earned).toBe(500);
      expect(result.total_usage_count).toBe(150);
      expect(result.is_system_active).toBe(true);
    });

    it('should return zero stats for new users', async () => {
      mockSupabase.maybeSingle
        .mockResolvedValueOnce({ data: null, error: null })
        .mockResolvedValueOnce({ data: { is_active: false }, error: null });

      const result = await service.getUserStats('new-user');

      expect(result.total_earned).toBe(0);
      expect(result.current_month_earned).toBe(0);
      expect(result.is_system_active).toBe(false);
    });

    it('should calculate projected monthly earnings', async () => {
      const currentDay = new Date().getDate();
      mockSupabase.maybeSingle
        .mockResolvedValueOnce({
          data: {
            total_rewards_earned: 1000,
            current_month_rewards: 300,
            total_usage_count: 100,
            businesses_used: 2,
            top_business: 'AI Traders',
            last_activity_date: '2024-12-01',
            unclaimed_rewards: 1000,
          },
          error: null,
        })
        .mockResolvedValueOnce({ data: { is_active: true }, error: null });

      const result = await service.getUserStats('user-123');

      expect(result.projected_monthly).toBeGreaterThan(300);
    });
  });

  describe('getBusinessBreakdown', () => {
    it('should aggregate business usage correctly', async () => {
      mockSupabase.from = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            data: [
              {
                business_id: 'b1',
                action_type: 'trade_executed',
                usage_count: 50,
                rewards_earned: 250,
                u2e_businesses: {
                  business_name: 'AI Traders',
                  display_name: 'AI Traders Platform',
                  logo_url: 'https://example.com/logo.png',
                },
                u2e_reward_rates: {
                  action_label: 'Execute Trade',
                },
              },
              {
                business_id: 'b1',
                action_type: 'strategy_deployed',
                usage_count: 5,
                rewards_earned: 125,
                u2e_businesses: {
                  business_name: 'AI Traders',
                  display_name: 'AI Traders Platform',
                  logo_url: 'https://example.com/logo.png',
                },
                u2e_reward_rates: {
                  action_label: 'Deploy Strategy',
                },
              },
            ],
            error: null,
          }),
        }),
      });

      const result = await service.getBusinessBreakdown('user-123');

      expect(result.businesses).toHaveLength(1);
      expect(result.businesses[0].total_usage).toBe(55);
      expect(result.businesses[0].total_rewards).toBe(375);
      expect(result.businesses[0].actions).toHaveLength(2);
      expect(result.total_rewards).toBe(375);
    });

    it('should handle multiple businesses', async () => {
      mockSupabase.from = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            data: [
              {
                business_id: 'b1',
                action_type: 'trade_executed',
                usage_count: 10,
                rewards_earned: 50,
                u2e_businesses: {
                  business_name: 'AI Traders',
                  display_name: 'AI Traders',
                  logo_url: null,
                },
                u2e_reward_rates: { action_label: 'Trade' },
              },
              {
                business_id: 'b2',
                action_type: 'business_created',
                usage_count: 2,
                rewards_earned: 100,
                u2e_businesses: {
                  business_name: 'AI Business Factory',
                  display_name: 'Business Factory',
                  logo_url: null,
                },
                u2e_reward_rates: { action_label: 'Create Business' },
              },
            ],
            error: null,
          }),
        }),
      });

      const result = await service.getBusinessBreakdown('user-123');

      expect(result.businesses).toHaveLength(2);
      expect(result.total_rewards).toBe(150);
    });
  });

  describe('getUsageHistory', () => {
    it('should return paginated usage history', async () => {
      mockSupabase.from = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            gte: vi.fn().mockReturnValue({
              order: vi.fn().mockReturnValue({
                range: vi.fn().mockResolvedValue({
                  data: [
                    {
                      id: 'r1',
                      action_type: 'trade_executed',
                      usage_count: 10,
                      rewards_earned: 50,
                      period_start: '2024-12-01',
                      u2e_businesses: {
                        business_name: 'AI Traders',
                        display_name: 'AI Traders',
                      },
                      u2e_reward_rates: { action_label: 'Execute Trade' },
                    },
                  ],
                  error: null,
                  count: 100,
                }),
              }),
            }),
          }),
        }),
      });

      const result = await service.getUsageHistory('user-123', {
        period: '30d',
        page: 1,
        limit: 50,
      });

      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(100);
      expect(result.has_more).toBe(true);
    });

    it('should filter by business name', async () => {
      let capturedBusinessFilter: string | undefined;
      mockSupabase.from = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn((field: string, value: string) => {
            if (field === 'u2e_businesses.business_name') {
              capturedBusinessFilter = value;
            }
            return {
              gte: vi.fn().mockReturnValue({
                order: vi.fn().mockReturnValue({
                  range: vi.fn().mockResolvedValue({
                    data: [],
                    error: null,
                    count: 0,
                  }),
                }),
              }),
            };
          }),
        }),
      });

      await service.getUsageHistory('user-123', {
        period: '30d',
        business_name: 'AI Traders',
      });

      expect(capturedBusinessFilter).toBe('AI Traders');
    });

    it('should handle different time periods', async () => {
      for (const period of ['7d', '30d', '90d', 'all'] as const) {
        mockSupabase.from = vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              gte: vi.fn().mockReturnValue({
                order: vi.fn().mockReturnValue({
                  range: vi.fn().mockResolvedValue({
                    data: [],
                    error: null,
                    count: 0,
                  }),
                }),
              }),
            }),
          }),
        });

        const result = await service.getUsageHistory('user-123', { period });
        expect(result).toBeDefined();
      }
    });
  });

  describe('getRewardRates', () => {
    it('should return all active reward rates', async () => {
      mockSupabase.from = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            is: vi.fn().mockResolvedValue({
              data: [
                {
                  business_id: 'b1',
                  action_type: 'trade_executed',
                  action_label: 'Execute Trade',
                  rate_per_action: 5,
                  effective_from: '2024-01-01',
                  notes: 'Initial rate',
                  u2e_businesses: {
                    business_name: 'AI Traders',
                    display_name: 'AI Traders',
                  },
                },
              ],
              error: null,
            }),
          }),
        }),
      });

      mockSupabase.maybeSingle.mockResolvedValue({
        data: { global_multiplier: 1.5 },
        error: null,
      });

      const result = await service.getRewardRates();

      expect(result.rates).toHaveLength(1);
      expect(result.global_multiplier).toBe(1.5);
      expect(result.rates[0].rate_per_action).toBe(5);
    });

    it('should filter by business name', async () => {
      let captured Filter: string | undefined;
      mockSupabase.from = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn((field: string, value: any) => {
            if (field === 'u2e_businesses.business_name') {
              capturedFilter = value;
            }
            return {
              is: vi.fn().mockResolvedValue({
                data: [],
                error: null,
              }),
            };
          }),
        }),
      });

      mockSupabase.maybeSingle.mockResolvedValue({
        data: { global_multiplier: 1.0 },
        error: null,
      });

      await service.getRewardRates('AI Traders');

      expect(capturedFilter).toBe('AI Traders');
    });
  });

  describe('toggleSystem', () => {
    it('should activate the U2E system', async () => {
      mockSupabase.maybeSingle.mockResolvedValue({
        data: { id: 'config-1' },
        error: null,
      });

      mockSupabase.from = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          maybeSingle: vi.fn().mockResolvedValue({
            data: { id: 'config-1' },
            error: null,
          }),
        }),
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            error: null,
          }),
        }),
      });

      await service.toggleSystem(true, 'admin-123');

      expect(mockSupabase.from).toHaveBeenCalledWith('u2e_system_config');
    });

    it('should deactivate the U2E system', async () => {
      mockSupabase.from = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          maybeSingle: vi.fn().mockResolvedValue({
            data: { id: 'config-1' },
            error: null,
          }),
        }),
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            error: null,
          }),
        }),
      });

      await service.toggleSystem(false, 'admin-123');

      expect(mockSupabase.from).toHaveBeenCalledWith('u2e_system_config');
    });

    it('should throw error if config not found', async () => {
      mockSupabase.from = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          maybeSingle: vi.fn().mockResolvedValue({
            data: null,
            error: null,
          }),
        }),
      });

      await expect(service.toggleSystem(true, 'admin-123')).rejects.toThrow(
        'U2E system config not found'
      );
    });
  });

  describe('updateRewardRate', () => {
    it('should update reward rate with versioning', async () => {
      mockSupabase.from = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({
              data: { id: 'business-123' },
              error: null,
            }),
          }),
        }),
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            is: vi.fn().mockResolvedValue({
              error: null,
            }),
          }),
        }),
        insert: vi.fn().mockResolvedValue({
          error: null,
        }),
      });

      await service.updateRewardRate(
        'AI Traders',
        'trade_executed',
        10,
        'admin-123',
        'Increased rate'
      );

      expect(mockSupabase.from).toHaveBeenCalledWith('u2e_reward_rates');
    });

    it('should throw error if business not found', async () => {
      mockSupabase.from = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({
              data: null,
              error: null,
            }),
          }),
        }),
      });

      await expect(
        service.updateRewardRate('Invalid', 'trade_executed', 10, 'admin-123')
      ).rejects.toThrow("Business 'Invalid' not found");
    });
  });

  describe('Error Handling', () => {
    it('should log and rethrow errors', async () => {
      mockSupabase.maybeSingle.mockRejectedValue(new Error('Database error'));

      await expect(service.getUserStats('user-123')).rejects.toThrow();
      expect(mockErrorLogger.logError).toHaveBeenCalled();
    });
  });
});
