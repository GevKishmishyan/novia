import Link from "next/link";
import { BridePlaceholderAuth } from "./bride-placeholder-auth";
import { NoviaMark } from "@/components/brand/novia-mark";

export function AuthShell({ children, eyebrow, title }: { children: React.ReactNode; eyebrow: string; title: string }) {
  return <main className="grid min-h-screen bg-warm-white lg:grid-cols-[.9fr_1.1fr]"><section className="flex min-h-screen flex-col px-5 py-7 sm:px-10 lg:px-16"><Link aria-label="Novia home" href="/"><NoviaMark /></Link><div className="my-auto w-full max-w-md py-14"><p className="text-xs font-semibold uppercase tracking-[.22em] text-taupe">{eyebrow}</p><h1 className="mt-5 font-display text-6xl leading-[.86] tracking-[-.045em]">{title}</h1>{children}</div><p className="text-xs text-taupe/70">A calmer way to plan your celebration.</p></section><section className="relative hidden overflow-hidden bg-parchment lg:block"><div className="absolute inset-12 rounded-t-[50%] border border-forest/10 bg-warm-white/20" /><BridePlaceholderAuth /><p className="absolute bottom-12 left-1/2 w-full -translate-x-1/2 text-center font-display text-4xl italic text-taupe">Everything beautiful begins somewhere.</p></section></main>;
}
