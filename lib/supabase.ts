import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for the entire application
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://micbddidqiigbquwvfdq.supabase.co';
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pY2JkZGlkcWlpZ2JxdXd2ZmRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2MDYxNDcsImV4cCI6MjA2MzE4MjE0N30.737BP8K84Q-DCg1s46Rxg_pV6uzaG3lFHnETJjLYew0';

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey); 