import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { safeRedirectPath } from "@/lib/safe-redirect";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tokenHash = url.searchParams.get("token_hash");
  const code = url.searchParams.get("code");
  const type = url.searchParams.get("type") as EmailOtpType | null;
  const nextPath = safeRedirectPath(url.searchParams.get("next"));
  const errorPath = nextPath.startsWith("/admin/") ? "/admin/login?error=recovery" : "/login?error=confirmation";
  if (!hasSupabaseConfig() || (!code && (!tokenHash || !type))) return NextResponse.redirect(new URL(errorPath, url));

  const supabase = await createClient();
  const { error } = code
    ? await supabase.auth.exchangeCodeForSession(code)
    : await supabase.auth.verifyOtp({ token_hash: tokenHash!, type: type! });
  return NextResponse.redirect(new URL(error ? errorPath : nextPath, url));
}
