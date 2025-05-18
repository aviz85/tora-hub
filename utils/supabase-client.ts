import { createBrowserClient } from '@supabase/ssr';
import { supabaseUrl, supabaseAnonKey } from '../lib/supabase';

export const createClient = () => {
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