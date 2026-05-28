"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Icon } from "@/components/ui/Icon";
import { ApiError, login } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/catalog";
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [submit, setSubmit] = useState<{ loading: boolean; error: string | null }>({
    loading: false,
    error: null,
  });

  function validate(): boolean {
    const next: typeof errors = {};
    if (!email) next.email = "Email is required.";
    else if (!/.+@.+\..+/.test(email)) next.email = "Enter a valid email.";
    if (!password) next.password = "Password is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmit({ loading: true, error: null });
    try {
      await login({ username: email, password });
      signIn(email);
      router.replace(next);
    } catch (err) {
      const message =
        err instanceof ApiError && err.status === 401
          ? "Incorrect email or password."
          : "Something went wrong. Try again.";
      setSubmit({ loading: false, error: message });
      return;
    }
    setSubmit({ loading: false, error: null });
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to keep your cart, addresses, and reorder list in one place."
      footer={
        <>
          New here?{" "}
          <Link href="/register" className="font-semibold text-emerald-700 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <Input
          name="email"
          type="email"
          autoComplete="email"
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          leftIcon={<Icon name="user" size={16} />}
        />
        <Input
          name="password"
          type="password"
          autoComplete="current-password"
          label="Password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          leftIcon={<Icon name="shield" size={16} />}
        />

        <div className="flex items-center justify-between text-sm">
          <label className="inline-flex items-center gap-2 text-stone-600">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-stone-300 text-emerald-700 focus:ring-emerald-600"
            />
            Remember me
          </label>
          <Link href="#" className="text-emerald-700 hover:underline">
            Forgot password?
          </Link>
        </div>

        {submit.error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {submit.error}
          </div>
        )}

        <Button type="submit" loading={submit.loading} className="w-full">
          Sign in
        </Button>
      </form>

      <div className="relative my-2 flex items-center gap-3 text-xs uppercase tracking-wide text-stone-400">
        <span className="h-px flex-1 bg-stone-200" />
        or continue with
        <span className="h-px flex-1 bg-stone-200" />
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => {
          // OAuth2 redirect handled server-side per TRD §3 — this is the
          // entrypoint that the spec routes through Google Auth.
          window.location.href = "/api/v1/auth/google";
        }}
      >
        <Icon name="google" size={18} />
        Continue with Google
      </Button>
    </AuthShell>
  );
}
