import { saveInvitationDraftSchema } from "@novia/contracts";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { apiError } from "@/lib/api-response";
import { findInvitationTemplate } from "@/lib/invitation-template-repository";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  if (await getCurrentAdmin()) return apiError("Owner accounts cannot access customer invitations", 403);
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  const userId = auth?.claims?.sub;
  if (!userId) return apiError("Authentication required", 401);

  const { data, error } = await supabase.from("invitation_drafts").select("id, template_id, details, status, updated_at").order("updated_at", { ascending: false });
  if (error) return apiError("Unable to load invitation drafts", 500);
  return Response.json({ invitations: data });
}

export async function POST(request: Request) {
  if (await getCurrentAdmin()) return apiError("Owner accounts cannot access customer invitations", 403);
  const body = await request.json().catch(() => null);
  const parsed = saveInvitationDraftSchema.safeParse(body);
  if (!parsed.success) return apiError("Check the invitation details", 400, parsed.error.flatten().fieldErrors);
  if (!await findInvitationTemplate(parsed.data.templateId)) return apiError("Template not found", 404);

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  const userId = auth?.claims?.sub;
  if (!userId) return apiError("Authentication required", 401);

  const { data, error } = await supabase.from("invitation_drafts").upsert({
    details: parsed.data.details,
    template_id: parsed.data.templateId,
    updated_at: new Date().toISOString(),
    user_id: userId,
  }, { onConflict: "user_id,template_id" }).select("id, template_id, details, status, updated_at").single();
  if (error) return apiError("Unable to save invitation draft", 500);
  return Response.json({ invitation: data });
}
