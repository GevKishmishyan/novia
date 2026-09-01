import { ArrowRight, Eye, FileEdit, LayoutTemplate, Plus, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AccountMenu } from "@/components/auth/account-menu";
import { NoviaMark } from "@/components/brand/novia-mark";
import { TemplatePreview } from "@/components/invitations/template-preview";
import { getCurrentAdmin } from "@/lib/admin-auth";
import type { InvitationTemplate } from "@/lib/invitation-templates";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Owner dashboard — Novia" };

type TemplateRow = { accent: InvitationTemplate["accent"]; couple: string; event_date: string; id: string; mood: string; name: string; palette: string; published: boolean };

export default async function AdminPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login?next=%2Fadmin");

  const supabase = await createClient();
  const [{ count: total }, { count: published }, { data }] = await Promise.all([
    supabase.from("invitation_templates").select("id", { count: "exact", head: true }),
    supabase.from("invitation_templates").select("id", { count: "exact", head: true }).eq("published", true),
    supabase.from("invitation_templates").select("id, name, mood, palette, couple, event_date, accent, published").order("created_at", { ascending: false }).limit(3),
  ]);
  const templates = (data ?? []) as TemplateRow[];
  const totalCount = total ?? templates.length;
  const publishedCount = published ?? templates.filter(({ published: value }) => value).length;
  const draftCount = Math.max(0, totalCount - publishedCount);

  return <main className="min-h-screen bg-[#f4efe5]"><header className="border-b border-forest/10 bg-warm-white"><div className="shell flex h-24 items-center justify-between"><Link aria-label="Novia home" href="/"><NoviaMark /></Link><div className="flex items-center gap-4"><Link className="hidden text-sm font-semibold text-taupe transition-colors hover:text-forest sm:block" href="/">View website</Link><AccountMenu user={{ email: admin.email, id: admin.id }} /></div></div></header>
    <section className="overflow-hidden border-b border-forest/10 bg-forest text-warm-white"><div className="shell relative py-14 md:py-20"><div aria-hidden="true" className="absolute -right-20 -top-44 size-[28rem] rounded-full border border-warm-white/10" /><div aria-hidden="true" className="absolute -right-4 -top-24 size-[20rem] rounded-full border border-warm-white/10" /><div className="relative max-w-3xl"><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.22em] text-parchment"><ShieldCheck size={16} /> Private owner workspace</div><h1 className="mt-5 font-display text-5xl leading-[.95] md:text-7xl">Welcome back, Gevorg.</h1><p className="mt-5 max-w-2xl text-base leading-7 text-parchment/80">Manage the invitation collection, prepare new designs, and control what customers can discover across NOVIA.</p><Link className="mt-8 inline-flex min-h-12 items-center rounded-full bg-warm-white px-6 text-sm font-semibold text-forest" href="/admin/templates"><Plus className="mr-2" size={17} /> Add a new template</Link></div></div></section>
    <section className="shell py-12 md:py-16"><div className="grid gap-4 sm:grid-cols-3"><Metric icon={LayoutTemplate} label="All templates" value={totalCount} /><Metric icon={Eye} label="Published" value={publishedCount} /><Metric icon={FileEdit} label="Private drafts" value={draftCount} /></div>
      <div className="mt-14 grid gap-8 lg:grid-cols-[1.5fr_.75fr]"><section><div className="flex items-end justify-between gap-4 border-b border-forest/15 pb-5"><div><p className="text-xs font-semibold uppercase tracking-[.18em] text-taupe">Latest work</p><h2 className="mt-2 font-display text-4xl">Template collection</h2></div><Link className="inline-flex items-center gap-2 text-sm font-semibold" href="/admin/templates">Manage all <ArrowRight size={16} /></Link></div>{templates.length ? <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{templates.map((row) => <article key={row.id}><TemplatePreview template={{ accent: row.accent, couple: row.couple, date: row.event_date, id: row.id, mood: row.mood, name: row.name, palette: row.palette }} /><div className="mt-4 flex items-start justify-between gap-3"><div><h3 className="font-display text-2xl">{row.name}</h3><p className="mt-1 text-xs text-taupe">{row.mood} · {row.palette}</p></div><span className={`rounded-full px-2.5 py-1 text-[.65rem] font-semibold ${row.published ? "bg-sage/30" : "bg-parchment"}`}>{row.published ? "Live" : "Draft"}</span></div></article>)}</div> : <div className="mt-8 rounded-2xl border border-dashed border-forest/20 p-7"><p className="font-display text-3xl">Your collection is empty</p><p className="mt-2 text-sm text-taupe">Create the first invitation template to begin.</p></div>}</section>
        <aside><p className="text-xs font-semibold uppercase tracking-[.18em] text-taupe">Quick access</p><div className="mt-4 overflow-hidden rounded-[1.5rem] border border-forest/10 bg-warm-white"><QuickLink description="Create, preview, publish, and review designs." href="/admin/templates" icon={Sparkles} label="Invitation templates" /><QuickLink description="See exactly what visitors can browse." href="/invitations" icon={Eye} label="Public collection" /><QuickLink description="Return to your personal planning account." href="/dashboard" icon={LayoutTemplate} label="Customer dashboard" /></div><div className="mt-6 rounded-[1.5rem] bg-parchment/65 p-6"><p className="text-xs font-semibold uppercase tracking-[.16em] text-taupe">Owner access</p><p className="mt-3 text-sm leading-6">Only <span className="font-semibold">{admin.email}</span> is authorized for this workspace.</p></div></aside></div>
    </section></main>;
}

function Metric({ icon: Icon, label, value }: { icon: typeof LayoutTemplate; label: string; value: number }) {
  return <div className="flex items-center gap-4 rounded-[1.25rem] border border-forest/10 bg-warm-white p-5"><span className="grid size-11 place-items-center rounded-full bg-parchment"><Icon size={18} /></span><div><p className="font-display text-4xl leading-none">{value}</p><p className="mt-1 text-xs font-semibold uppercase tracking-[.12em] text-taupe">{label}</p></div></div>;
}

function QuickLink({ description, href, icon: Icon, label }: { description: string; href: string; icon: typeof Eye; label: string }) {
  return <Link className="group flex items-start gap-4 border-b border-forest/10 p-5 last:border-0 hover:bg-parchment/30" href={href}><span className="grid size-10 shrink-0 place-items-center rounded-full border border-forest/15"><Icon size={17} /></span><span><span className="flex items-center gap-2 font-semibold">{label}<ArrowRight className="transition-transform group-hover:translate-x-1" size={14} /></span><span className="mt-1 block text-xs leading-5 text-taupe">{description}</span></span></Link>;
}
