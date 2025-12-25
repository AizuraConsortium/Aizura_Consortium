import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { usageTracker } from '../../client/services/usageTracker';
import { U2EWebhookPayload } from '../../../shared/types/u2e';
import { getSupabaseClient } from '../services/supabase/client';

const supabaseClient = getSupabaseClient();

export class U2EWebhookController extends BaseController {
  constructor() {
    super('U2EWebhookController');
  }

  async receiveEvent(req: Request, res: Response): Promise<void> {
    try {
      const payload: U2EWebhookPayload = req.body;

      if (!payload.api_key || !payload.user_id || !payload.action_type || !payload.idempotency_key) {
        this.badRequest(res, 'Missing required fields: api_key, user_id, action_type, idempotency_key');
        return;
      }

      const businessName = await this.verifyApiKey(payload.api_key);
      if (!businessName) {
        this.unauthorized(res, 'Invalid API key');
        return;
      }

      const result = await usageTracker.trackUsage(
        payload.user_id,
        businessName,
        payload.action_type,
        payload.metadata || {},
        req.ip,
        req.headers['user-agent']
      );

      if (!result.success) {
        if (result.error?.includes('Duplicate')) {
          this.ok(res, {
            success: true,
            message: 'Event already processed (idempotent)',
            event_id: null,
          });
          return;
        }

        this.badRequest(res, result.error || 'Failed to track usage');
        return;
      }

      this.ok(res, {
        success: true,
        event_id: result.event_id,
        message: 'Usage event tracked successfully',
      });
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  private async verifyApiKey(apiKey: string): Promise<string | null> {
    try {
      const hash = require('crypto').createHash('sha256').update(apiKey).digest('hex');

      const { data, error } = await supabaseClient
        .from('u2e_businesses')
        .select('business_name')
        .eq('api_key_hash', hash)
        .eq('is_active', true)
        .is('deleted_at', null)
        .maybeSingle();

      if (error || !data) {
        return null;
      }

      return data.business_name;
    } catch (error) {
      console.error('API key verification error:', error);
      return null;
    }
  }
}

export const u2eWebhookController = new U2EWebhookController();
