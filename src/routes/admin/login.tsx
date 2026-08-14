import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { loginFn } from "@/server-fns/auth";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [{ title: "Admin Login — Signature by Lilian" }],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-16">
      <p className="eyebrow text-accent">Admin</p>
      <h1 className="mt-4 font-serif text-3xl text-foreground">Sign in</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Manage products, the spa menu and the journal.
      </p>

      <form
        className="mt-8 grid gap-5"
        onSubmit={async (e) => {
          e.preventDefault();
          setError(null);
          setLoading(true);

          const form = new FormData(e.currentTarget);
          const email = String(form.get("email") ?? "");
          const password = String(form.get("password") ?? "");

          const result = await loginFn({ data: { email, password } });

          if (!result.success) {
            setError(result.message);
            setLoading(false);
            return;
          }

          await navigate({ to: "/admin" });
        }}
      >
        <label className="grid gap-2">
          <span className="eyebrow text-muted-foreground">Email</span>
          <input
            required
            type="email"
            name="email"
            autoComplete="username"
            className="border border-input bg-background px-4 py-3.5 text-sm text-foreground outline-none focus:border-accent"
          />
        </label>
        <label className="grid gap-2">
          <span className="eyebrow text-muted-foreground">Password</span>
          <div className="relative">
            <input
              required
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="current-password"
              className="w-full border border-input bg-background px-4 py-3.5 pr-12 text-sm text-foreground outline-none focus:border-accent"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground transition-colors hover:text-foreground"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </label>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="eyebrow mt-2 bg-plum px-8 py-4 text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
