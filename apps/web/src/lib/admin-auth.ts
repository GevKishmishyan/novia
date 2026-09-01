import { createClient } from "@/lib/supabase/server";

export async function getCurrentAdmin() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  const userId = auth?.claims?.sub;
  if (!userId) return null;
  const { data: membership } = await supabase.from("admin_users").select("user_id").eq("user_id", userId).maybeSingle();
  if (!membership) return null;
  return { email: typeof auth.claims.email === "string" ? auth.claims.email : null, id: userId };
}
