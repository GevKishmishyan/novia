"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { AccountMenu, type AccountUser } from "@/components/auth/account-menu";
import { NoviaMark } from "@/components/brand/novia-mark";
import { ButtonLink } from "@/components/ui/button";

const links = [
  { label: "Features", href: "#features" },
  { label: "Invitations", href: "/invitations" },
  { label: "How it works", href: "#how-it-works" },
  { label: "About", href: "#about" },
];

export function Header() {
  const [user, setUser] = useState<AccountUser | null>(null);

  useEffect(() => {
    let active = true;
    void fetch("/api/v1/auth/session")
      .then((response) => response.json())
      .then((result: { user?: AccountUser | null }) => { if (active) setUser(result.user ?? null); })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);

  return (
    <header className="absolute inset-x-0 top-0 z-10">
      <div className="shell flex h-24 items-center justify-between">
        <Link aria-label="Novia home" href="/"><NoviaMark /></Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-9 lg:flex">
          {links.map((link) => <Link className="text-base text-taupe transition-colors hover:text-forest" href={link.href} key={link.label}>{link.label}</Link>)}
        </nav>
        <div className="hidden items-center gap-3 sm:flex">
          {user ? <AccountMenu user={user} /> : <><ButtonLink href="/login" variant="outline">Log in</ButtonLink><ButtonLink href="/invitations">Start planning</ButtonLink></>}
        </div>
        <button aria-label="Open navigation" className="grid size-11 place-items-center rounded-full border border-forest/20 sm:hidden" type="button"><Menu size={20} /></button>
      </div>
    </header>
  );
}
