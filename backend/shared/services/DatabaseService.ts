import type { SupabaseClient } from '@supabase/supabase-js';
import { BaseService } from './BaseService.js';

export abstract class DatabaseService extends BaseService {
  protected supabase: SupabaseClient;

  constructor(serviceName: string, supabase: SupabaseClient) {
    super(serviceName);
    this.supabase = supabase;
  }
}
