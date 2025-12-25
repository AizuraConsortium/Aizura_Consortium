import type { SupabaseClient } from '@supabase/supabase-js';
import { DatabaseService } from '../../shared/services/DatabaseService.js';
import { PointCalculator, POINT_VALUES } from '../../shared/utils/pointCalculator.js';

export type ContentType =
  | 'twitter_thread'
  | 'youtube_video'
  | 'article'
  | 'podcast'
  | 'meme'
  | 'infographic'
  | 'github_contribution'
  | 'bug_report'
  | 'feature_suggestion'
  | 'translation'
  | 'reddit_post'
  | 'other';

export type SubmissionStatus = 'pending' | 'approved' | 'rejected' | 'changes_requested';

export interface ContentSubmission {
  id: string;
  userId: string;
  contentType: ContentType;
  title: string;
  description?: string;
  url: string;
  screenshotUrl?: string;
  status: SubmissionStatus;
  pointsRequested: number;
  pointsAwarded?: number;
  adminNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  submittedAt: string;
  updatedAt: string;
}

export interface SubmissionFilters {
  status?: SubmissionStatus;
  contentType?: ContentType;
  userId?: string;
  startDate?: string;
  endDate?: string;
}

export class ContentService extends DatabaseService {
  constructor(supabase: SupabaseClient) {
    super('ContentService', supabase);
  }

