import { createClient, SupabaseClient } from '@supabase/supabase-js';

let websiteSupabaseClient: SupabaseClient | null = null;

export function initializeWebsiteSupabaseClient(): SupabaseClient {
  if (websiteSupabaseClient) {
    return websiteSupabaseClient;
  }

  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY must be set for website backend');
  }

  websiteSupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    db: {
      schema: 'public'
    },
    global: {
      headers: {
        'X-Client-Info': 'aizura-consortium-website-backend'
      }
    }
  });

  return websiteSupabaseClient;
}

export function getWebsiteSupabaseClient(): SupabaseClient {
  if (!websiteSupabaseClient) {
    return initializeWebsiteSupabaseClient();
  }
  return websiteSupabaseClient;
}

export const websiteSupabase = getWebsiteSupabaseClient();
