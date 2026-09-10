import { PasswordRecoveryForm } from "@/components/admin/password-recovery-form";
import { AuthShell } from "@/components/auth/auth-shell";

export const metadata = { title: "Recover owner access — Novia" };

export default function AdminForgotPasswordPage() {
  return <AuthShell eyebrow="Private owner recovery" title="Recover your owner access."><p className="mt-6 leading-7 text-taupe">NOVIA will send a recovery link only to the approved owner account. There is no public admin registration.</p><PasswordRecoveryForm /></AuthShell>;
}
