import type { SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? process.env.EXPO_PUBLIC_SUPABASE_KEY;

export const supabaseInitError =
  !supabaseUrl || !supabaseAnonKey
    ? 'Missing Supabase environment variables. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY (or EXPO_PUBLIC_SUPABASE_KEY).'
    : null;

let _supabase: SupabaseClient | null = null;
let _initPromise: Promise<SupabaseClient | null> | null = null;

export async function getSupabase(): Promise<SupabaseClient | null> {
  if (_supabase) return _supabase;
  if (_initPromise) return _initPromise;
  if (supabaseInitError) return null;

  _initPromise = (async () => {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    const { createClient } = require('@supabase/supabase-js');

    _supabase = createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });

    return _supabase;
  })();

  return _initPromise;
}
