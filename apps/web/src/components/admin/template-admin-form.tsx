"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { createInvitationTemplateSchema, type CreateInvitationTemplateRequest } from "@novia/contracts";
import { Check, Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { TemplatePreview } from "@/components/invitations/template-preview";
import type { InvitationTemplate } from "@/lib/invitation-templates";

const defaults: CreateInvitationTemplateRequest = { accent: "arch", couple: "Amelia & James", date: "SEPTEMBER 14, 2027", id: "", mood: "Romantic", name: "", palette: "Forest & parchment", published: false };

export function TemplateAdminForm() {
  const router = useRouter();
  const [result, setResult] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");
  const { control, formState: { errors }, handleSubmit, register, reset } = useForm<CreateInvitationTemplateRequest>({ defaultValues: defaults, resolver: zodResolver(createInvitationTemplateSchema) });
  const values = useWatch({ control });
  const preview: InvitationTemplate = { accent: values.accent ?? "arch", couple: values.couple || defaults.couple, date: values.date || defaults.date, id: values.id || "new-template", mood: values.mood || defaults.mood, name: values.name || "New template", palette: values.palette || defaults.palette };

  const submit = handleSubmit(async (payload) => {
    setResult("saving");
    setMessage("");
    const response = await fetch("/api/v1/admin/invitation-templates", { body: JSON.stringify(payload), headers: { "Content-Type": "application/json" }, method: "POST" });
    const body = await response.json().catch(() => ({})) as { error?: { message?: string } };
    if (!response.ok) { setResult("error"); setMessage(body.error?.message ?? "Unable to create the template"); return; }
    setResult("saved");
    setMessage(payload.published ? "Template created and published." : "Template saved as a private draft.");
    reset(defaults);
    router.refresh();
  });

  return <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(360px,.85fr)]"><form className="rounded-[1.5rem] border border-forest/10 bg-warm-white p-6 shadow-sm sm:p-8" onSubmit={submit}><div className="grid gap-5 sm:grid-cols-2"><AdminField error={errors.name?.message} label="Template name" placeholder="Rose garden" {...register("name")} /><AdminField error={errors.id?.message} label="URL ID" placeholder="rose-garden" {...register("id")} /><AdminField error={errors.mood?.message} label="Mood" placeholder="Romantic" {...register("mood")} /><AdminField error={errors.palette?.message} label="Palette" placeholder="Blush & ivory" {...register("palette")} /><AdminField error={errors.couple?.message} label="Preview couple" placeholder="Amelia & James" {...register("couple")} /><AdminField error={errors.date?.message} label="Preview date" placeholder="SEPTEMBER 14, 2027" {...register("date")} /><label className="block text-sm font-semibold sm:col-span-2">Visual layout<select className="editor-input mt-2" {...register("accent")}><option value="arch">Arch</option><option value="botanical">Botanical</option><option value="monogram">Monogram</option><option value="ribbon">Ribbon</option><option value="minimal">Minimal</option><option value="terracotta">Terracotta</option></select></label></div><label className="mt-6 flex items-start gap-3 rounded-xl bg-parchment/45 p-4"><input className="mt-1 size-4 accent-forest" type="checkbox" {...register("published")} /><span><span className="block text-sm font-semibold">Publish immediately</span><span className="mt-1 block text-xs leading-5 text-taupe">Published templates become available in the public gallery and customer dashboard.</span></span></label><button className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-forest px-6 text-sm font-semibold text-warm-white disabled:opacity-60" disabled={result === "saving"} type="submit">{result === "saving" ? <Loader2 className="mr-2 animate-spin" size={17} /> : result === "saved" ? <Check className="mr-2" size={17} /> : <Plus className="mr-2" size={17} />}{result === "saving" ? "Creating…" : "Create template"}</button>{message && <p className={`mt-4 text-sm ${result === "error" ? "text-terracotta" : "text-forest"}`} role="status">{message}</p>}</form><div><p className="mb-3 text-xs font-semibold uppercase tracking-[.18em] text-taupe">Live card preview</p><TemplatePreview template={preview} /><div className="mt-4 rounded-xl border border-forest/10 bg-parchment/35 p-4 text-sm leading-6 text-taupe">This creates a new content and palette variant using an existing NOVIA layout. New structural layouts still require implementation and review.</div></div></div>;
}

function AdminField({ error, label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { error?: string; label: string }) {
  return <label className="block text-sm font-semibold">{label}<input aria-invalid={Boolean(error)} className="editor-input mt-2" {...props} />{error && <span className="mt-1 block text-xs text-terracotta">{error}</span>}</label>;
}
