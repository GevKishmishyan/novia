import { createInvitationTemplateSchema } from "@novia/contracts";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { apiError } from "@/lib/api-response";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return apiError("Owner access required", 403);
  const supabase = await createClient();
  const { data, error } = await supabase.from("invitation_templates").select("id, name, mood, palette, couple, event_date, accent, published, created_at, updated_at").order("created_at", { ascending: false });
  if (error) return apiError("Unable to load templates", 500);
  return Response.json({ templates: data });
}

export async function POST(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return apiError("Owner access required", 403);
  const parsed = createInvitationTemplateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return apiError("Check the template details", 400, parsed.error.flatten().fieldErrors);
  const supabase = await createClient();
  const { date, ...template } = parsed.data;
  const { data, error } = await supabase.from("invitation_templates").insert({ ...template, created_by: admin.id, event_date: date }).select("id, name, mood, palette, couple, event_date, accent, published, created_at, updated_at").single();
  if (error?.code === "23505") return apiError("A template with this URL ID already exists", 409);
  if (error) return apiError("Unable to create the template", 500);
  return Response.json({ template: data }, { status: 201 });
}
