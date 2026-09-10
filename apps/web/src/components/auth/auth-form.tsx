"use client";

import { useState } from "react";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { safeRedirectPath } from "@/lib/safe-redirect";

type AuthFields = { email: string; fullName: string; password: string };
type ApiError = { error?: { fields?: Partial<Record<keyof AuthFields, string[]>>; message?: string } };

export function AuthForm({ mode, nextPath, variant = "customer" }: { mode: "login" | "signup"; nextPath?: string; variant?: "admin" | "customer" }) {
  const isSignup = mode === "signup";
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const destination = safeRedirectPath(nextPath);
  const authAlternative = `${isSignup ? "/login" : "/signup"}?next=${encodeURIComponent(destination)}`;
  const { formState: { errors, isSubmitting }, handleSubmit, register, setError } = useForm<AuthFields>({ defaultValues: { email: "", fullName: "", password: "" } });

  const submit = handleSubmit(async (values) => {
    setServerError(null);
    const endpoint = variant === "admin" ? "/api/v1/admin/login" : `/api/v1/auth/${mode}?next=${encodeURIComponent(destination)}`;
    const response = await fetch(endpoint, {
      body: JSON.stringify(isSignup ? values : { email: values.email, password: values.password }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
    const result = await response.json().catch(() => ({})) as ApiError & { needsEmailConfirmation?: boolean };
    if (!response.ok) {
      Object.entries(result.error?.fields ?? {}).forEach(([field, messages]) => {
        if (messages?.[0]) setError(field as keyof AuthFields, { message: messages[0] });
      });
      setServerError(result.error?.message ?? "Something went wrong. Please try again.");
      return;
    }
    if (result.needsEmailConfirmation) {
      setConfirmationSent(true);
      return;
    }
    router.push(destination);
    router.refresh();
  });

  if (confirmationSent) {
    return <div className="rounded-[1.5rem] border border-forest/15 bg-parchment/45 p-7"><p className="font-display text-3xl">Check your inbox</p><p className="mt-3 leading-7 text-taupe">We sent a confirmation link to your email. Open it to finish creating your Novia account.</p><Link className="mt-6 inline-flex text-sm font-semibold underline decoration-gold underline-offset-8" href="/login">Return to login</Link></div>;
  }

  return (
    <form className="mt-9 grid gap-5" noValidate onSubmit={submit}>
      {isSignup && <Field error={errors.fullName?.message} label="Your name"><input autoComplete="name" className="auth-input" {...register("fullName", { maxLength: { message: "Name is too long", value: 80 }, minLength: { message: "Enter your name", value: 2 }, required: "Enter your name" })} /></Field>}
      <Field error={errors.email?.message} label="Email address"><input autoComplete="email" className="auth-input" inputMode="email" type="email" {...register("email", { pattern: { message: "Enter a valid email address", value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }, required: "Enter your email address" })} /></Field>
      <Field error={errors.password?.message} label="Password">
        <div className="relative"><input autoComplete={isSignup ? "new-password" : "current-password"} className="auth-input pr-12" type={showPassword ? "text" : "password"} {...register("password", { minLength: { message: "Password must be at least 8 characters", value: 8 }, required: "Enter your password" })} /><button aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-1 top-1 grid size-10 place-items-center text-taupe" onClick={() => setShowPassword((visible) => !visible)} type="button">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
      </Field>
      {serverError && <p className="rounded-xl bg-terracotta/10 px-4 py-3 text-sm text-terracotta" role="alert">{serverError}</p>}
      <button className="mt-1 inline-flex min-h-12 items-center justify-center rounded-full bg-forest px-6 text-sm font-semibold text-warm-white disabled:cursor-not-allowed disabled:opacity-60" disabled={isSubmitting} type="submit">{isSubmitting ? "Please wait…" : isSignup ? "Create account" : "Log in"}{!isSubmitting && <ArrowRight className="ml-2" size={16} />}</button>
      {variant === "customer" && <p className="text-center text-sm text-taupe">{isSignup ? "Already have an account?" : "New to Novia?"} <Link className="font-semibold text-forest underline decoration-gold underline-offset-4" href={authAlternative}>{isSignup ? "Log in" : "Create an account"}</Link></p>}
    </form>
  );
}

function Field({ children, error, label }: { children: React.ReactNode; error?: string; label: string }) {
  return <label className="grid gap-2 text-sm font-semibold text-forest">{label}{children}{error && <span className="text-xs font-normal text-terracotta">{error}</span>}</label>;
}
