import { loginRequestSchema } from "@novia/contracts";
import { apiError } from "@/lib/api-response";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = loginRequestSchema.safeParse(body);
  if (!parsed.success) return apiError("Check the highlighted fields", 400, parsed.error.flatten().fieldErrors);
  if (!hasSupabaseConfig()) return apiError("Authentication is not configured yet", 503);

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error || !data.user) return apiError("Email or password is incorrect", 401);

  return Response.json({ user: { email: data.user.email, id: data.user.id } });
}
