import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { redirect } from "next/navigation";
import { NoviaMark } from "@/components/brand/novia-mark";
import { InvitationCustomizer } from "@/components/invitations/invitation-customizer";
import type { InvitationDetails } from "@/lib/invitation-templates";
import { findInvitationTemplate } from "@/lib/invitation-template-repository";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function CustomizeInvitationPage({ params }: { params: Promise<{ templateId: string }> }) {
  const { templateId } = await params;
  const template = await findInvitationTemplate(templateId);
  if (!template) notFound();
  const editorPath = `/invitations/${template.id}/customize`;
  if (!hasSupabaseConfig()) redirect(`/login?next=${encodeURIComponent(editorPath)}`);
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) redirect(`/login?next=${encodeURIComponent(editorPath)}`);
  const { data: draft } = await supabase.from("invitation_drafts").select("details").eq("template_id", template.id).maybeSingle();

  return (
    <main className="min-h-screen bg-warm-white">
      <header className="flex h-24 items-center justify-between border-b border-forest/10 px-5 sm:px-8">
        <Link aria-label="Novia home" href="/"><NoviaMark /></Link>
        <Link className="inline-flex items-center gap-2 text-sm font-semibold" href="/invitations"><ArrowLeft size={16} /> All templates</Link>
      </header>
      <InvitationCustomizer initialDetails={draft?.details as InvitationDetails | undefined} template={template} />
    </main>
  );
}
