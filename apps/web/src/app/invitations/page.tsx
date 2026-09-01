import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";
import Link from "next/link";
import { NoviaMark } from "@/components/brand/novia-mark";
import { InvitationGallery } from "@/components/invitations/invitation-gallery";
import { ButtonLink } from "@/components/ui/button";
import { listInvitationTemplates } from "@/lib/invitation-template-repository";

export const metadata = {
  title: "Invitation templates — Novia",
  description: "Choose a beautiful starting point for your wedding invitation.",
};

export default async function InvitationsPage() {
  const invitationTemplates = await listInvitationTemplates();
  return (
    <main className="min-h-screen bg-warm-white">
      <header className="border-b border-forest/10 bg-parchment/55">
        <div className="shell flex h-24 items-center justify-between">
          <Link aria-label="Novia home" href="/"><NoviaMark /></Link>
          <Link className="inline-flex items-center gap-2 text-sm font-semibold text-forest" href="/"><ArrowLeft size={16} /> Back to home</Link>
        </div>
      </header>

      <section className="border-b border-forest/10 bg-parchment/55 py-16 md:py-24">
        <div className="shell grid gap-10 md:grid-cols-[1fr_.7fr] md:items-end">
          <div><p className="text-xs font-semibold uppercase tracking-[.22em] text-taupe">Step one · Your invitation</p><h1 className="mt-5 max-w-3xl font-display text-6xl leading-[.86] tracking-[-.045em] md:text-8xl">Choose the feeling of your day.</h1></div>
          <div><p className="max-w-md leading-7 text-taupe">Start with a considered design. You’ll add your names, story, celebration details, and RSVP questions in the next step.</p><div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-forest"><span className="inline-flex items-center gap-2"><Check size={15} /> Customizable</span><span className="inline-flex items-center gap-2"><Check size={15} /> RSVP-ready</span></div></div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="shell">
          <div className="border-b border-forest/15 pb-7"><p className="text-xs font-semibold uppercase tracking-[.2em] text-taupe">The collection</p><h2 className="mt-3 font-display text-4xl md:text-5xl">Find your starting point</h2></div>
          <InvitationGallery templates={invitationTemplates} />
        </div>
      </section>

      <section className="bg-forest py-16 text-warm-white"><div className="shell flex flex-col items-start justify-between gap-8 md:flex-row md:items-center"><div><p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.2em] text-sage"><Sparkles size={15} /> More designs will follow</p><h2 className="mt-4 font-display text-4xl md:text-5xl">Start with one. Make it yours.</h2></div><ButtonLink href="/signup" variant="light">Create your invitation <ArrowRight className="ml-2" size={16} /></ButtonLink></div></section>
    </main>
  );
}
