import { createBrowserClient } from '@supabase/ssr';

// Get environment variables directly in client utils
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const createClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
    // Return a minimal client that won't make actual API calls
    // This prevents runtime errors but the app won't function properly
    return {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        signInWithPassword: () => Promise.resolve({ data: {}, error: { message: 'Configuration error' } }),
        signUp: () => Promise.resolve({ data: {}, error: { message: 'Configuration error' } }),
      },
    } as any;
  }

  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  );
};

export type ToraUser = {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
};

export type Source = {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
};

export type Insight = {
  id: string;
  content: string;
  userId: string;
  sourceId: string;
  createdAt: string;
  likes: number;
  user?: ToraUser;
};

export type Comment = {
  id: string;
  content: string;
  userId: string;
  insightId: string;
  createdAt: string;
  user?: ToraUser;
}; 