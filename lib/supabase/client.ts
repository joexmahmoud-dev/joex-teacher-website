import { createBrowserClient } from "@supabase/ssr";
import { supabaseUrl, supabaseAnonKey } from "@/lib/db/config";

/** Browser-side Supabase client (public anon key). */
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
