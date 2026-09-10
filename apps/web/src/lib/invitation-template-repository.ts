import { invitationTemplates, type InvitationTemplate } from "@/lib/invitation-templates";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

type TemplateRow = {
  accent: InvitationTemplate["accent"];
  couple: string;
  event_date: string;
  id: string;
  mood: string;
  name: string;
  palette: string;
  published: boolean;
};

function fromRow(row: TemplateRow): InvitationTemplate {
  return { accent: row.accent, couple: row.couple, date: row.event_date, id: row.id, mood: row.mood, name: row.name, palette: row.palette };
}

export async function listInvitationTemplates({ includeUnpublished = false }: { includeUnpublished?: boolean } = {}) {
  if (!hasSupabaseConfig()) return invitationTemplates;
  try {
    const supabase = await createClient();
    let query = supabase.from("invitation_templates").select("id, name, mood, palette, couple, event_date, accent, published").order("created_at", { ascending: true });
    if (!includeUnpublished) query = query.eq("published", true);
    const { data, error } = await query;
    if (error || !data) return invitationTemplates;
    return (data as TemplateRow[]).map(fromRow);
  } catch {
    return invitationTemplates;
  }
}

export async function findInvitationTemplate(id: string) {
  const templates = await listInvitationTemplates();
  return templates.find((template) => template.id === id);
}
