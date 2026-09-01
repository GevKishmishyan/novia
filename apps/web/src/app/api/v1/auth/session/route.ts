import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  const { data: membership } = claims
    ? await supabase.from("admin_users").select("user_id").eq("user_id", claims.sub).maybeSingle()
    : { data: null };

  return Response.json({
    user: claims ? { email: typeof claims.email === "string" ? claims.email : null, id: claims.sub, role: membership ? "owner" : "user" } : null,
  });
}
