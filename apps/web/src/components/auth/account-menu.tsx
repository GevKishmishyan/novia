"use client";

import { ChevronDown, LayoutDashboard, LayoutTemplate, LogOut, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export type AccountUser = { email: string | null; id: string; role?: "owner" | "user" };

export function AccountMenu({ user }: { user: AccountUser }) {
  const pathname = usePathname();
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);
  const initial = user.email?.charAt(0).toUpperCase() ?? "N";
  const isOwner = user.role === "owner" || pathname.startsWith("/admin");

  const signOut = async () => {
    setSigningOut(true);
    setLogoutError(null);
    try {
      const response = await fetch("/api/v1/auth/logout", { cache: "no-store", method: "POST" });
      if (!response.ok) {
        const body = await response.json().catch(() => ({})) as { error?: { message?: string } };
        setLogoutError(body.error?.message ?? "Unable to log out. Please try again.");
        return;
      }
      window.location.replace("/");
    } catch {
      setLogoutError("Unable to reach the server. Please try again.");
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <details className="group relative">
      <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-full border border-forest/20 bg-warm-white/70 px-2 pr-4 text-sm font-semibold [&::-webkit-details-marker]:hidden"><span className="grid size-8 place-items-center rounded-full bg-forest text-xs text-warm-white">{initial}</span><span className="hidden max-w-36 truncate md:block">{user.email ?? "My account"}</span><ChevronDown className="transition-transform group-open:rotate-180" size={14} /></summary>
      <div className="absolute right-0 top-[calc(100%+.6rem)] z-30 w-56 overflow-hidden rounded-2xl border border-forest/10 bg-warm-white p-2 shadow-[0_14px_40px_rgba(23,53,37,.16)]">
        {isOwner ? <><Link className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm hover:bg-parchment/60" href="/admin"><LayoutDashboard size={17} /> Owner dashboard</Link><Link className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm hover:bg-parchment/60" href="/admin/templates"><LayoutTemplate size={17} /> Invitation templates</Link></> : <><Link className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm hover:bg-parchment/60" href="/dashboard"><LayoutDashboard size={17} /> Dashboard</Link><Link className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm hover:bg-parchment/60" href="/dashboard#my-templates"><LayoutDashboard size={17} /> My templates</Link><Link className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm hover:bg-parchment/60" href="/account"><UserRound size={17} /> Profile</Link></>}
        <div className="my-1 border-t border-forest/10" />
        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-terracotta hover:bg-terracotta/5 disabled:opacity-60" disabled={signingOut} onClick={signOut} type="button"><LogOut size={17} /> {signingOut ? "Signing out…" : "Sign out"}</button>
        {logoutError && <p className="px-3 pb-2 text-xs leading-5 text-terracotta" role="alert">{logoutError}</p>}
      </div>
    </details>
  );
}
