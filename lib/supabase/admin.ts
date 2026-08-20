import { createClient } from "@supabase/supabase-js";
import {
  supabaseUrl,
  supabaseAnonKey,
  supabaseServiceRoleKey,
} from "@/lib/db/config";

/**
 * Service-role client — SERVER ONLY. Bypasses RLS.
 * Used for seeding and privileged admin operations.
 */
export function createAdminClient() {
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function hasServiceRole(): boolean {
  return Boolean(supabaseUrl && supabaseServiceRoleKey);
}

/** If a project is fully configured we can seed it; otherwise anon-only mode. */
export function isFullyConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey && supabaseServiceRoleKey);
}
