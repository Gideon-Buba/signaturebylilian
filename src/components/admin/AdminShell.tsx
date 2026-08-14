import { Link, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";

import skincareLogo from "@/assets/skincare-logo.png";
import { logoutFn } from "@/server-fns/auth";

const adminNav = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/products", label: "Products" },
] as const;

export function AdminShell({
  user,
  title,
  actions,
  children,
}: {
  user: { email: string | null };
  title: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-5 py-4 lg:px-10">
          <div className="flex flex-wrap items-center gap-8">
            <Link to="/admin" className="flex items-center gap-2.5">
              <img src={skincareLogo} alt="" className="h-11 w-auto" />
              <span className="eyebrow text-accent">Admin</span>
            </Link>
            <nav className="flex flex-wrap items-center gap-6">
              {adminNav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  activeOptions={{ exact: item.to === "/admin" }}
                  activeProps={{ className: "text-foreground" }}
                  inactiveProps={{ className: "text-muted-foreground" }}
                  className="text-sm transition-colors hover:text-accent"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-muted-foreground sm:inline">{user.email}</span>
            <button
              type="button"
              onClick={async () => {
                await logoutFn();
                await navigate({ to: "/admin/login" });
              }}
              className="eyebrow border border-border px-4 py-2.5 text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1440px] px-5 py-10 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-serif text-3xl text-foreground">{title}</h1>
          {actions}
        </div>

        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
