"use client";

import { ArrowRight, Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function PasswordRecoveryForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  const send = async () => {
    setState("sending");
    setError("");
    const response = await fetch("/api/v1/admin/password-recovery", { method: "POST" }).catch(() => null);
    if (!response?.ok) {
      const body = await response?.json().catch(() => ({})) as { error?: { message?: string } } | undefined;
      setError(body?.error?.message ?? "Unable to send the recovery email.");
      setState("error");
      return;
    }
    setState("sent");
  };

  if (state === "sent") return <div className="mt-9 rounded-[1.5rem] border border-forest/15 bg-parchment/45 p-7"><Check size={22} /><p className="mt-4 font-display text-3xl">Check your inbox</p><p className="mt-3 leading-7 text-taupe">A private recovery link was sent to the approved owner email. The link returns here so you can choose a new password.</p><Link className="mt-6 inline-flex text-sm font-semibold underline decoration-gold underline-offset-8" href="/admin/login">Return to owner login</Link></div>;

  return <div className="mt-9"><button className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-forest px-6 text-sm font-semibold text-warm-white disabled:opacity-60" disabled={state === "sending"} onClick={send} type="button">{state === "sending" ? <Loader2 className="mr-2 animate-spin" size={17} /> : null}{state === "sending" ? "Sending…" : "Send private recovery link"}{state !== "sending" && <ArrowRight className="ml-2" size={16} />}</button>{error && <p className="mt-4 rounded-xl bg-terracotta/10 px-4 py-3 text-sm text-terracotta" role="alert">{error}</p>}<Link className="mt-6 block text-center text-sm font-semibold underline decoration-gold underline-offset-4" href="/admin/login">Back to owner login</Link></div>;
}
