import { redirect } from "next/navigation";
import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { safeRedirectPath } from "@/lib/safe-redirect";

export const dynamic = "force-dynamic";
export const metadata = { title: "Owner login — Novia" };

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  const destination = safeRedirectPath(next, "/admin");
  if (await getCurrentAdmin()) redirect(destination);

  return <AuthShell eyebrow="Owner workspace" title="Manage the Novia collection."><p className="mt-6 leading-7 text-taupe">Sign in with your approved owner account to create and publish invitation templates.</p><AuthForm mode="login" nextPath={destination} variant="admin" /><Link className="mt-5 block text-center text-sm font-semibold underline decoration-gold underline-offset-4" href="/admin/forgot-password">Forgot your owner password?</Link></AuthShell>;
}
