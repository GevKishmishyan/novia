import { ArrowLeft, Eye, EyeOff, Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { TemplateAdminForm } from "@/components/admin/template-admin-form";
import { AccountMenu } from "@/components/auth/account-menu";
import { NoviaMark } from "@/components/brand/novia-mark";
import { TemplatePreview } from "@/components/invitations/template-preview";
import { getCurrentAdmin } from "@/lib/admin-auth";
import type { InvitationTemplate } from "@/lib/invitation-templates";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Template admin — Novia" };

type AdminTemplateRow = { accent: InvitationTemplate["accent"]; couple: string; event_date: string; id: string; mood: string; name: string; palette: string; published: boolean };

export default async function AdminTemplatesPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login?next=%2Fadmin%2Ftemplates");
  const supabase = await createClient();
  const { data } = await supabase.from("invitation_templates").select("id, name, mood, palette, couple, event_date, accent, published").order("created_at", { ascending: false });
  const templates = (data ?? []) as AdminTemplateRow[];
  return <main className="min-h-screen bg-[#f4efe5]"><header className="border-b border-forest/10 bg-warm-white"><div className="shell flex h-24 items-center justify-between"><Link aria-label="Novia home" href="/"><NoviaMark /></Link><div className="flex items-center gap-4"><Link className="hidden items-center gap-2 text-sm font-semibold sm:inline-flex" href="/dashboard"><ArrowLeft size={16} /> Dashboard</Link><AccountMenu user={{ email: admin.email, id: admin.id }} /></div></div></header><section className="border-b border-forest/10 bg-parchment/55 py-14 md:py-20"><div className="shell"><p className="text-xs font-semibold uppercase tracking-[.22em] text-taupe">Owner workspace</p><h1 className="mt-4 font-display text-5xl md:text-7xl">Invitation templates</h1><p className="mt-4 max-w-2xl leading-7 text-taupe">Create and publish new variants without editing application code. Every template remains compatible with NOVIA’s invitation customizer.</p></div></section><section className="shell py-14 md:py-20"><div className="mb-8 flex items-center gap-3"><span className="grid size-10 place-items-center rounded-full bg-forest text-warm-white"><Plus size={18} /></span><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-taupe">Add to the collection</p><h2 className="font-display text-4xl">Create a template</h2></div></div><TemplateAdminForm /></section><section className="border-t border-forest/10 bg-warm-white py-14 md:py-20"><div className="shell"><div className="border-b border-forest/15 pb-6"><p className="text-xs font-semibold uppercase tracking-[.16em] text-taupe">Catalog</p><h2 className="mt-2 font-display text-4xl">Existing templates</h2></div>{templates.length ? <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">{templates.map((row) => { const template: InvitationTemplate = { accent: row.accent, couple: row.couple, date: row.event_date, id: row.id, mood: row.mood, name: row.name, palette: row.palette }; return <article key={row.id}><TemplatePreview template={template} /><div className="mt-4 flex items-start justify-between gap-3"><div><h3 className="font-display text-3xl">{row.name}</h3><p className="mt-1 text-sm text-taupe">/{row.id}</p></div><span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${row.published ? "bg-sage/25 text-forest" : "bg-parchment text-taupe"}`}>{row.published ? <Eye size={13} /> : <EyeOff size={13} />}{row.published ? "Published" : "Draft"}</span></div></article>; })}</div> : <p className="mt-8 text-taupe">No database templates yet. Apply the latest Supabase migration, then add your first template.</p>}</div></section></main>;
}
