import { SupabaseClient } from '@supabase/supabase-js';
import { AntiSybilDetector } from '../utils/antiSybil';

export interface SybilScanResult {
  timestamp: string;
  scannedCount: number;
  flaggedCount: number;
  flaggedUsers: Array<{
    userId: string;
    email: string;
    riskScore: number;
    flags: string[];
    reasons: string[];
  }>;
  errors: string[];
}

export class SybilScanJob {
  private supabase: SupabaseClient;
  private detector: AntiSybilDetector;
  private readonly SCAN_BATCH_SIZE = 200;
  private readonly HIGH_RISK_THRESHOLD = 80;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
    this.detector = new AntiSybilDetector(supabase);
  }

  async run(): Promise<SybilScanResult> {
    const result: SybilScanResult = {
      timestamp: new Date().toISOString(),
      scannedCount: 0,
      flaggedCount: 0,
      flaggedUsers: [],
      errors: [],
    };

    console.log('[SybilScan] Starting daily Sybil detection scan...');

    try {
      const { data: users, error } = await this.supabase
        .from('airdrop_leaderboard')
        .select('user_id, score')
        .eq('flagged', false)
        .eq('banned', false)
        .order('score', { ascending: false })
        .limit(this.SCAN_BATCH_SIZE);

      if (error) {
        result.errors.push(`Failed to fetch users: ${error.message}`);
        return result;
      }

      if (!users || users.length === 0) {
        console.log('[SybilScan] No users to scan');
        return result;
      }

      console.log(`[SybilScan] Scanning ${users.length} users...`);
      result.scannedCount = users.length;

      for (const user of users) {
        try {
          const checkResult = await this.detector.checkUser(user.user_id);

          if (checkResult.riskScore >= this.HIGH_RISK_THRESHOLD) {
            const { data: userData } = await this.supabase
              .from('users')
              .select('email')
              .eq('id', user.user_id)
              .maybeSingle();

            await this.detector.flagUser(
              user.user_id,
              `Auto-flagged by daily scan: ${checkResult.reasons.join('; ')}`
            );

            result.flaggedUsers.push({
              userId: user.user_id,
              email: userData?.email || 'unknown',
              riskScore: checkResult.riskScore,
              flags: checkResult.flags,
              reasons: checkResult.reasons,
            });

            result.flaggedCount++;

            console.log(`[SybilScan] Flagged user ${user.user_id} (risk: ${checkResult.riskScore})`);
          }
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : 'Unknown error';
          result.errors.push(`Error checking user ${user.user_id}: ${errorMsg}`);
          console.error(`[SybilScan] Error checking user ${user.user_id}:`, error);
        }
      }

      if (result.flaggedCount > 0) {
        await this.sendAdminNotification(result);
      }

      console.log(`[SybilScan] Scan complete. Flagged ${result.flaggedCount}/${result.scannedCount} users`);

      await this.logScanResult(result);

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      result.errors.push(`Scan failed: ${errorMsg}`);
      console.error('[SybilScan] Scan failed:', error);
    }

    return result;
  }

  private async sendAdminNotification(result: SybilScanResult): Promise<void> {
    try {
      const { data: admins } = await this.supabase
        .from('users')
        .select('id, email')
        .eq('role', 'admin');

      if (!admins || admins.length === 0) return;

      const notificationContent = this.buildNotificationContent(result);

      for (const admin of admins) {
        await this.supabase.from('notifications').insert({
          user_id: admin.id,
          type: 'system_alert',
          priority: 'high',
          category: 'security',
          title: 'Sybil Detection Alert',
          message: notificationContent,
          action_url: '/admin/airdrop?tab=flagged',
          metadata: {
            scanTimestamp: result.timestamp,
            flaggedCount: result.flaggedCount,
            scannedCount: result.scannedCount,
          },
        });
      }

      console.log(`[SybilScan] Sent notifications to ${admins.length} admin(s)`);
    } catch (error) {
      console.error('[SybilScan] Failed to send admin notifications:', error);
    }
  }

  private buildNotificationContent(result: SybilScanResult): string {
    let content = `Daily Sybil scan detected ${result.flaggedCount} suspicious account(s):\n\n`;

    result.flaggedUsers.slice(0, 5).forEach((user, i) => {
      content += `${i + 1}. ${user.email}\n`;
      content += `   Risk Score: ${user.riskScore}\n`;
      content += `   Flags: ${user.flags.join(', ')}\n`;
      content += `   Reasons: ${user.reasons.slice(0, 2).join('; ')}\n\n`;
    });

    if (result.flaggedUsers.length > 5) {
      content += `... and ${result.flaggedUsers.length - 5} more\n\n`;
    }

    content += 'Please review these accounts in the Admin Panel → Airdrop → Flagged Users tab.';

    return content;
  }

  private async logScanResult(result: SybilScanResult): Promise<void> {
    try {
      await this.supabase.from('system_logs').insert({
        level: result.flaggedCount > 0 ? 'warning' : 'info',
        category: 'sybil_scan',
        message: `Daily Sybil scan completed: ${result.flaggedCount} flagged out of ${result.scannedCount} scanned`,
        metadata: {
          timestamp: result.timestamp,
          scannedCount: result.scannedCount,
          flaggedCount: result.flaggedCount,
          errors: result.errors,
          flaggedUserIds: result.flaggedUsers.map(u => u.userId),
        },
      });
    } catch (error) {
      console.error('[SybilScan] Failed to log scan result:', error);
    }
  }

  async scheduleDailyScan(): Promise<void> {
    const now = new Date();
    const targetTime = new Date(now);
    targetTime.setUTCHours(3, 0, 0, 0);

    if (now > targetTime) {
      targetTime.setDate(targetTime.getDate() + 1);
    }

    const msUntilTarget = targetTime.getTime() - now.getTime();

    console.log(`[SybilScan] Next scan scheduled for ${targetTime.toISOString()}`);

    setTimeout(async () => {
      await this.run();
      setInterval(async () => {
        await this.run();
      }, 24 * 60 * 60 * 1000);
    }, msUntilTarget);
  }
}

export async function runSybilScan(supabase: SupabaseClient): Promise<SybilScanResult> {
  const job = new SybilScanJob(supabase);
  return await job.run();
}

export function startSybilScanScheduler(supabase: SupabaseClient): void {
  const job = new SybilScanJob(supabase);
  job.scheduleDailyScan();
  console.log('[SybilScan] Scheduler started - will run daily at 3:00 AM UTC');
}
