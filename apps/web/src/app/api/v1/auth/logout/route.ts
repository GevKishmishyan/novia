import { cookies } from "next/headers";
import { apiError } from "@/lib/api-response";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  if (!hasSupabaseConfig()) return apiError("Authentication is not configured yet", 503);
  const supabase = await createClient();
  await supabase.auth.signOut({ scope: "local" }).catch(() => undefined);

  // Explicitly expire every chunk of the Supabase session. This keeps logout
  // reliable even when the provider reports a stale or partially missing session.
  const cookieStore = await cookies();
  cookieStore.getAll()
    .filter(({ name }) => name.startsWith("sb-") && name.includes("-auth-token"))
    .forEach(({ name }) => cookieStore.delete(name));

  return new Response(null, { headers: { "Cache-Control": "no-store" }, status: 204 });
}
