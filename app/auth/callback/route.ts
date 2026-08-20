import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/db/config";

/**
 * Auth callback — completes email confirmation / OAuth and redirects the
 * user to their dashboard in their language.
 */
export async function GET(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";
  const locale = searchParams.get("locale") ?? "ar";

  if (code) {
    const sb = await createClient();
    const { error } = await sb.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(`/${locale}${next}`, origin));
    }
  }
  // Confirmation failed or no code — send back home.
  return NextResponse.redirect(new URL(`/${locale}`, origin));
}
