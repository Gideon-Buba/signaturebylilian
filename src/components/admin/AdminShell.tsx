import { Link, useNavigate } from "@tanstack/react-router";
import {
  CalendarClock,
  LayoutDashboard,
  Menu,
  Newspaper,
  Package,
  ReceiptText,
  Sparkles,
  X,
} from "lucide-react";
import { type ReactNode, useState } from "react";

import skincareLogo from "@/assets/skincare-logo.png";
import { logoutFn } from "@/server-fns/auth";

const adminNav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/treatments", label: "Spa Menu", icon: Sparkles },
  { to: "/admin/bookings", label: "Bookings", icon: CalendarClock },
  { to: "/admin/orders", label: "Orders", icon: ReceiptText },
  { to: "/admin/journal", label: "Journal", icon: Newspaper },
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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const navLinks = (
    <nav className="flex flex-col gap-1">
      {adminNav.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            activeOptions={{ exact: item.to === "/admin" }}
            activeProps={{ className: "bg-accent/10 text-accent" }}
            inactiveProps={{ className: "text-muted-foreground hover:bg-secondary/60 hover:text-foreground" }}
            onClick={() => setMobileNavOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
          >
            <Icon className="size-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background lg:flex">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-border lg:flex lg:flex-col">
        <Link to="/admin" className="flex items-center gap-2.5 border-b border-border px-6 py-5">
          <img src={skincareLogo} alt="" className="h-9 w-auto" />
          <span className="eyebrow text-accent">Admin</span>
        </Link>
        <div className="flex-1 overflow-y-auto py-6">{navLinks}</div>
        <div className="border-t border-border p-4">
          <p className="truncate px-2 text-xs text-muted-foreground">{user.email}</p>
          <button
            type="button"
            onClick={async () => {
              await logoutFn();
              await navigate({ to: "/admin/login" });
            }}
            className="eyebrow mt-3 w-full border border-border px-4 py-2.5 text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-background/95 px-5 py-4 backdrop-blur-xl lg:hidden">
        <Link to="/admin" className="flex items-center gap-2.5">
          <img src={skincareLogo} alt="" className="h-9 w-auto" />
          <span className="eyebrow text-accent">Admin</span>
        </Link>
        <button
          type="button"
          aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileNavOpen((o) => !o)}
          className="border border-border p-2 text-foreground"
        >
          {mobileNavOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </header>

      {mobileNavOpen && (
        <div className="border-b border-border bg-background px-2 py-4 lg:hidden">
          {navLinks}
          <div className="mt-4 border-t border-border px-4 pt-4">
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            <button
              type="button"
              onClick={async () => {
                await logoutFn();
                await navigate({ to: "/admin/login" });
              }}
              className="eyebrow mt-3 w-full border border-border px-4 py-2.5 text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              Sign out
            </button>
          </div>
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="mx-auto max-w-[1440px] px-5 py-10 lg:px-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="font-serif text-3xl text-foreground">{title}</h1>
            {actions}
          </div>

          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
