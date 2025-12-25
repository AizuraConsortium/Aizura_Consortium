/**
 * Portfolio Repository
 *
 * Manages portfolio data access including businesses, user exposure,
 * and performance statistics using materialized views.
 */

import { BaseRepository, type OperationContext } from './BaseRepository.js';
import { NotFoundError } from './errors/RepositoryError.js';
import type {
  Business,
  BusinessWithMetrics,
  BusinessPerformance,
  UserExposure,
  PortfolioOverview,
  BusinessFilters,
} from '../../../../../shared/types/portfolio.js';
import type { Database } from '../../../../../shared/types/database.types.js';

type BusinessRow = Database['public']['Tables']['u2e_businesses']['Row'];
type BusinessUpdate = Database['public']['Tables']['u2e_businesses']['Update'];

/**
 * Portfolio Repository Class
 */
class PortfolioRepository extends BaseRepository {
  constructor(client?: import('@supabase/supabase-js').SupabaseClient) {
    super('u2e_businesses', client);
  }

  /**
   * Get all businesses with optional filtering
   */
  async getBusinesses(filters?: BusinessFilters): Promise<Business[]> {
    const context: OperationContext = {
      operation: 'getBusinesses',
      table: 'u2e_businesses',
      metadata: { filters },
    };

    return this.execute(async () => {
      let query = this.client
        .from('u2e_businesses')
        .select('*')
        .is('deleted_at', null);

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }

      if (filters?.is_foundation !== undefined) {
        query = query.eq('is_foundation', filters.is_foundation);
      }

      if (filters?.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active);
      }

      if (filters?.search) {
        query = query.or(`display_name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const sortField = filters?.sort || 'created_at';
      const sortOrder = filters?.order || 'desc';

      const sortMap: Record<string, string> = {
        name: 'display_name',
        revenue: 'created_at',
        users: 'created_at',
        activity: 'created_at',
        launch_date: 'launch_date',
      };

      query = query.order(sortMap[sortField] || sortField, { ascending: sortOrder === 'asc' });

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) throw error;
      return (data || []) as Business[];
    }, context);
  }

  /**
   * Get business by ID
   */
  async getBusinessById(businessId: string): Promise<Business | null> {
    const context: OperationContext = {
      operation: 'getBusinessById',
      table: 'u2e_businesses',
      resourceId: businessId,
    };

    return this.execute(async () => {
      this.validateRequired(businessId, 'businessId');
      this.validateUUID(businessId, 'businessId');

      const { data, error } = await this.client
        .from('u2e_businesses')
        .select('*')
        .eq('id', businessId)
        .is('deleted_at', null)
        .maybeSingle();

      if (error) throw error;
      return data as Business | null;
    }, context);
  }

  /**
   * Get business by slug
   */
  async getBusinessBySlug(slug: string): Promise<Business | null> {
    const context: OperationContext = {
      operation: 'getBusinessBySlug',
      table: 'u2e_businesses',
      metadata: { slug },
    };

    return this.execute(async () => {
      this.validateRequired(slug, 'slug');

      const { data, error } = await this.client
        .from('u2e_businesses')
        .select('*')
        .eq('slug', slug)
        .is('deleted_at', null)
        .maybeSingle();

      if (error) throw error;
      return data as Business | null;
    }, context);
  }

  /**
   * Get business performance statistics
   */
  async getBusinessPerformance(businessId: string): Promise<BusinessPerformance | null> {
    const context: OperationContext = {
      operation: 'getBusinessPerformance',
      table: 'business_performance_stats',
      resourceId: businessId,
    };

    return this.execute(async () => {
      this.validateRequired(businessId, 'businessId');
      this.validateUUID(businessId, 'businessId');

      const { data, error } = await this.client
        .from('business_performance_stats')
        .select('*')
        .eq('business_id', businessId)
        .maybeSingle();

      if (error) throw error;
      return data as BusinessPerformance | null;
    }, context);
  }

  /**
   * Get all business performance statistics
   */
  async getAllBusinessPerformance(filters?: BusinessFilters): Promise<BusinessPerformance[]> {
    const context: OperationContext = {
      operation: 'getAllBusinessPerformance',
      table: 'business_performance_stats',
      metadata: { filters },
    };

    return this.execute(async () => {
      let query = this.client
        .from('business_performance_stats')
        .select('*');

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }

      if (filters?.is_foundation !== undefined) {
        query = query.eq('is_foundation', filters.is_foundation);
      }

      const sortField = filters?.sort || 'total_revenue';
      const sortOrder = filters?.order || 'desc';

      query = query.order(sortField, { ascending: sortOrder === 'asc' });

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      return (data || []) as BusinessPerformance[];
    }, context);
  }

  /**
   * Get user's exposure to a specific business
   */
  async getUserExposure(userId: string, businessId: string): Promise<UserExposure | null> {
    const context: OperationContext = {
      operation: 'getUserExposure',
      table: 'user_portfolio_exposure',
      metadata: { userId, businessId },
    };

    return this.execute(async () => {
      this.validateRequired(userId, 'userId');
      this.validateRequired(businessId, 'businessId');
      this.validateUUID(userId, 'userId');
      this.validateUUID(businessId, 'businessId');

      const { data, error } = await this.client
        .from('user_portfolio_exposure')
        .select('*')
        .eq('user_id', userId)
        .eq('business_id', businessId)
        .maybeSingle();

      if (error) throw error;
      return data as UserExposure | null;
    }, context);
  }

  /**
   * Get all user exposures (portfolio overview)
   */
  async getUserExposures(userId: string): Promise<UserExposure[]> {
    const context: OperationContext = {
      operation: 'getUserExposures',
      table: 'user_portfolio_exposure',
      metadata: { userId },
    };

    return this.execute(async () => {
      this.validateRequired(userId, 'userId');
      this.validateUUID(userId, 'userId');

      const { data, error } = await this.client
        .from('user_portfolio_exposure')
        .select('*')
        .eq('user_id', userId)
        .order('exposure_score', { ascending: false });

      if (error) throw error;
      return (data || []) as UserExposure[];
    }, context);
  }

  /**
   * Get complete portfolio overview for a user
   */
  async getUserPortfolio(userId: string): Promise<PortfolioOverview> {
    const context: OperationContext = {
      operation: 'getUserPortfolio',
      table: 'user_portfolio_exposure',
      metadata: { userId },
    };

    return this.execute(async () => {
      this.validateRequired(userId, 'userId');
      this.validateUUID(userId, 'userId');

      const exposures = await this.getUserExposures(userId);

      const businessIds = exposures.map(e => e.business_id);
      const businesses: BusinessWithMetrics[] = [];

      for (const businessId of businessIds) {
        const business = await this.getBusinessById(businessId);
        if (!business) continue;

        const performance = await this.getBusinessPerformance(businessId);
        const exposure = exposures.find(e => e.business_id === businessId) || null;

        businesses.push({
          ...business,
          performance,
          exposure,
        });
      }

      const businessesLive = businesses.filter(b => b.status === 'live').length;
      const businessesDevelopment = businesses.filter(b => b.status === 'development').length;
      const businessesPlanning = businesses.filter(b => b.status === 'planning').length;

      const businessesVoted = exposures.filter(e => e.votes_for > 0 || e.votes_against > 0).length;
      const businessesUsed = exposures.filter(e => e.total_usage_count > 0).length;
      const businessesProposed = exposures.filter(e => e.proposals_submitted > 0).length;

      const totalPortfolioRevenue = businesses.reduce((sum, b) =>
        sum + (b.performance?.total_revenue || 0), 0
      );

      const totalRewardsEarned = exposures.reduce((sum, e) =>
        sum + e.total_rewards_earned, 0
      );

      return {
        user_id: userId,
        total_businesses: businesses.length,
        businesses_live: businessesLive,
        businesses_development: businessesDevelopment,
        businesses_planning: businessesPlanning,
        businesses_voted: businessesVoted,
        businesses_used: businessesUsed,
        businesses_proposed: businessesProposed,
        total_portfolio_revenue: totalPortfolioRevenue,
        total_rewards_earned: totalRewardsEarned,
        businesses,
      };
    }, context);
  }

  /**
   * Get businesses with performance and exposure data
   */
  async getBusinessesWithMetrics(userId?: string, filters?: BusinessFilters): Promise<BusinessWithMetrics[]> {
    const context: OperationContext = {
      operation: 'getBusinessesWithMetrics',
      table: 'u2e_businesses',
      metadata: { userId, filters },
    };

    return this.execute(async () => {
      const businesses = await this.getBusinesses(filters);
      const businessesWithMetrics: BusinessWithMetrics[] = [];

      for (const business of businesses) {
        const performance = await this.getBusinessPerformance(business.id);
        const exposure = userId ? await this.getUserExposure(userId, business.id) : null;

        businessesWithMetrics.push({
          ...business,
          performance,
          exposure,
        });
      }

      return businessesWithMetrics;
    }, context);
  }

  /**
   * Update business data (admin only)
   */
  async updateBusiness(businessId: string, updates: BusinessUpdate): Promise<Business> {
    const context: OperationContext = {
      operation: 'updateBusiness',
      table: 'u2e_businesses',
      resourceId: businessId,
      metadata: { updates },
    };

    return this.execute(async () => {
      this.validateRequired(businessId, 'businessId');
      this.validateUUID(businessId, 'businessId');

      const { data, error } = await this.client
        .from('u2e_businesses')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', businessId)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new NotFoundError('Business', businessId);
        }
        throw error;
      }

      return data as Business;
    }, context);
  }

  /**
   * Refresh materialized views
   */
  async refreshPortfolioViews(): Promise<void> {
    const context: OperationContext = {
      operation: 'refreshPortfolioViews',
      table: 'user_portfolio_exposure',
    };

    return this.execute(async () => {
      const { error } = await this.client.rpc('refresh_portfolio_views');

      if (error) throw error;
    }, context);
  }
}

export const portfolioRepository = new PortfolioRepository();
export type { Business, BusinessWithMetrics, BusinessPerformance, UserExposure, PortfolioOverview };
