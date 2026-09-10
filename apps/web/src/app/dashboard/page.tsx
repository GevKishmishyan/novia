import { redirect } from "next/navigation";
import { ArrowRight, Shield } from "lucide-react";
import Link from "next/link";
import { NoviaMark } from "@/components/brand/novia-mark";
import { AccountMenu } from "@/components/auth/account-menu";
import { TemplatePreview } from "@/components/invitations/template-preview";
import { listInvitationTemplates } from "@/lib/invitation-template-repository";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { getCurrentAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard — Novia" };

export default async function DashboardPage() {
  if (!hasSupabaseConfig()) redirect("/login");
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) redirect("/login");
  const admin = await getCurrentAdmin();
  const { data: drafts } = await supabase.from("invitation_drafts").select("id, template_id, details, status, updated_at").order("updated_at", { ascending: false });
  const invitationTemplates = await listInvitationTemplates();
  const selectedTemplateIds = new Set((drafts ?? []).map((draft) => draft.template_id));
  const myTemplates = (drafts ?? []).flatMap((draft) => {
    const template = invitationTemplates.find((candidate) => candidate.id === draft.template_id);
    return template ? [{ draft, template }] : [];
  });
  const availableTemplates = invitationTemplates.filter((template) => !selectedTemplateIds.has(template.id));
  return (
    <main className="min-h-screen bg-warm-white">
      <header className="border-b border-forest/10"><div className="shell flex h-24 items-center justify-between"><Link aria-label="Novia home" href="/"><NoviaMark /></Link><div className="flex items-center gap-3">{admin && <Link className="hidden min-h-10 items-center gap-2 rounded-full border border-forest/15 px-4 text-sm font-semibold sm:inline-flex" href="/admin/templates"><Shield size={15} /> Template admin</Link>}<AccountMenu user={{ email: typeof data.claims.email === "string" ? data.claims.email : null, id: data.claims.sub }} /></div></div></header>
      <section className="border-b border-forest/10 bg-parchment/45 py-14 md:py-20">
        <div className="shell"><p className="text-xs font-semibold uppercase tracking-[.22em] text-taupe">Your celebration</p><h1 className="mt-5 font-display text-5xl md:text-6xl">Welcome to Novia.</h1><p className="mt-4 max-w-xl leading-7 text-taupe">Choose an invitation below and make it yours. Your planning dashboard will grow around your celebration.</p></div>
      </section>
      <section className="shell scroll-mt-8 py-14 md:py-20" id="my-templates">
        <div className="border-b border-forest/15 pb-7"><p className="text-xs font-semibold uppercase tracking-[.2em] text-taupe">Your saved work</p><h2 className="mt-3 font-display text-4xl md:text-5xl">My templates</h2></div>
        {myTemplates.length > 0 ? <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {myTemplates.map(({ draft, template }) => (
            <article key={draft.id}>
              <TemplatePreview template={{ ...template, couple: `${String((draft.details as Record<string, unknown>).partnerOne ?? template.couple.split(" & ")[0])} & ${String((draft.details as Record<string, unknown>).partnerTwo ?? template.couple.split(" & ")[1])}`, date: String((draft.details as Record<string, unknown>).date ?? template.date) }} />
              <div className="mt-5 flex items-center justify-between gap-4"><div><h3 className="font-display text-3xl">{template.name}</h3><p className="mt-1 text-sm text-taupe">Draft · Ready to continue</p></div><Link aria-label={`Continue editing ${template.name}`} className="inline-flex min-h-11 items-center rounded-full bg-forest px-5 text-sm font-semibold text-warm-white" href={`/invitations/${template.id}/customize`}>Continue <ArrowRight className="ml-2" size={16} /></Link></div>
            </article>
          ))}
        </div> : <div className="mt-8 rounded-[1.5rem] border border-dashed border-forest/20 bg-parchment/25 p-8"><p className="font-display text-3xl">No templates selected yet</p><p className="mt-2 text-sm leading-6 text-taupe">Choose a design below. It will appear here as soon as you open its editor.</p></div>}
      </section>
      <section className="border-t border-forest/10 bg-parchment/25 py-14 md:py-20">
        <div className="shell">
        <div className="flex flex-col justify-between gap-4 border-b border-forest/15 pb-7 sm:flex-row sm:items-end"><div><p className="text-xs font-semibold uppercase tracking-[.2em] text-taupe">Invitation studio</p><h2 className="mt-3 font-display text-4xl md:text-5xl">Choose your template</h2></div><Link className="inline-flex items-center gap-2 text-sm font-semibold" href="/invitations">View full collection <ArrowRight size={16} /></Link></div>
        <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {availableTemplates.map((template) => (
            <article key={template.id}>
              <TemplatePreview template={template} />
              <div className="mt-5 flex items-center justify-between gap-4"><div><h3 className="font-display text-3xl">{template.name}</h3><p className="mt-1 text-sm text-taupe">{template.mood} · {template.palette}</p></div><Link aria-label={`Customize ${template.name}`} className="grid size-11 shrink-0 place-items-center rounded-full bg-forest text-warm-white transition-transform hover:translate-x-1" href={`/invitations/${template.id}/customize`}><ArrowRight size={17} /></Link></div>
            </article>
          ))}
        </div>
        {availableTemplates.length === 0 && <p className="mt-8 text-taupe">You have selected every available template.</p>}
        </div>
      </section>
    </main>
  );
}
