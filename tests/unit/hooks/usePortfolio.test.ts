/**
 * Portfolio Hooks Unit Tests
 *
 * Tests the portfolio-related custom hooks with mocked API responses.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { usePortfolio, useBusinesses, useBusinessDetail } from '@shared/hooks/usePortfolio';
import type { ApiClient } from '@shared/types/api';

const mockApiClient: ApiClient = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  patch: vi.fn(),
};

const mockPortfolioData = {
  total_businesses: 4,
  total_exposure_score: 125.5,
  total_portfolio_revenue: 208000,
  total_users: 15000,
  businesses: [
    {
      id: '1',
      display_name: 'AI Traders',
      slug: 'ai-traders',
      status: 'live',
      category: 'trading',
      development_progress: 100,
      is_foundation: true,
      is_active: true,
      integration_type: 'api',
      current_metrics: {
        revenue: 125000,
        users: 8000,
        transactions: 50000,
      },
      exposure: {
        user_id: 'test-user',
        business_id: '1',
        exposure_score: 45.5,
        exposure_type: 'voting',
        activity_level: 'high',
        votes_cast: 5,
        proposals_submitted: 0,
        usage_rewards_earned: 0,
        last_activity_at: '2024-12-25T00:00:00Z',
      },
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-12-25T00:00:00Z',
    },
  ],
};

const mockBusinessDetail = {
  ...mockPortfolioData.businesses[0],
  description: 'AI-powered trading platform',
  website_url: 'https://aitraders.example.com',
  github_url: 'https://github.com/example/ai-traders',
  launch_date: '2024-03-01T00:00:00Z',
};

const mockMetricsData = {
  business_id: '1',
  metric_type: 'revenue',
  data_points: [
    {
      period_start: '2024-01-01T00:00:00Z',
      period_end: '2024-01-31T23:59:59Z',
      value: 100000,
    },
    {
      period_start: '2024-02-01T00:00:00Z',
      period_end: '2024-02-29T23:59:59Z',
      value: 125000,
    },
  ],
  trend: {
    direction: 'up',
    change_percent: 25,
    change_value: 25000,
  },
};

describe('usePortfolio Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch portfolio data on mount', async () => {
    (mockApiClient.get as any).mockResolvedValue({ data: mockPortfolioData });

    const { result } = renderHook(() =>
      usePortfolio(mockApiClient, {
        userId: 'test-user',
      })
    );

    expect(result.current.loading).toBe(true);
    expect(result.current.portfolio).toBeNull();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.portfolio).toEqual(mockPortfolioData);
    expect(result.current.error).toBeNull();
    expect(mockApiClient.get).toHaveBeenCalledWith('/portfolio/overview', {
      params: expect.any(Object),
    });
  });

  it('should handle API errors gracefully', async () => {
    const error = new Error('API Error');
    (mockApiClient.get as any).mockRejectedValue(error);

    const { result } = renderHook(() =>
      usePortfolio(mockApiClient, {
        userId: 'test-user',
      })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.portfolio).toBeNull();
    expect(result.current.error).toBe('API Error');
  });

  it('should apply filters when provided', async () => {
    (mockApiClient.get as any).mockResolvedValue({ data: mockPortfolioData });

    const filters = {
      status: 'live',
      category: 'trading',
    };

    const { result } = renderHook(() =>
      usePortfolio(mockApiClient, {
        userId: 'test-user',
        filters,
      })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockApiClient.get).toHaveBeenCalledWith('/portfolio/overview', {
      params: expect.objectContaining({
        status: 'live',
        category: 'trading',
      }),
    });
  });

  it('should support caching', async () => {
    (mockApiClient.get as any).mockResolvedValue({ data: mockPortfolioData });

    const { result, rerender } = renderHook(() =>
      usePortfolio(mockApiClient, {
        userId: 'test-user',
        cache: { enabled: true, ttl: 60000 },
      })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockApiClient.get).toHaveBeenCalledTimes(1);

    rerender();

    expect(mockApiClient.get).toHaveBeenCalledTimes(1);
  });

  it('should refetch data when refetch is called', async () => {
    (mockApiClient.get as any).mockResolvedValue({ data: mockPortfolioData });

    const { result } = renderHook(() =>
      usePortfolio(mockApiClient, {
        userId: 'test-user',
      })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockApiClient.get).toHaveBeenCalledTimes(1);

    result.current.refetch();

    await waitFor(() => {
      expect(mockApiClient.get).toHaveBeenCalledTimes(2);
    });
  });

  it('should not fetch when skip is true', async () => {
    (mockApiClient.get as any).mockResolvedValue({ data: mockPortfolioData });

    const { result } = renderHook(() =>
      usePortfolio(mockApiClient, {
        userId: 'test-user',
        skip: true,
      })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockApiClient.get).not.toHaveBeenCalled();
  });
});

describe('useBusinesses Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch businesses with pagination', async () => {
    const paginatedData = {
      businesses: mockPortfolioData.businesses,
      total: 10,
      limit: 5,
      offset: 0,
    };

    (mockApiClient.get as any).mockResolvedValue({ data: paginatedData });

    const { result } = renderHook(() =>
      useBusinesses(mockApiClient, {
        userId: 'test-user',
        pagination: { limit: 5, offset: 0 },
      })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.businesses).toEqual(paginatedData.businesses);
    expect(result.current.total).toBe(10);
    expect(mockApiClient.get).toHaveBeenCalledWith('/portfolio/businesses', {
      params: expect.objectContaining({
        limit: 5,
        offset: 0,
      }),
    });
  });

  it('should apply sorting', async () => {
    const paginatedData = {
      businesses: mockPortfolioData.businesses,
      total: 10,
      limit: 5,
      offset: 0,
    };

    (mockApiClient.get as any).mockResolvedValue({ data: paginatedData });

    const { result } = renderHook(() =>
      useBusinesses(mockApiClient, {
        userId: 'test-user',
        filters: {
          sort: 'created_at',
          order: 'desc',
        },
      })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockApiClient.get).toHaveBeenCalledWith('/portfolio/businesses', {
      params: expect.objectContaining({
        sort: 'created_at',
        order: 'desc',
      }),
    });
  });
});

describe('useBusinessDetail Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch business details', async () => {
    (mockApiClient.get as any).mockResolvedValue({ data: mockBusinessDetail });

    const { result } = renderHook(() =>
      useBusinessDetail(mockApiClient, {
        businessId: '1',
        userId: 'test-user',
      })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.business).toEqual(mockBusinessDetail);
    expect(result.current.error).toBeNull();
    expect(mockApiClient.get).toHaveBeenCalledWith('/portfolio/businesses/1', {
      params: { user_id: 'test-user' },
    });
  });

  it('should handle 404 errors', async () => {
    const error = { response: { status: 404 } };
    (mockApiClient.get as any).mockRejectedValue(error);

    const { result } = renderHook(() =>
      useBusinessDetail(mockApiClient, {
        businessId: 'non-existent',
        userId: 'test-user',
      })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.business).toBeNull();
    expect(result.current.error).toBeTruthy();
  });

  it('should skip fetch when businessId is undefined', async () => {
    const { result } = renderHook(() =>
      useBusinessDetail(mockApiClient, {
        businessId: undefined,
        userId: 'test-user',
      })
    );

    expect(result.current.loading).toBe(false);
    expect(mockApiClient.get).not.toHaveBeenCalled();
  });
});
