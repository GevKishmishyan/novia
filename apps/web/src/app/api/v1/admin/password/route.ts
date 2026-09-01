import { updatePasswordRequestSchema } from "@novia/contracts";
import { apiError } from "@/lib/api-response";
import { OWNER_EMAIL } from "@/lib/owner";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const parsed = updatePasswordRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return apiError("Check the highlighted fields", 400, parsed.error.flatten().fieldErrors);
  if (!hasSupabaseConfig()) return apiError("Authentication is not configured yet", 503);

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  const email = typeof auth?.claims?.email === "string" ? auth.claims.email.toLowerCase() : null;
  if (email !== OWNER_EMAIL) return apiError("This recovery session is not authorized for the owner account", 403);

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return apiError("Unable to update the password. Request a new recovery link and try again.", 400);
  return Response.json({ updated: true });
}
