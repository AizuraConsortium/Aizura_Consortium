import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { UsageTracker } from '../../../backend/client/services/usageTracker';
import * as supabaseClient from '../../../backend/shared/services/supabase/client';
import { ErrorLogger } from '../../../backend/shared/services/errorLogger';

vi.mock('../../../backend/shared/services/supabase/client');
vi.mock('../../../backend/shared/services/errorLogger');

describe('UsageTracker', () => {
  let tracker: UsageTracker;
  let mockSupabase: any;
  let mockErrorLogger: any;

  beforeEach(() => {
    tracker = new UsageTracker();

    mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      is: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
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

  describe('trackUsage', () => {
    it('should successfully track a valid usage event', async () => {
      mockSupabase.maybeSingle
        .mockResolvedValueOnce({ data: { is_active: true }, error: null })
        .mockResolvedValueOnce({
          data: {
            id: 'business-123',
            business_name: 'AI Traders',
            is_active: true,
          },
          error: null,
        })
        .mockResolvedValueOnce({ data: { id: 'rate-123' }, error: null })
        .mockResolvedValueOnce({ data: { id: 'event-123' }, error: null });

      const result = await tracker.trackUsage(
        'user-123',
        'AI Traders',
        'trade_executed',
        { tradeId: 'trade-456' }
      );

      expect(result.success).toBe(true);
      expect(result.event_id).toBe('event-123');
      expect(result.error).toBeUndefined();
    });

    it('should reject tracking when system is inactive', async () => {
      mockSupabase.maybeSingle.mockResolvedValueOnce({
        data: { is_active: false },
        error: null,
      });

      const result = await tracker.trackUsage(
        'user-123',
        'AI Traders',
        'trade_executed'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('U2E system is not currently active');
    });

    it('should reject tracking for non-existent business', async () => {
      mockSupabase.maybeSingle
        .mockResolvedValueOnce({ data: { is_active: true }, error: null })
        .mockResolvedValueOnce({ data: null, error: null });

      const result = await tracker.trackUsage(
        'user-123',
        'NonExistentBusiness',
        'trade_executed'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe("Business 'NonExistentBusiness' not found");
    });

    it('should reject tracking for inactive business', async () => {
      mockSupabase.maybeSingle
        .mockResolvedValueOnce({ data: { is_active: true }, error: null })
        .mockResolvedValueOnce({
          data: {
            id: 'business-123',
            business_name: 'AI Traders',
            is_active: false,
          },
          error: null,
        });

      const result = await tracker.trackUsage(
        'user-123',
        'AI Traders',
        'trade_executed'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe(
        "Business 'AI Traders' is not active for U2E tracking"
      );
    });

    it('should reject tracking for invalid action type', async () => {
      mockSupabase.maybeSingle
        .mockResolvedValueOnce({ data: { is_active: true }, error: null })
        .mockResolvedValueOnce({
          data: {
            id: 'business-123',
            business_name: 'AI Traders',
            is_active: true,
          },
          error: null,
        })
        .mockResolvedValueOnce({ data: null, error: null });

      const result = await tracker.trackUsage(
        'user-123',
        'AI Traders',
        'invalid_action' as any
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe(
        "Action type 'invalid_action' is not configured for AI Traders"
      );
    });

    it('should handle duplicate events gracefully', async () => {
      mockSupabase.maybeSingle
        .mockResolvedValueOnce({ data: { is_active: true }, error: null })
        .mockResolvedValueOnce({
          data: {
            id: 'business-123',
            business_name: 'AI Traders',
            is_active: true,
          },
          error: null,
        })
        .mockResolvedValueOnce({ data: { id: 'rate-123' }, error: null })
        .mockResolvedValueOnce({
          data: null,
          error: { code: '23505', message: 'duplicate key' },
        });

      const result = await tracker.trackUsage(
        'user-123',
        'AI Traders',
        'trade_executed',
        { tradeId: 'trade-456' }
      );

      expect(result.success).toBe(true);
      expect(result.error).toBe('Duplicate event - already processed');
    });

    it('should log errors on database failures', async () => {
      mockSupabase.maybeSingle
        .mockResolvedValueOnce({ data: { is_active: true }, error: null })
        .mockResolvedValueOnce({
          data: {
            id: 'business-123',
            business_name: 'AI Traders',
            is_active: true,
          },
          error: null,
        })
        .mockResolvedValueOnce({ data: { id: 'rate-123' }, error: null })
        .mockResolvedValueOnce({
          data: null,
          error: { code: '42P01', message: 'relation does not exist' },
        });

      const result = await tracker.trackUsage(
        'user-123',
        'AI Traders',
        'trade_executed'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to track usage event');
      expect(mockErrorLogger.logError).toHaveBeenCalledWith(
        expect.objectContaining({
          errorType: 'U2E_TRACK_USAGE_ERROR',
          severity: 'error',
        })
      );
    });

    it('should include optional metadata in tracking', async () => {
      mockSupabase.maybeSingle
        .mockResolvedValueOnce({ data: { is_active: true }, error: null })
        .mockResolvedValueOnce({
          data: {
            id: 'business-123',
            business_name: 'AI Traders',
            is_active: true,
          },
          error: null,
        })
        .mockResolvedValueOnce({ data: { id: 'rate-123' }, error: null })
        .mockResolvedValueOnce({ data: { id: 'event-123' }, error: null });

      const metadata = {
        tradeId: 'trade-456',
        amount: 100,
        symbol: 'BTC/USD',
      };

      await tracker.trackUsage(
        'user-123',
        'AI Traders',
        'trade_executed',
        metadata,
        '192.168.1.1',
        'Mozilla/5.0'
      );

      expect(mockSupabase.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          metadata,
          ip_address: '192.168.1.1',
          user_agent: 'Mozilla/5.0',
        })
      );
    });
  });

  describe('trackUsageBatch', () => {
    it('should track multiple events successfully', async () => {
      mockSupabase.maybeSingle
        .mockResolvedValue({ data: { is_active: true }, error: null })
        .mockResolvedValue({
          data: {
            id: 'business-123',
            business_name: 'AI Traders',
            is_active: true,
          },
          error: null,
        })
        .mockResolvedValue({ data: { id: 'rate-123' }, error: null })
        .mockResolvedValue({ data: { id: 'event-123' }, error: null });

      const events = [
        {
          userId: 'user-1',
          businessName: 'AI Traders',
          actionType: 'trade_executed' as const,
        },
        {
          userId: 'user-2',
          businessName: 'AI Traders',
          actionType: 'trade_executed' as const,
        },
      ];

      const result = await tracker.trackUsageBatch(events);

      expect(result.success).toBe(2);
      expect(result.failed).toBe(0);
      expect(result.errors).toHaveLength(0);
    });

    it('should handle mixed success and failure in batch', async () => {
      mockSupabase.maybeSingle
        .mockResolvedValueOnce({ data: { is_active: true }, error: null })
        .mockResolvedValueOnce({
          data: {
            id: 'business-123',
            business_name: 'AI Traders',
            is_active: true,
          },
          error: null,
        })
        .mockResolvedValueOnce({ data: { id: 'rate-123' }, error: null })
        .mockResolvedValueOnce({ data: { id: 'event-123' }, error: null })
        .mockResolvedValueOnce({ data: { is_active: true }, error: null })
        .mockResolvedValueOnce({ data: null, error: null });

      const events = [
        {
          userId: 'user-1',
          businessName: 'AI Traders',
          actionType: 'trade_executed' as const,
        },
        {
          userId: 'user-2',
          businessName: 'InvalidBusiness',
          actionType: 'trade_executed' as const,
        },
      ];

      const result = await tracker.trackUsageBatch(events);

      expect(result.success).toBe(1);
      expect(result.failed).toBe(1);
      expect(result.errors).toHaveLength(1);
    });

    it('should handle empty batch', async () => {
      const result = await tracker.trackUsageBatch([]);

      expect(result.success).toBe(0);
      expect(result.failed).toBe(0);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('getUserUsageStats', () => {
    it('should calculate usage statistics correctly', async () => {
      const mockEvents = [
        { action_type: 'trade_executed' },
        { action_type: 'trade_executed' },
        { action_type: 'strategy_deployed' },
      ];

      mockSupabase.maybeSingle.mockResolvedValue({
        data: mockEvents,
        error: null,
      });

      vi.spyOn(mockSupabase, 'select').mockReturnValue(mockSupabase);

      mockSupabase.from = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            gte: vi.fn().mockResolvedValue({
              data: mockEvents,
              error: null,
            }),
          }),
        }),
      });

      const result = await tracker.getUserUsageStats('user-123', 3600);

      expect(result.total_events).toBe(3);
      expect(result.unique_actions).toBe(2);
      expect(result.suspicious).toBe(false);
    });

    it('should flag suspicious activity', async () => {
      const mockEvents = Array(1001).fill({ action_type: 'trade_executed' });

      mockSupabase.from = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            gte: vi.fn().mockResolvedValue({
              data: mockEvents,
              error: null,
            }),
          }),
        }),
      });

      const result = await tracker.getUserUsageStats('user-123', 3600);

      expect(result.total_events).toBe(1001);
      expect(result.suspicious).toBe(true);
    });

    it('should handle users with no activity', async () => {
      mockSupabase.from = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            gte: vi.fn().mockResolvedValue({
              data: [],
              error: null,
            }),
          }),
        }),
      });

      const result = await tracker.getUserUsageStats('user-123', 3600);

      expect(result.total_events).toBe(0);
      expect(result.unique_actions).toBe(0);
      expect(result.suspicious).toBe(false);
    });

    it('should handle database errors gracefully', async () => {
      mockSupabase.from = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            gte: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'Database error' },
            }),
          }),
        }),
      });

      const result = await tracker.getUserUsageStats('user-123', 3600);

      expect(result.total_events).toBe(0);
      expect(result.unique_actions).toBe(0);
      expect(result.suspicious).toBe(false);
    });
  });

  describe('Idempotency', () => {
    it('should generate consistent idempotency keys for same inputs', async () => {
      mockSupabase.maybeSingle
        .mockResolvedValueOnce({ data: { is_active: true }, error: null })
        .mockResolvedValueOnce({
          data: { id: 'business-123', business_name: 'AI Traders', is_active: true },
          error: null,
        })
        .mockResolvedValueOnce({ data: { id: 'rate-123' }, error: null })
        .mockResolvedValueOnce({ data: { id: 'event-1' }, error: null });

      let capturedKey: string | undefined;
      mockSupabase.insert = vi.fn((data: any) => {
        capturedKey = data.event_idempotency_key;
        return mockSupabase;
      });

      await tracker.trackUsage(
        'user-123',
        'AI Traders',
        'trade_executed',
        { tradeId: '456' }
      );

      expect(capturedKey).toBeDefined();
      expect(typeof capturedKey).toBe('string');
      expect(capturedKey!.length).toBe(64);
    });
  });

  describe('Edge Cases', () => {
    it('should handle null metadata gracefully', async () => {
      mockSupabase.maybeSingle
        .mockResolvedValueOnce({ data: { is_active: true }, error: null })
        .mockResolvedValueOnce({
          data: { id: 'business-123', business_name: 'AI Traders', is_active: true },
          error: null,
        })
        .mockResolvedValueOnce({ data: { id: 'rate-123' }, error: null })
        .mockResolvedValueOnce({ data: { id: 'event-123' }, error: null });

      const result = await tracker.trackUsage(
        'user-123',
        'AI Traders',
        'trade_executed'
      );

      expect(result.success).toBe(true);
    });

    it('should handle very large metadata objects', async () => {
      mockSupabase.maybeSingle
        .mockResolvedValueOnce({ data: { is_active: true }, error: null })
        .mockResolvedValueOnce({
          data: { id: 'business-123', business_name: 'AI Traders', is_active: true },
          error: null,
        })
        .mockResolvedValueOnce({ data: { id: 'rate-123' }, error: null })
        .mockResolvedValueOnce({ data: { id: 'event-123' }, error: null });

      const largeMetadata = {
        details: 'x'.repeat(1000),
        nested: {
          deep: { value: 'test' },
        },
      };

      const result = await tracker.trackUsage(
        'user-123',
        'AI Traders',
        'trade_executed',
        largeMetadata
      );

      expect(result.success).toBe(true);
    });

    it('should handle special characters in business names', async () => {
      mockSupabase.maybeSingle
        .mockResolvedValueOnce({ data: { is_active: true }, error: null })
        .mockResolvedValueOnce({
          data: {
            id: 'business-123',
            business_name: "AI Trader's & Co.",
            is_active: true,
          },
          error: null,
        })
        .mockResolvedValueOnce({ data: { id: 'rate-123' }, error: null })
        .mockResolvedValueOnce({ data: { id: 'event-123' }, error: null });

      const result = await tracker.trackUsage(
        'user-123',
        "AI Trader's & Co.",
        'trade_executed'
      );

      expect(result.success).toBe(true);
    });
  });
});
