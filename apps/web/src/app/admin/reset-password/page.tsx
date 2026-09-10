import { redirect } from "next/navigation";
import { PasswordResetForm } from "@/components/admin/password-reset-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { OWNER_EMAIL } from "@/lib/owner";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Set owner password — Novia" };

export default async function AdminResetPasswordPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const email = typeof data?.claims?.email === "string" ? data.claims.email.toLowerCase() : null;
  if (email !== OWNER_EMAIL) redirect("/admin/login?error=recovery");
  return <AuthShell eyebrow="Owner security" title="Choose a new password."><p className="mt-6 leading-7 text-taupe">Use at least 10 characters. Your recovery session is restricted to the approved NOVIA owner account.</p><PasswordResetForm /></AuthShell>;
}
