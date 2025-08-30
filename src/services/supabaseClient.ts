import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment';

// Evita múltiples instancias con HMR / recargas
const globalAny = globalThis as unknown as { __supabase?: SupabaseClient };

export const supabase: SupabaseClient =
  globalAny.__supabase ??
  (globalAny.__supabase = createClient(
    environment.supabaseUrl,
    environment.supabaseKey,
    {
      auth: { persistSession: false },
    }
  ));
