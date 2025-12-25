/**
 * Business Metrics Repository
 *
 * Manages business metrics history including revenue, users,
 * transactions, and API calls with time-series data access.
 */

import { BaseRepository, type OperationContext } from './BaseRepository.js';
import { NotFoundError, ValidationError } from './errors/RepositoryError.js';
import type {
  BusinessMetric,
  MetricType,
  MetricFilters,
  CreateBusinessMetricPayload,
  BusinessMetricsTimeSeries,
  MetricDataPoint,
  MetricTrend,
} from '../../../../../shared/types/portfolio.js';
import { calculateTrend } from '../../../../../shared/types/portfolio.js';
import type { Database } from '../../../../../shared/types/database.types.js';

type MetricRow = Database['public']['Tables']['business_metrics_history']['Row'];
type MetricInsert = Database['public']['Tables']['business_metrics_history']['Insert'];

/**
 * Business Metrics Repository Class
 */
class BusinessMetricsRepository extends BaseRepository {
  constructor(client?: import('@supabase/supabase-js').SupabaseClient) {
    super('business_metrics_history', client);
  }

  /**
   * Get all metrics for a business
   */
  async getBusinessMetrics(businessId: string, filters?: MetricFilters): Promise<BusinessMetric[]> {
    const context: OperationContext = {
      operation: 'getBusinessMetrics',
      table: 'business_metrics_history',
      resourceId: businessId,
      metadata: { filters },
    };

    return this.execute(async () => {
      this.validateRequired(businessId, 'businessId');
      this.validateUUID(businessId, 'businessId');

      let query = this.client
        .from('business_metrics_history')
        .select('*')
        .eq('business_id', businessId)
        .order('period_start', { ascending: false });

      if (filters?.metric_type) {
        query = query.eq('metric_type', filters.metric_type);
      }

      if (filters?.start_date) {
        query = query.gte('period_start', filters.start_date);
      }

      if (filters?.end_date) {
        query = query.lte('period_end', filters.end_date);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) throw error;
      return (data || []) as BusinessMetric[];
    }, context);
  }

  /**
   * Get metrics by type for a business
   */
  async getMetricsByType(
    businessId: string,
    metricType: MetricType,
    startDate?: string,
    endDate?: string
  ): Promise<BusinessMetric[]> {
    const context: OperationContext = {
      operation: 'getMetricsByType',
      table: 'business_metrics_history',
      metadata: { businessId, metricType, startDate, endDate },
    };

    return this.execute(async () => {
      this.validateRequired(businessId, 'businessId');
      this.validateRequired(metricType, 'metricType');
      this.validateUUID(businessId, 'businessId');

      let query = this.client
        .from('business_metrics_history')
        .select('*')
        .eq('business_id', businessId)
        .eq('metric_type', metricType)
        .order('period_start', { ascending: true });

      if (startDate) {
        query = query.gte('period_start', startDate);
      }

      if (endDate) {
        query = query.lte('period_end', endDate);
      }

      const { data, error } = await query;

      if (error) throw error;
      return (data || []) as BusinessMetric[];
    }, context);
  }

  /**
   * Get time-series data with trend calculation
   */
  async getMetricsTimeSeries(
    businessId: string,
    metricType: MetricType,
    startDate?: string,
    endDate?: string
  ): Promise<BusinessMetricsTimeSeries> {
    const context: OperationContext = {
      operation: 'getMetricsTimeSeries',
      table: 'business_metrics_history',
      metadata: { businessId, metricType, startDate, endDate },
    };

    return this.execute(async () => {
      const metrics = await this.getMetricsByType(businessId, metricType, startDate, endDate);

      const business = await this.client
        .from('u2e_businesses')
        .select('display_name')
        .eq('id', businessId)
        .single();

      const businessName = business.data?.display_name || 'Unknown';

      const dataPoints: MetricDataPoint[] = metrics.map(m => ({
        period_start: m.period_start,
        period_end: m.period_end,
        value: Number(m.value),
        metric_type: m.metric_type,
      }));

      let trend: MetricTrend | null = null;
      if (dataPoints.length >= 2) {
        const latest = dataPoints[dataPoints.length - 1];
        const previous = dataPoints[dataPoints.length - 2];
        trend = calculateTrend(latest.value, previous.value);
      }

      return {
        business_id: businessId,
        business_name: businessName,
        metric_type: metricType,
        data_points: dataPoints,
        trend,
      };
    }, context);
  }

