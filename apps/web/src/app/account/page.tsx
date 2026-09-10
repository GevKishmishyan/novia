import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AccountMenu } from "@/components/auth/account-menu";
import { NoviaMark } from "@/components/brand/novia-mark";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Profile — Novia" };

export default async function AccountPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) redirect("/login?next=%2Faccount");
  const email = typeof data.claims.email === "string" ? data.claims.email : null;
  const fullName = typeof data.claims.user_metadata === "object" && data.claims.user_metadata && "full_name" in data.claims.user_metadata ? String(data.claims.user_metadata.full_name) : "Novia member";

  return <main className="min-h-screen bg-warm-white"><header className="border-b border-forest/10"><div className="shell flex h-24 items-center justify-between"><Link aria-label="Novia home" href="/"><NoviaMark /></Link><AccountMenu user={{ email, id: data.claims.sub }} /></div></header><section className="shell py-16 md:py-24"><Link className="inline-flex items-center gap-2 text-sm font-semibold" href="/dashboard"><ArrowLeft size={16} /> Dashboard</Link><div className="mt-10 max-w-2xl rounded-[2rem] border border-forest/10 bg-parchment/30 p-7 md:p-10"><p className="text-xs font-semibold uppercase tracking-[.2em] text-taupe">Your profile</p><h1 className="mt-4 font-display text-5xl">{fullName}</h1><dl className="mt-10 grid gap-5"><div><dt className="text-xs font-semibold uppercase tracking-[.16em] text-taupe">Email address</dt><dd className="mt-2 text-lg">{email ?? "Not available"}</dd></div><div><dt className="text-xs font-semibold uppercase tracking-[.16em] text-taupe">Account status</dt><dd className="mt-2 inline-flex rounded-full bg-sage/35 px-3 py-1 text-sm font-semibold">Active</dd></div></dl></div></section></main>;
}
