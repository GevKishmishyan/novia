import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";

export const metadata = { title: "Log in — Novia" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return <AuthShell eyebrow="Welcome back" title="Continue planning beautifully."><p className="mt-6 leading-7 text-taupe">Your celebration, guest list, and plans are waiting for you.</p><AuthForm mode="login" nextPath={next} /></AuthShell>;
}
