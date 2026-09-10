import { apiError } from "@/lib/api-response";
import { OWNER_EMAIL } from "@/lib/owner";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  if (!hasSupabaseConfig()) return apiError("Authentication is not configured yet", 503);
  const origin = new URL(request.url).origin;
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(OWNER_EMAIL, {
    redirectTo: `${origin}/auth/confirm?next=${encodeURIComponent("/admin/reset-password")}`,
  });
  if (error) return apiError("Unable to send the recovery email. Please try again shortly.", 500);
  return Response.json({ sent: true });
}
