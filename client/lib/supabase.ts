import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing required environment variables:\n' +
    (!supabaseUrl ? '- VITE_SUPABASE_URL\n' : '') +
    (!supabaseAnonKey ? '- VITE_SUPABASE_ANON_KEY\n' : '') +
    '\nPlease check your .env file and ensure all required variables are set.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
