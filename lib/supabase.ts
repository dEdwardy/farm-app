import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? process.env.EXPO_PUBLIC_SUPABASE_KEY;

export const supabaseInitError =
  !supabaseUrl || !supabaseAnonKey
    ? 'Missing Supabase environment variables. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY (or EXPO_PUBLIC_SUPABASE_KEY).'
    : null;

export const supabase: SupabaseClient | null =
  supabaseInitError ? null : createClient(supabaseUrl!, supabaseAnonKey!);

console.error('supabaseAnonKey',supabaseAnonKey)