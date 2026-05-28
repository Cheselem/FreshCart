"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Icon } from "@/components/ui/Icon";
import { ApiError, login, register } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{
    email?: string; password?: string; confirm?: string;
  }>({});
  const [submit, setSubmit] = useState<{ loading: boolean; error: string | null }>({
    loading: false, error: null,
  });

  const strength = useMemo(() => scorePassword(password), [password]);

  function validate(): boolean {
    const next: typeof errors = {};
    if (!email) next.email = "Email is required.";
    else if (!/.+@.+\..+/.test(email)) next.email = "Enter a valid email.";
    if (password.length < 8) next.password = "At least 8 characters.";
    if (confirm !== password) next.confirm = "Passwords don't match.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmit({ loading: true, error: null });
    try {
      await register({ email, password });
      // Per UX flow §2.1: register → auto-login → redirect to /catalog
      await login({ username: email, password });
      signIn(email);
      router.replace("/catalog");
    } catch (err) {
      const message =
        err instanceof ApiError && err.status === 409
          ? "An account with that email already exists."
          : err instanceof ApiError && err.status === 422
            ? "That email or password didn't pass validation."
            : "Something went wrong. Try again.";
      setSubmit({ loading: false, error: message });
    }
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Save addresses, reorder favorites, and pick faster delivery slots."
      footer={
        <>
          Already with us?{" "}
          <Link href="/login" className="font-semibold text-emerald-700 hover:underline">
            Sign in
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

        <div>
          <Input
            name="password"
            type="password"
            autoComplete="new-password"
            label="Password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            leftIcon={<Icon name="shield" size={16} />}
          />
          <PasswordStrengthBar score={strength} />
        </div>

        <Input
          name="confirm"
          type="password"
          autoComplete="new-password"
          label="Confirm password"
          placeholder="Re-enter your password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          error={errors.confirm}
          leftIcon={<Icon name="shield" size={16} />}
        />

        <label className="flex items-start gap-3 text-xs text-stone-600">
          <input
            type="checkbox"
            required
            className="mt-0.5 h-4 w-4 rounded border-stone-300 text-emerald-700 focus:ring-emerald-600"
          />
          <span>
            I agree to FreshCart's{" "}
            <Link href="#" className="text-emerald-700 underline">Terms of Service</Link>{" "}
            and{" "}
            <Link href="#" className="text-emerald-700 underline">Privacy Policy</Link>.
          </span>
        </label>

        {submit.error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {submit.error}
          </div>
        )}

        <Button type="submit" loading={submit.loading} className="w-full">
          Create account
        </Button>
      </form>

      <div className="relative my-2 flex items-center gap-3 text-xs uppercase tracking-wide text-stone-400">
        <span className="h-px flex-1 bg-stone-200" />
        or sign up with
        <span className="h-px flex-1 bg-stone-200" />
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => (window.location.href = "/api/v1/auth/google")}
      >
        <Icon name="google" size={18} />
        Continue with Google
      </Button>
    </AuthShell>
  );
}

function scorePassword(pw: string): 0 | 1 | 2 | 3 | 4 {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(score, 4) as 0 | 1 | 2 | 3 | 4;
}

function PasswordStrengthBar({ score }: { score: 0 | 1 | 2 | 3 | 4 }) {
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = [
    "bg-stone-200",
    "bg-red-400",
    "bg-amber-400",
    "bg-emerald-400",
    "bg-emerald-600",
  ];
  return (
    <div className="mt-2 flex items-center gap-3">
      <div className="flex flex-1 gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full ${i < score ? colors[score] : "bg-stone-200"}`}
          />
        ))}
      </div>
      <span className="w-12 text-right text-xs text-stone-500">{labels[score]}</span>
    </div>
  );
}