  async submitContent(
    userId: string,
    contentType: ContentType,
    data: {
      title: string;
      description?: string;
      url: string;
      screenshotUrl?: string;
      pointsRequested?: number;
    }
  ): Promise<ContentSubmission> {
    const contentTypeKey = contentType.toUpperCase() as keyof typeof POINT_VALUES.CONTENT;
    const defaultPoints = POINT_VALUES.CONTENT[contentTypeKey] || 50;

    const { data: submission, error } = await this.supabase
      .from('content_submissions')
      .insert({
        user_id: userId,
        content_type: contentType,
        title: data.title,
        description: data.description,
        url: data.url,
        screenshot_url: data.screenshotUrl,
        points_requested: data.pointsRequested || defaultPoints,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;

    const { data: leaderboard } = await this.supabase
      .from('airdrop_leaderboard')
      .select('total_content_submitted')
      .eq('user_id', userId)
      .maybeSingle();

    await this.supabase
      .from('airdrop_leaderboard')
      .update({
        total_content_submitted: (leaderboard?.total_content_submitted || 0) + 1,
      })
      .eq('user_id', userId);

    return this.mapSubmission(submission);
  }

  async getPendingSubmissions(
    adminId: string,
    limit = 50,
    offset = 0
  ): Promise<{ submissions: ContentSubmission[]; total: number }> {
    const { data: admin } = await this.supabase
      .from('users')
      .select('role')
      .eq('id', adminId)
      .maybeSingle();

    if (!admin || admin.role !== 'admin') {
      throw new Error('Unauthorized: Admin access required');
    }

    const { data, error, count } = await this.supabase
      .from('content_submissions')
      .select('*', { count: 'exact' })
      .eq('status', 'pending')
      .order('submitted_at', { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
      submissions: (data || []).map(this.mapSubmission),
      total: count || 0,
    };
  }

  async getSubmissions(
    filters?: SubmissionFilters,
    limit = 50,
    offset = 0
  ): Promise<{ submissions: ContentSubmission[]; total: number }> {
    let query = this.supabase.from('content_submissions').select('*', { count: 'exact' });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.contentType) {
      query = query.eq('content_type', filters.contentType);
    }

    if (filters?.userId) {
      query = query.eq('user_id', filters.userId);
    }

    if (filters?.startDate) {
      query = query.gte('submitted_at', filters.startDate);
    }

    if (filters?.endDate) {
      query = query.lte('submitted_at', filters.endDate);
    }

    query = query.order('submitted_at', { ascending: false }).range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      submissions: (data || []).map(this.mapSubmission),
      total: count || 0,
    };
  }

  async approveSubmission(
    submissionId: string,
    adminId: string,
    pointsAwarded: number,
    adminNotes?: string
  ): Promise<{ success: boolean; pointsAwarded: number }> {
    const { data: admin } = await this.supabase
      .from('users')
      .select('role')
      .eq('id', adminId)
      .maybeSingle();

    if (!admin || admin.role !== 'admin') {
      throw new Error('Unauthorized: Admin access required');
    }

    const { data: submission } = await this.supabase
      .from('content_submissions')
      .select('user_id, content_type, status')
      .eq('id', submissionId)
      .maybeSingle();

    if (!submission) {
      throw new Error('Submission not found');
    }

    if (submission.status !== 'pending') {
      throw new Error('Submission has already been reviewed');
    }

    const { error: updateError } = await this.supabase
      .from('content_submissions')
      .update({
        status: 'approved',
        points_awarded: pointsAwarded,
        admin_notes: adminNotes,
        reviewed_by: adminId,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', submissionId);

    if (updateError) throw updateError;

    const contentTypeKey = submission.content_type.toUpperCase() as keyof typeof POINT_VALUES.CONTENT;
    const calc = PointCalculator.calculateContentSubmission(contentTypeKey, pointsAwarded);

    await this.supabase.rpc('award_points', {
      p_user_id: submission.user_id,
      p_amount: calc.totalPoints,
      p_reason: calc.reason,
      p_reference_id: submissionId,
      p_reference_type: 'content_submission',
      p_metadata: { contentType: submission.content_type, submissionId },
    });

    const { data: leaderboard2 } = await this.supabase
      .from('airdrop_leaderboard')
      .select('total_content_approved')
      .eq('user_id', submission.user_id)
      .maybeSingle();

    await this.supabase
      .from('airdrop_leaderboard')
      .update({
        total_content_approved: (leaderboard2?.total_content_approved || 0) + 1,
      })
      .eq('user_id', submission.user_id);

    return { success: true, pointsAwarded: calc.totalPoints };
  }

  async rejectSubmission(
    submissionId: string,
    adminId: string,
    reason: string
  ): Promise<{ success: boolean }> {
    const { data: admin } = await this.supabase
      .from('users')
      .select('role')
      .eq('id', adminId)
      .maybeSingle();

    if (!admin || admin.role !== 'admin') {
      throw new Error('Unauthorized: Admin access required');
    }

    const { data: submission } = await this.supabase
      .from('content_submissions')
      .select('status')
      .eq('id', submissionId)
      .maybeSingle();

    if (!submission) {
      throw new Error('Submission not found');
    }

    if (submission.status !== 'pending') {
      throw new Error('Submission has already been reviewed');
    }

    const { error } = await this.supabase
      .from('content_submissions')
      .update({
        status: 'rejected',
        admin_notes: reason,
        reviewed_by: adminId,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', submissionId);

    if (error) throw error;

    return { success: true };
  }

  async requestChanges(
    submissionId: string,
    adminId: string,
    feedback: string
  ): Promise<{ success: boolean }> {
    const { data: admin } = await this.supabase
      .from('users')
      .select('role')
      .eq('id', adminId)
      .maybeSingle();

    if (!admin || admin.role !== 'admin') {
      throw new Error('Unauthorized: Admin access required');
    }

    const { error } = await this.supabase
      .from('content_submissions')
      .update({
        status: 'changes_requested',
        admin_notes: feedback,
        reviewed_by: adminId,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', submissionId);

    if (error) throw error;

    return { success: true };
  }

  async getUserSubmissions(userId: string): Promise<ContentSubmission[]> {
    const { data, error } = await this.supabase
      .from('content_submissions')
      .select('*')
      .eq('user_id', userId)
      .order('submitted_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(this.mapSubmission);
  }

  async getSubmissionById(submissionId: string): Promise<ContentSubmission | null> {
    const { data, error } = await this.supabase
      .from('content_submissions')
      .select('*')
      .eq('id', submissionId)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    return this.mapSubmission(data);
  }

  async getSubmissionStats(userId?: string): Promise<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    totalPointsEarned: number;
  }> {
    let query = this.supabase.from('content_submissions').select('status, points_awarded');

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) throw error;

    const stats = {
      total: data?.length || 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      totalPointsEarned: 0,
    };

    (data || []).forEach((submission) => {
      if (submission.status === 'pending') stats.pending++;
      if (submission.status === 'approved') {
        stats.approved++;
        stats.totalPointsEarned += submission.points_awarded || 0;
      }
      if (submission.status === 'rejected') stats.rejected++;
    });

    return stats;
  }

  private mapSubmission(data: Record<string, unknown>): ContentSubmission {
    return {
      id: data.id as string,
      userId: data.user_id as string,
      contentType: data.content_type as ContentType,
      title: data.title as string,
      description: data.description as string | undefined,
      url: data.url as string,
      screenshotUrl: data.screenshot_url as string | undefined,
      status: data.status as SubmissionStatus,
      pointsRequested: data.points_requested as number,
      pointsAwarded: data.points_awarded as number | undefined,
      adminNotes: data.admin_notes as string | undefined,
      reviewedBy: data.reviewed_by as string | undefined,
      reviewedAt: data.reviewed_at as string | undefined,
      submittedAt: data.submitted_at as string,
      updatedAt: data.updated_at as string,
    };
  }
}
