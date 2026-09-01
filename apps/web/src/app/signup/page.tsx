import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";

export const metadata = { title: "Create your account — Novia" };

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return <AuthShell eyebrow="Your beautiful beginning" title="Create your Novia account."><p className="mt-6 leading-7 text-taupe">Begin with your invitation, then bring every guest and detail together.</p><AuthForm mode="signup" nextPath={next} /></AuthShell>;
}
