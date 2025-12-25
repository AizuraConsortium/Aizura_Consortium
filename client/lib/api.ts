import { apiClient } from '@shared/lib/apiClient';
import { APIError } from '@shared/lib/apiClient';
import { logError } from '@shared/lib/logError';
import { validateProposal } from '@shared/utils/validation/business-validators';
import type { Proposal } from '@shared/types/models';
import type { ApiResponse } from '@shared/types/api';
import type {
  PortfolioOverview,
  BusinessWithMetrics,
  BusinessFilters,
  BusinessMetricsTimeSeries,
  BusinessPerformance,
  UserExposure,
  MetricType,
} from '@shared/types/portfolio';
import type {
  NewsArticle,
  NewsArticleCompact,
  NewsFilters,
  NewsListResponse,
  NewsCompactListResponse,
} from '@shared/types/news';

interface ProposalsResponse {
  proposals: Proposal[];
  count: number;
}

interface VoteResponse {
  success: boolean;
  message: string;
}

interface UserVoteResponse {
  vote: 'for' | 'against' | null;
  voted_at: string | null;
}

export const api = {
  ...apiClient,

  async getProposals(token?: string): Promise<ProposalsResponse> {
    return this.get<ProposalsResponse>('/client/proposals', token);
  },

  async getMyProposals(token?: string): Promise<ProposalsResponse> {
    return this.get<ProposalsResponse>('/client/proposals/my', token);
  },

  async createProposal(
    title: string,
    summary: string,
    token?: string
  ): Promise<ApiResponse<{ id: string; proposal: Proposal }>> {
    const validation = validateProposal(title, summary);
    if (!validation.isValid) {
      const errorMessage = Object.values(validation.errors).join('; ');
      throw new APIError(errorMessage, 400, 'Validation Error', validation.errors);
    }

    return this.post<ApiResponse<{ id: string; proposal: Proposal }>>(
      '/client/proposals',
      { title, summary },
      token
    );
  },

  async voteOnProposal(
    proposalId: string,
    vote: 'for' | 'against',
    token: string
  ): Promise<VoteResponse> {
    if (vote !== 'for' && vote !== 'against') {
      throw new APIError('Invalid vote value. Must be "for" or "against"', 400, 'Validation Error');
    }

    return this.post<VoteResponse>(
      `/client/proposals/${proposalId}/vote`,
      { vote },
      token
    );
  },

  async getUserVote(
    proposalId: string,
    token: string
  ): Promise<UserVoteResponse> {
    return this.get<UserVoteResponse>(
      `/client/proposals/${proposalId}/vote`,
      token
    );
  },

  async getPortfolio(userId: string, token?: string): Promise<PortfolioOverview> {
    const response = await this.get<{ portfolio: PortfolioOverview }>(
      '/client/portfolio',
      token
    );
    return response.portfolio;
  },

  async getBusinesses(
    userId?: string,
    filters?: BusinessFilters,
    token?: string
  ): Promise<BusinessWithMetrics[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.is_foundation !== undefined) params.append('is_foundation', String(filters.is_foundation));
    if (filters?.is_active !== undefined) params.append('is_active', String(filters.is_active));
    if (filters?.search) params.append('search', filters.search);
    if (filters?.sort) params.append('sort', filters.sort);
    if (filters?.order) params.append('order', filters.order);
    if (filters?.limit) params.append('limit', String(filters.limit));
    if (filters?.offset) params.append('offset', String(filters.offset));

    const queryString = params.toString();
    const url = queryString ? `/client/portfolio/businesses?${queryString}` : '/client/portfolio/businesses';

    const response = await this.get<{ businesses: BusinessWithMetrics[] }>(url, token);
    return response.businesses;
  },

  async getBusinessById(businessId: string, userId?: string, token?: string): Promise<BusinessWithMetrics> {
    return this.get<BusinessWithMetrics>(
      `/client/portfolio/businesses/${businessId}`,
      token
    );
  },

  async getBusinessBySlug(slug: string, userId?: string, token?: string): Promise<BusinessWithMetrics> {
    return this.get<BusinessWithMetrics>(
      `/client/portfolio/businesses/slug/${slug}`,
      token
    );
  },

  async getUserExposure(userId: string, businessId: string, token?: string): Promise<UserExposure> {
    return this.get<UserExposure>(
      `/client/portfolio/businesses/${businessId}/exposure`,
      token
    );
  },

  async getUserExposures(userId: string, token?: string): Promise<UserExposure[]> {
    const response = await this.get<{ portfolio: PortfolioOverview }>(
      '/client/portfolio',
      token
    );
    return response.portfolio.businesses.map(b => b.exposure).filter((e): e is UserExposure => e !== null);
  },

  async getBusinessMetrics(
    businessId: string,
    metricType: MetricType,
    startDate?: string,
    endDate?: string,
    token?: string
  ): Promise<BusinessMetricsTimeSeries> {
    const params = new URLSearchParams();
    params.append('metric_type', metricType);
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);

    return this.get<BusinessMetricsTimeSeries>(
      `/client/portfolio/businesses/${businessId}/metrics?${params.toString()}`,
      token
    );
  },

  async getBusinessPerformance(businessId: string, token?: string): Promise<BusinessPerformance> {
    return this.get<BusinessPerformance>(
      `/client/portfolio/businesses/${businessId}/performance`,
      token
    );
  },

  async getFoundationBusinesses(userId?: string, token?: string): Promise<BusinessWithMetrics[]> {
    const response = await this.get<{ businesses: BusinessWithMetrics[] }>(
      '/client/portfolio/businesses/foundation',
      token
    );
    return response.businesses;
  },

  async getLiveBusinesses(userId?: string, token?: string): Promise<BusinessWithMetrics[]> {
    const response = await this.get<{ businesses: BusinessWithMetrics[] }>(
      '/client/portfolio/businesses/live',
      token
    );
    return response.businesses;
  },

  async searchBusinesses(query: string, userId?: string, token?: string): Promise<BusinessWithMetrics[]> {
    const response = await this.get<{ businesses: BusinessWithMetrics[] }>(
      `/client/portfolio/businesses/search?q=${encodeURIComponent(query)}`,
      token
    );
    return response.businesses;
  },

  async getTopPerformingBusinesses(limit: number = 10, userId?: string, token?: string): Promise<BusinessWithMetrics[]> {
    const response = await this.get<{ businesses: BusinessWithMetrics[] }>(
      `/client/portfolio/businesses/top?limit=${limit}`,
      token
    );
    return response.businesses;
  },

  async getLatestNews(limit: number = 5, token?: string): Promise<NewsCompactListResponse> {
    const params = new URLSearchParams();
    if (limit) params.append('limit', String(limit));

    const queryString = params.toString();
    const url = queryString ? `/client/news?${queryString}` : '/client/news';

    return this.get<NewsCompactListResponse>(url, token);
  },

  async getAllNews(filters?: NewsFilters, token?: string): Promise<NewsListResponse> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.featured !== undefined) params.append('featured', String(filters.featured));
    if (filters?.search) params.append('search', filters.search);
    if (filters?.limit) params.append('limit', String(filters.limit));
    if (filters?.offset) params.append('offset', String(filters.offset));
    if (filters?.order) params.append('order', filters.order);
    if (filters?.sort) params.append('sort', filters.sort);

    const queryString = params.toString();
    const url = queryString ? `/client/news/all?${queryString}` : '/client/news/all';

    return this.get<NewsListResponse>(url, token);
  },

  async getArticleById(articleId: string, token?: string): Promise<NewsArticle> {
    return this.get<NewsArticle>(`/client/news/${articleId}`, token);
  },

  async getArticleBySlug(slug: string, token?: string): Promise<NewsArticle> {
    return this.get<NewsArticle>(`/client/news/slug/${slug}`, token);
  },

  async getFeaturedNews(limit: number = 3, token?: string): Promise<{ articles: NewsArticle[] }> {
    const params = new URLSearchParams();
    if (limit) params.append('limit', String(limit));

    const queryString = params.toString();
    const url = queryString ? `/client/news/featured?${queryString}` : '/client/news/featured';

    return this.get<{ articles: NewsArticle[] }>(url, token);
  },

  logError
};

export { APIError };
export type { ProposalsResponse, VoteResponse, UserVoteResponse };