  /**
   * Get latest metric value for a business
   */
  async getLatestMetric(businessId: string, metricType: MetricType): Promise<BusinessMetric | null> {
    const context: OperationContext = {
      operation: 'getLatestMetric',
      table: 'business_metrics_history',
      metadata: { businessId, metricType },
    };

    return this.execute(async () => {
      this.validateRequired(businessId, 'businessId');
      this.validateRequired(metricType, 'metricType');
      this.validateUUID(businessId, 'businessId');

      const { data, error } = await this.client
        .from('business_metrics_history')
        .select('*')
        .eq('business_id', businessId)
        .eq('metric_type', metricType)
        .order('period_end', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data as BusinessMetric | null;
    }, context);
  }

  /**
   * Create a new business metric (admin only)
   */
  async createMetric(payload: CreateBusinessMetricPayload): Promise<BusinessMetric> {
    const context: OperationContext = {
      operation: 'createMetric',
      table: 'business_metrics_history',
      metadata: { payload },
    };

    return this.execute(async () => {
      this.validateRequired(payload.business_id, 'business_id');
      this.validateRequired(payload.metric_type, 'metric_type');
      this.validateRequired(payload.value, 'value');
      this.validateRequired(payload.period_start, 'period_start');
      this.validateRequired(payload.period_end, 'period_end');

      this.validateUUID(payload.business_id, 'business_id');

      if (payload.value < 0) {
        throw new ValidationError('Metric value must be non-negative', { value: payload.value });
      }

      const periodStart = new Date(payload.period_start);
      const periodEnd = new Date(payload.period_end);

      if (periodEnd < periodStart) {
        throw new ValidationError('period_end must be after period_start', {
          period_start: payload.period_start,
          period_end: payload.period_end,
        });
      }

      const insert: MetricInsert = {
        business_id: payload.business_id,
        metric_type: payload.metric_type,
        value: payload.value,
        period_start: payload.period_start,
        period_end: payload.period_end,
        metadata: payload.metadata || {},
      };

      const { data, error } = await this.client
        .from('business_metrics_history')
        .insert(insert)
        .select()
        .single();

      if (error) throw error;
      return data as BusinessMetric;
    }, context);
  }

  /**
   * Create multiple metrics in bulk (admin only)
   */
  async createMetricsBulk(payloads: CreateBusinessMetricPayload[]): Promise<BusinessMetric[]> {
    const context: OperationContext = {
      operation: 'createMetricsBulk',
      table: 'business_metrics_history',
      metadata: { count: payloads.length },
    };

    return this.execute(async () => {
      if (!payloads || payloads.length === 0) {
        throw new ValidationError('Payloads array cannot be empty');
      }

      const inserts: MetricInsert[] = payloads.map(payload => {
        this.validateRequired(payload.business_id, 'business_id');
        this.validateRequired(payload.metric_type, 'metric_type');
        this.validateRequired(payload.value, 'value');
        this.validateRequired(payload.period_start, 'period_start');
        this.validateRequired(payload.period_end, 'period_end');

        this.validateUUID(payload.business_id, 'business_id');

        if (payload.value < 0) {
          throw new ValidationError('Metric value must be non-negative', { value: payload.value });
        }

        return {
          business_id: payload.business_id,
          metric_type: payload.metric_type,
          value: payload.value,
          period_start: payload.period_start,
          period_end: payload.period_end,
          metadata: payload.metadata || {},
        };
      });

      const { data, error } = await this.client
        .from('business_metrics_history')
        .insert(inserts)
        .select();

      if (error) throw error;
      return (data || []) as BusinessMetric[];
    }, context);
  }

  /**
   * Delete a metric (admin only)
   */
  async deleteMetric(metricId: string): Promise<void> {
    const context: OperationContext = {
      operation: 'deleteMetric',
      table: 'business_metrics_history',
      resourceId: metricId,
    };

    return this.execute(async () => {
      this.validateRequired(metricId, 'metricId');
      this.validateUUID(metricId, 'metricId');

      const { error } = await this.client
        .from('business_metrics_history')
        .delete()
        .eq('id', metricId);

      if (error) {
        if (error.code === 'PGRST116') {
          throw new NotFoundError('Metric', metricId);
        }
        throw error;
      }
    }, context);
  }

  /**
   * Get aggregated metrics for a business
   */
  async getAggregatedMetrics(
    businessId: string,
    metricType: MetricType,
    startDate?: string,
    endDate?: string
  ): Promise<{ total: number; average: number; min: number; max: number; count: number }> {
    const context: OperationContext = {
      operation: 'getAggregatedMetrics',
      table: 'business_metrics_history',
      metadata: { businessId, metricType, startDate, endDate },
    };

    return this.execute(async () => {
      this.validateRequired(businessId, 'businessId');
      this.validateRequired(metricType, 'metricType');
      this.validateUUID(businessId, 'businessId');

      let query = this.client
        .from('business_metrics_history')
        .select('value')
        .eq('business_id', businessId)
        .eq('metric_type', metricType);

      if (startDate) {
        query = query.gte('period_start', startDate);
      }

      if (endDate) {
        query = query.lte('period_end', endDate);
      }

      const { data, error } = await query;

      if (error) throw error;

      const values = (data || []).map(m => Number(m.value));

      if (values.length === 0) {
        return { total: 0, average: 0, min: 0, max: 0, count: 0 };
      }

      const total = values.reduce((sum, v) => sum + v, 0);
      const average = total / values.length;
      const min = Math.min(...values);
      const max = Math.max(...values);

      return {
        total,
        average,
        min,
        max,
        count: values.length,
      };
    }, context);
  }
}

export const businessMetricsRepository = new BusinessMetricsRepository();
export type { BusinessMetric, MetricType, BusinessMetricsTimeSeries };
