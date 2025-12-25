import { Request, Response } from 'express';
import { BaseController } from '../../shared/controllers/BaseController.js';
import { getSupabaseClient } from '../../shared/services/supabase/client.js';
import { AirdropService } from '../../client/services/airdropService.js';
import { PointsService } from '../../client/services/pointsService.js';
import { ContentService, type SubmissionStatus, type ContentType } from '../../client/services/contentService.js';
import { AntiSybilDetector } from '../../shared/utils/antiSybil.js';

export class AirdropAdminController extends BaseController {
  private airdropService: AirdropService;
  private pointsService: PointsService;
  private contentService: ContentService;
  private antiSybilDetector: AntiSybilDetector;

  constructor() {
    super('AirdropAdminController');
    const supabase = getSupabaseClient();
    this.airdropService = new AirdropService(supabase);
    this.pointsService = new PointsService(supabase);
    this.contentService = new ContentService(supabase);
    this.antiSybilDetector = new AntiSybilDetector(supabase);
  }

  async getPendingSubmissions(req: Request, res: Response): Promise<void> {
    try {
      const adminId = this.getUserId(req);
      const { limit, offset } = this.getPagination(req);
      const result = await this.contentService.getPendingSubmissions(adminId, limit, offset);
      this.paginated(req, res, result.submissions, result.total);
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  async getAllSubmissions(req: Request, res: Response): Promise<void> {
    try {
      const { limit, offset } = this.getPagination(req);
      const status = this.getQueryParam(req, 'status') as SubmissionStatus | undefined;
      const userId = this.getQueryParam(req, 'userId');
      const contentType = this.getQueryParam(req, 'contentType') as ContentType | undefined;
      const startDate = this.getQueryParam(req, 'startDate');
      const endDate = this.getQueryParam(req, 'endDate');

      const result = await this.contentService.getSubmissions(
        { status, userId, contentType, startDate, endDate },
        limit,
        offset
      );

      this.paginated(req, res, result.submissions, result.total);
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  async approveSubmission(req: Request, res: Response): Promise<void> {
    try {
      const adminId = this.getUserId(req);
      const submissionId = req.params.id;
      const { pointsAwarded, adminNotes } = req.body;

      if (pointsAwarded === undefined) {
        return this.badRequest(res, 'Missing required field: pointsAwarded');
      }

      const result = await this.contentService.approveSubmission(
        submissionId,
        adminId,
        pointsAwarded,
        adminNotes
      );

      this.ok(res, result, 'Submission approved successfully');
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  async rejectSubmission(req: Request, res: Response): Promise<void> {
    try {
      const adminId = this.getUserId(req);
      const submissionId = req.params.id;
      const { reason } = req.body;

      if (!reason) {
        return this.badRequest(res, 'Missing required field: reason');
      }

      const result = await this.contentService.rejectSubmission(submissionId, adminId, reason);
      this.ok(res, result, 'Submission rejected');
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  async requestChanges(req: Request, res: Response): Promise<void> {
    try {
      const adminId = this.getUserId(req);
      const submissionId = req.params.id;
      const { feedback } = req.body;

      if (!feedback) {
        return this.badRequest(res, 'Missing required field: feedback');
      }

      const result = await this.contentService.requestChanges(submissionId, adminId, feedback);
      this.ok(res, result, 'Changes requested');
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  async getFlaggedUsers(req: Request, res: Response): Promise<void> {
    try {
      const supabase = getSupabaseClient();
      const { limit, offset } = this.getPagination(req);
      const flagged = this.getQueryParamAsBoolean(req, 'flagged', true);

      let query = supabase
        .from('airdrop_leaderboard')
        .select('*', { count: 'exact' })
        .order('score', { ascending: false });

      if (flagged !== undefined) {
        query = query.eq('flagged', flagged);
      }

      query = query.range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) throw error;

      this.paginated(req, res, data || [], count || 0);
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  async flagUser(req: Request, res: Response): Promise<void> {
    try {
      const adminId = this.getUserId(req);
      const userId = req.params.id;
      const { reason } = req.body;

      if (!reason) {
        return this.badRequest(res, 'Missing required field: reason');
      }

      await this.antiSybilDetector.flagUser(userId, reason, adminId);
      this.ok(res, { success: true }, 'User flagged successfully');
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  async unflagUser(req: Request, res: Response): Promise<void> {
    try {
      const adminId = this.getUserId(req);
      const userId = req.params.id;

      await this.antiSybilDetector.unflagUser(userId, adminId);
      this.ok(res, { success: true }, 'User unflagged successfully');
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  async banUser(req: Request, res: Response): Promise<void> {
    try {
      const adminId = this.getUserId(req);
      const userId = req.params.id;
      const { reason } = req.body;

      if (!reason) {
        return this.badRequest(res, 'Missing required field: reason');
      }

      await this.antiSybilDetector.banUser(userId, reason, adminId);
      this.ok(res, { success: true }, 'User banned successfully');
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  async adjustUserPoints(req: Request, res: Response): Promise<void> {
    try {
      const adminId = this.getUserId(req);
      const userId = req.params.id;
      const { amount, reason } = req.body;

      if (amount === undefined || !reason) {
        return this.badRequest(res, 'Missing required fields: amount, reason');
      }

      const result = await this.pointsService.manualAdjustment(userId, amount, reason, adminId);
      this.ok(res, result, 'Points adjusted successfully');
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  async getUserActivityLog(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      const { limit, offset } = this.getPagination(req);

      const result = await this.pointsService.getPointHistory(userId, {}, limit, offset);
      this.paginated(req, res, result.transactions, result.total);
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  async getOverallStats(req: Request, res: Response): Promise<void> {
    try {
      const [totalPoints, totalUsers, leaderboardStats, submissionStats] = await Promise.all([
        this.airdropService.getTotalPointsDistributed(),
        this.airdropService.getTotalUsers(),
        this.airdropService.getLeaderboardStats(),
        this.contentService.getSubmissionStats(),
      ]);

      this.ok(res, {
        totalPoints,
        totalUsers,
        leaderboard: leaderboardStats,
        submissions: submissionStats,
      });
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  async getAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const supabase = getSupabaseClient();

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: growthData } = await supabase
        .from('users')
        .select('created_at')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: true });

      const { data: activityData } = await supabase
        .from('daily_activities')
        .select('activity_date, activity_type')
        .gte('activity_date', thirtyDaysAgo.toISOString().split('T')[0])
        .order('activity_date', { ascending: true });

      const { data: pointsData } = await supabase
        .from('point_transactions')
        .select('created_at, amount, reference_type')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: true });

      this.ok(res, {
        userGrowth: growthData || [],
        dailyActivity: activityData || [],
        pointsDistribution: pointsData || [],
      });
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  async exportLeaderboard(req: Request, res: Response): Promise<void> {
    try {
      const limit = this.getQueryParamAsNumber(req, 'limit', 1000);
      const result = await this.airdropService.getLeaderboard(limit!, 0, true);

      const csv = this.convertToCSV(result.entries);

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=airdrop-leaderboard.csv');
      res.send(csv);
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  async runSybilScan(req: Request, res: Response): Promise<void> {
    try {
      const limit = this.getQueryParamAsNumber(req, 'limit', 100);
      const result = await this.antiSybilDetector.runBulkScan(limit);
      this.ok(res, result, 'Sybil scan completed');
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  async checkUserSybilRisk(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      const result = await this.antiSybilDetector.checkUser(userId);
      this.ok(res, result);
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  private convertToCSV(data: any[]): string {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];

    for (const row of data) {
      const values = headers.map((header) => {
        const value = row[header];
        if (typeof value === 'object') {
          return JSON.stringify(value).replace(/"/g, '""');
        }
        return `"${String(value).replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
  }
}
