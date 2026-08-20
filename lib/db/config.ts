/**
 * Database configuration.
 *
 * When NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY are present the
 * site runs against the persistent Supabase PostgreSQL database and Storage.
 * Otherwise it runs in PREVIEW MODE: bundled seed data is served instead and a
 * dismissible banner is shown. The switch requires no code changes.
 */

export const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
export const supabaseServiceRoleKey: string = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

export const siteUrl: string =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://joex-teacher.example";
