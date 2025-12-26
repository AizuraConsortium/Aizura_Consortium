import { Request, Response } from 'express';
import { BaseController } from '../../shared/controllers/BaseController.js';
import { getSupabaseClient } from '../../shared/services/supabase/client.js';
import { AirdropService } from '../services/airdropService.js';
import { PointsService } from '../services/pointsService.js';
import { ReferralService } from '../services/referralService.js';
import { SocialAuthService } from '../services/socialAuthService.js';
import { ContentService, type ContentType } from '../services/contentService.js';
import { EngagementService, type ActivityType } from '../services/engagementService.js';

export class AirdropController extends BaseController {
  private airdropService: AirdropService;
  private pointsService: PointsService;
  private referralService: ReferralService;
  private socialAuthService: SocialAuthService;
  private contentService: ContentService;
  private engagementService: EngagementService;

  constructor() {
    super('AirdropController');
    const supabase = getSupabaseClient();
    this.airdropService = new AirdropService(supabase);
    this.pointsService = new PointsService(supabase);
    this.referralService = new ReferralService(supabase);
    this.socialAuthService = new SocialAuthService(supabase);
    this.contentService = new ContentService(supabase);
    this.engagementService = new EngagementService(supabase);
  }

  async getLeaderboard(req: Request, res: Response): Promise<void> {
    try {
      const { limit, offset } = this.getPagination(req);
      const result = await this.airdropService.getLeaderboard(limit, offset);
      this.paginated(req, res, result.entries, result.total);
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  async getMyStats(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);
      const stats = await this.airdropService.getUserStats(userId);
      this.ok(res, stats);
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  async getMyRank(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);
      const rank = await this.airdropService.getUserRank(userId);
      this.ok(res, { rank });
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  async getPointsBreakdown(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);
      const breakdown = await this.airdropService.getPointsBreakdown(userId);
      this.ok(res, { breakdown });
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  async getAirdropEstimate(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);
      const totalSupply = this.getQueryParamAsNumber(req, 'totalSupply', 1_000_000_000);
      const estimate = await this.airdropService.getAirdropEstimate(userId, totalSupply!);
      this.ok(res, estimate);
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  async connectTwitter(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);
      const returnUrl = this.getQueryParam(req, 'returnUrl');
      const authUrl = await this.socialAuthService.initiateTwitterAuth(userId, returnUrl);
      this.ok(res, { authUrl });
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  async handleTwitterCallback(req: Request, res: Response): Promise<void> {
    try {
      const code = this.getQueryParam(req, 'code');
      const state = this.getQueryParam(req, 'state');

      if (!code || !state) {
        return this.badRequest(res, 'Missing code or state parameter');
      }

      const result = await this.socialAuthService.handleTwitterCallback(code, state);
      this.ok(res, result, 'Twitter connected successfully');
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  async verifyTwitterFollow(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);
      const isFollowing = await this.socialAuthService.verifyTwitterFollow(userId);
      this.ok(res, { following: isFollowing });
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  async connectDiscord(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);
      const returnUrl = this.getQueryParam(req, 'returnUrl');
      const authUrl = await this.socialAuthService.initiateDiscordAuth(userId, returnUrl);
      this.ok(res, { authUrl });
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  async handleDiscordCallback(req: Request, res: Response): Promise<void> {
    try {
      const code = this.getQueryParam(req, 'code');
      const state = this.getQueryParam(req, 'state');

      if (!code || !state) {
        return this.badRequest(res, 'Missing code or state parameter');
      }

      const result = await this.socialAuthService.handleDiscordCallback(code, state);
      this.ok(res, result, 'Discord connected successfully');
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  async disconnectSocial(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);
      const platform = req.params.platform as 'twitter' | 'discord' | 'telegram' | 'github';

      if (!['twitter', 'discord', 'telegram', 'github'].includes(platform)) {
        return this.badRequest(res, 'Invalid platform');
      }

      if (platform === 'twitter') {
        await this.socialAuthService.disconnectTwitter(userId);
      } else if (platform === 'discord') {
        await this.socialAuthService.disconnectDiscord(userId);
      } else {
        return this.badRequest(res, `${platform} disconnect not yet implemented`);
      }

      this.ok(res, { success: true }, `${platform} disconnected successfully`);
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  async getSocialConnections(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);
      const connections = await this.socialAuthService.getSocialConnections(userId);
      this.ok(res, { connections });
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  async getReferralCode(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);
      const code = await this.referralService.generateReferralCode(userId);
      this.ok(res, { code });
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  async getReferrals(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);
      const referrals = await this.referralService.getReferrals(userId);
      this.ok(res, { referrals, count: referrals.length });
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  async getReferralStats(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);
      const stats = await this.referralService.getReferralStats(userId);
      this.ok(res, stats);
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  async getReferralLeaderboard(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const limit = parseInt(req.query.limit as string) || 100;
      const supabase = getSupabaseClient();

      const { data, error } = await supabase.rpc('get_referral_leaderboard', {
        limit_count: limit
      });

      if (error) throw error;

      const leaderboard = data.map((entry: any) => ({
        ...entry,
        isCurrentUser: userId ? entry.user_id === userId : false
      }));

      this.ok(res, leaderboard);
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  async submitContent(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);
      const { contentType, title, description, url, screenshotUrl, pointsRequested } = req.body;

      if (!contentType || !title || !url) {
        return this.badRequest(res, 'Missing required fields: contentType, title, url');
      }

      const submission = await this.contentService.submitContent(
        userId,
        contentType as ContentType,
        { title, description, url, screenshotUrl, pointsRequested }
      );

      this.created(res, submission, 'Content submitted for review');
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  async getMySubmissions(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);
      const submissions = await this.contentService.getUserSubmissions(userId);
      this.ok(res, { submissions, count: submissions.length });
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  async getSubmissionById(req: Request, res: Response): Promise<void> {
    try {
      const submissionId = req.params.id;
      const submission = await this.contentService.getSubmissionById(submissionId);

      if (!submission) {
        return this.notFound(res, 'Submission not found');
      }

      this.ok(res, submission);
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  async trackActivity(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);
      const { activityType, metadata } = req.body;

      if (!activityType) {
        return this.badRequest(res, 'Missing required field: activityType');
      }

      let result;

      switch (activityType as ActivityType) {
        case 'login':
          result = await this.engagementService.trackLogin(userId);
          break;
        case 'view_debate':
          result = await this.engagementService.trackDebateView(
            userId,
            metadata?.topicId,
            metadata?.durationSeconds || 0
          );
          break;
        case 'read_article':
          result = await this.engagementService.trackArticleRead(userId, metadata?.articleId);
          break;
        case 'vote':
          result = await this.engagementService.trackVote(userId, metadata?.proposalId);
          break;
        case 'comment':
          result = await this.engagementService.trackComment(userId, metadata?.commentId);
          break;
        default:
          return this.badRequest(res, 'Invalid activity type');
      }

      this.ok(res, result);
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  async updateWalletAddress(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);
      const { walletAddress } = req.body;

      if (!walletAddress) {
        return this.badRequest(res, 'Missing required field: walletAddress');
      }

      const result = await this.airdropService.updateWalletAddress(userId, walletAddress);
      this.ok(res, result, 'Wallet address updated successfully');
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  async getPointHistory(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);
      const { limit, offset } = this.getPagination(req);
      const referenceType = this.getQueryParam(req, 'referenceType');
      const startDate = this.getQueryParam(req, 'startDate');
      const endDate = this.getQueryParam(req, 'endDate');

      const result = await this.pointsService.getPointHistory(
        userId,
        { referenceType, startDate, endDate },
        limit,
        offset
      );

      this.paginated(req, res, result.transactions, result.total);
    } catch (error) {
      this.handleError(error, req, res);
    }
  }
}
