import { signupRequestSchema } from "@novia/contracts";
import { apiError } from "@/lib/api-response";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { safeRedirectPath } from "@/lib/safe-redirect";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = signupRequestSchema.safeParse(body);
  if (!parsed.success) return apiError("Check the highlighted fields", 400, parsed.error.flatten().fieldErrors);
  if (!hasSupabaseConfig()) return apiError("Authentication is not configured yet", 503);

  const supabase = await createClient();
  const origin = new URL(request.url).origin;
  const nextPath = safeRedirectPath(new URL(request.url).searchParams.get("next"));
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.fullName },
      emailRedirectTo: `${origin}/auth/confirm?next=${encodeURIComponent(nextPath)}`,
    },
  });
  if (error || !data.user) return apiError(error?.message ?? "Unable to create account", 400);

  return Response.json({ needsEmailConfirmation: !data.session, user: { email: data.user.email, id: data.user.id } }, { status: 201 });
}
