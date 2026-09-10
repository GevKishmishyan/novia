import Link from "next/link";
import { NoviaMark } from "@/components/brand/novia-mark";

export function Footer() {
  return (
    <footer className="bg-forest py-14 text-warm-white">
      <div className="shell grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
        <div><NoviaMark /><p className="mt-4 max-w-xs text-sm leading-6 text-warm-white/65">A calmer way to plan the celebration that matters most.</p></div>
        <div><p className="mb-4 text-xs uppercase tracking-[0.18em] text-sage">Plan</p><div className="grid gap-3 text-sm text-warm-white/70"><Link href="#features">Features</Link><Link href="#how-it-works">How it works</Link><Link href="/pricing">Pricing</Link></div></div>
        <div><p className="mb-4 text-xs uppercase tracking-[0.18em] text-sage">Novia</p><div className="grid gap-3 text-sm text-warm-white/70"><Link href="#about">About</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div></div>
      </div>
      <div className="shell mt-12 border-t border-warm-white/15 pt-6 text-xs text-warm-white/45">© {new Date().getFullYear()} novia. Thoughtfully made for meaningful days.</div>
    </footer>
  );
}
