"use client";

import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

type Fields = { password: string; passwordConfirmation: string };

export function PasswordResetForm() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [serverError, setServerError] = useState("");
  const { formState: { errors, isSubmitting }, handleSubmit, register, setError } = useForm<Fields>();

  const submit = handleSubmit(async (values) => {
    setServerError("");
    const response = await fetch("/api/v1/admin/password", { body: JSON.stringify(values), headers: { "Content-Type": "application/json" }, method: "POST" });
    const body = await response.json().catch(() => ({})) as { error?: { fields?: Partial<Record<keyof Fields, string[]>>; message?: string } };
    if (!response.ok) {
      Object.entries(body.error?.fields ?? {}).forEach(([field, messages]) => { if (messages?.[0]) setError(field as keyof Fields, { message: messages[0] }); });
      setServerError(body.error?.message ?? "Unable to update the password.");
      return;
    }
    router.replace("/admin");
    router.refresh();
  });

  return <form className="mt-9 grid gap-5" noValidate onSubmit={submit}><PasswordField error={errors.password?.message} label="New password"><div className="relative"><input autoComplete="new-password" className="auth-input pr-12" type={show ? "text" : "password"} {...register("password", { maxLength: { message: "Password is too long", value: 128 }, minLength: { message: "Password must be at least 10 characters", value: 10 }, required: "Enter a new password" })} /><button aria-label={show ? "Hide password" : "Show password"} className="absolute right-1 top-1 grid size-10 place-items-center text-taupe" onClick={() => setShow((value) => !value)} type="button">{show ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></PasswordField><PasswordField error={errors.passwordConfirmation?.message} label="Confirm new password"><input autoComplete="new-password" className="auth-input" type={show ? "text" : "password"} {...register("passwordConfirmation", { required: "Confirm your new password", validate: (value, fields) => value === fields.password || "Passwords do not match" })} /></PasswordField>{serverError && <p className="rounded-xl bg-terracotta/10 px-4 py-3 text-sm text-terracotta" role="alert">{serverError}</p>}<button className="inline-flex min-h-12 items-center justify-center rounded-full bg-forest px-6 text-sm font-semibold text-warm-white disabled:opacity-60" disabled={isSubmitting} type="submit">{isSubmitting ? "Updating…" : "Set owner password"}{!isSubmitting && <ArrowRight className="ml-2" size={16} />}</button></form>;
}

function PasswordField({ children, error, label }: { children: React.ReactNode; error?: string; label: string }) {
  return <label className="grid gap-2 text-sm font-semibold">{label}{children}{error && <span className="text-xs font-normal text-terracotta">{error}</span>}</label>;
}
