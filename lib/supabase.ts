import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for the entire application
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set'
  );
}

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
