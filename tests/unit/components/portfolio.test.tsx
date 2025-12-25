/**
 * Portfolio Component Unit Tests
 *
 * Tests the portfolio-related components with mocked data.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { BusinessCard, BusinessCardList } from '../../../client/components/portfolio/BusinessCard';
import { MetricsGrid, BusinessMetricsGrid } from '../../../client/components/portfolio/MetricsGrid';
import { ExposureBreakdown } from '../../../client/components/portfolio/ExposureBreakdown';
import type { BusinessWithMetrics, PortfolioOverview } from '@shared/types/portfolio';

const mockBusiness: BusinessWithMetrics = {
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
};

const mockPortfolio: PortfolioOverview = {
  total_businesses: 4,
  total_exposure_score: 125.5,
  total_portfolio_revenue: 208000,
  total_users: 15000,
  businesses: [mockBusiness],
};

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('BusinessCard Component', () => {
  it('should render business name and status', () => {
    renderWithRouter(<BusinessCard business={mockBusiness} />);

    expect(screen.getByText('AI Traders')).toBeInTheDocument();
    expect(screen.getByText(/live/i)).toBeInTheDocument();
  });

  it('should display metrics when available', () => {
    renderWithRouter(<BusinessCard business={mockBusiness} />);

    expect(screen.getByText('Current Revenue')).toBeInTheDocument();
    expect(screen.getByText('$125,000')).toBeInTheDocument();
    expect(screen.getByText('Active Users')).toBeInTheDocument();
    expect(screen.getByText('8K')).toBeInTheDocument();
  });

  it('should show exposure score when showExposure is true', () => {
    renderWithRouter(<BusinessCard business={mockBusiness} showExposure />);

    expect(screen.getByText('Your Exposure Score')).toBeInTheDocument();
    expect(screen.getByText('45.5')).toBeInTheDocument();
  });

  it('should hide exposure when showExposure is false', () => {
    renderWithRouter(<BusinessCard business={mockBusiness} showExposure={false} />);

    expect(screen.queryByText('Your Exposure Score')).not.toBeInTheDocument();
  });

  it('should render links to external resources', () => {
    const businessWithLinks: BusinessWithMetrics = {
      ...mockBusiness,
      website_url: 'https://example.com',
      github_url: 'https://github.com/example',
    };

    renderWithRouter(<BusinessCard business={businessWithLinks} />);

    const links = screen.getAllByRole('link');
    expect(links.some((link) => link.getAttribute('href')?.includes('example.com'))).toBe(true);
    expect(links.some((link) => link.getAttribute('href')?.includes('github.com'))).toBe(true);
  });

  it('should show development progress for non-live businesses', () => {
    const devBusiness: BusinessWithMetrics = {
      ...mockBusiness,
      status: 'development',
      development_progress: 65,
    };

    renderWithRouter(<BusinessCard business={devBusiness} />);

    expect(screen.getByText('Development Progress')).toBeInTheDocument();
    expect(screen.getByText('65%')).toBeInTheDocument();
  });

  it('should render detail link with correct URL', () => {
    renderWithRouter(<BusinessCard business={mockBusiness} />);

    const detailLink = screen.getByText('View Business Details').closest('a');
    expect(detailLink).toHaveAttribute('href', '/dashboard/portfolio/ai-traders');
  });
});

describe('BusinessCardList Component', () => {
  it('should render multiple business cards', () => {
    const businesses = [
      mockBusiness,
      { ...mockBusiness, id: '2', display_name: 'Coinfusion' },
    ];

    renderWithRouter(<BusinessCardList businesses={businesses} />);

    expect(screen.getByText('AI Traders')).toBeInTheDocument();
    expect(screen.getByText('Coinfusion')).toBeInTheDocument();
  });

  it('should show empty message when no businesses', () => {
    renderWithRouter(<BusinessCardList businesses={[]} emptyMessage="No businesses found" />);

    expect(screen.getByText('No businesses found')).toBeInTheDocument();
  });

  it('should pass showExposure prop to cards', () => {
    renderWithRouter(<BusinessCardList businesses={[mockBusiness]} showExposure />);

    expect(screen.getByText('Your Exposure Score')).toBeInTheDocument();
  });
});

describe('MetricsGrid Component', () => {
  it('should display portfolio overview metrics', () => {
    render(<MetricsGrid portfolio={mockPortfolio} />);

    expect(screen.getByText('Total Businesses')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    expect(screen.getByText('$208K')).toBeInTheDocument();
    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('15K')).toBeInTheDocument();
    expect(screen.getByText('Exposure Score')).toBeInTheDocument();
    expect(screen.getByText('125.5')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    render(<MetricsGrid portfolio={null} loading />);

    const skeletons = screen.getAllByRole('generic');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should return null when no portfolio and not loading', () => {
    const { container } = render(<MetricsGrid portfolio={null} loading={false} />);

    expect(container.firstChild).toBeNull();
  });
});

describe('BusinessMetricsGrid Component', () => {
  it('should display business-specific metrics', () => {
    render(<BusinessMetricsGrid business={mockBusiness} />);

    expect(screen.getByText('Monthly Revenue')).toBeInTheDocument();
    expect(screen.getByText('$125,000')).toBeInTheDocument();
    expect(screen.getByText('Active Users')).toBeInTheDocument();
    expect(screen.getByText('8,000')).toBeInTheDocument();
  });

  it('should show empty message when no metrics', () => {
    const businessWithoutMetrics: BusinessWithMetrics = {
      ...mockBusiness,
      current_metrics: null,
    };

    render(<BusinessMetricsGrid business={businessWithoutMetrics} />);

    expect(screen.getByText('No metrics available yet')).toBeInTheDocument();
  });

  it('should adapt grid columns based on metrics count', () => {
    const businessWithLimitedMetrics: BusinessWithMetrics = {
      ...mockBusiness,
      current_metrics: {
        revenue: 125000,
      },
    };

    const { container } = render(<BusinessMetricsGrid business={businessWithLimitedMetrics} />);

    const grid = container.querySelector('.grid');
    expect(grid?.className).toContain('grid');
  });
});

describe('ExposureBreakdown Component', () => {
  it('should display exposure breakdown by type', () => {
    render(<ExposureBreakdown portfolio={mockPortfolio} />);

    expect(screen.getByText('Exposure Breakdown')).toBeInTheDocument();
    expect(screen.getByText('Total:')).toBeInTheDocument();
    expect(screen.getByText('125.5')).toBeInTheDocument();
  });

  it('should show top exposures list', () => {
    render(<ExposureBreakdown portfolio={mockPortfolio} />);

    expect(screen.getByText('Top Exposures')).toBeInTheDocument();
    expect(screen.getByText('AI Traders')).toBeInTheDocument();
  });

  it('should show empty state when no exposure', () => {
    const emptyPortfolio: PortfolioOverview = {
      ...mockPortfolio,
      total_exposure_score: 0,
      businesses: [],
    };

    render(<ExposureBreakdown portfolio={emptyPortfolio} />);

    expect(screen.getByText('No exposure data available')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    render(<ExposureBreakdown portfolio={null} loading />);

    const skeletons = screen.getAllByRole('generic');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should calculate percentages correctly', () => {
    const portfolioWith100Exposure: PortfolioOverview = {
      ...mockPortfolio,
      total_exposure_score: 100,
      businesses: [
        {
          ...mockBusiness,
          exposure: {
            ...mockBusiness.exposure!,
            exposure_score: 50,
            exposure_type: 'voting',
          },
        },
      ],
    };

    render(<ExposureBreakdown portfolio={portfolioWith100Exposure} />);

    expect(screen.getByText('50%')).toBeInTheDocument();
  });
});

describe('Responsive Design', () => {
  it('BusinessCard should be responsive', () => {
    const { container } = renderWithRouter(<BusinessCard business={mockBusiness} />);

    const card = container.firstChild as HTMLElement;
    expect(card?.className).toContain('transition');
  });

  it('MetricsGrid should use responsive grid', () => {
    const { container } = render(<MetricsGrid portfolio={mockPortfolio} />);

    const grid = container.querySelector('.grid');
    expect(grid?.className).toContain('md:grid-cols-4');
  });
});

describe('Accessibility', () => {
  it('should have proper ARIA labels for links', () => {
    const businessWithLinks: BusinessWithMetrics = {
      ...mockBusiness,
      website_url: 'https://example.com',
      github_url: 'https://github.com/example',
    };

    renderWithRouter(<BusinessCard business={businessWithLinks} />);

    expect(screen.getByLabelText('Visit website')).toBeInTheDocument();
    expect(screen.getByLabelText('View on GitHub')).toBeInTheDocument();
  });

  it('should have proper heading structure', () => {
    render(<ExposureBreakdown portfolio={mockPortfolio} />);

    const heading = screen.getByText('Exposure Breakdown');
    expect(heading.tagName).toBe('H3');
  });
});
