import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import skincareLogo from "@/assets/skincare-logo.png";
import oasisLogo from "@/assets/oasis-logo.png";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Home" },
  { to: "/skincare", label: "Skincare" },
  { to: "/oasis", label: "Oasis" },
  { to: "/about", label: "About" },
  { to: "/journal", label: "Journal" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isOasis = pathname.startsWith("/oasis");
  const logo = isOasis ? oasisLogo : skincareLogo;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl",
        isOasis && "theme-oasis",
      )}
    >
      <div className="mx-auto grid max-w-[1440px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 lg:grid-cols-[1fr_auto_1fr] lg:px-10">
        <Link to="/" className="flex min-w-0 items-center" aria-label="Signature by Lilian home">
          <img
            src={logo}
            alt={isOasis ? "Signature by Lilian Oasis" : "Signature by Lilian Skincare"}
            width={1536}
            height={1024}
            className="h-11 w-auto shrink-0 lg:h-14"
          />
        </Link>

        <nav className="hidden items-center justify-center gap-8 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "text-foreground" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              className="group eyebrow relative pb-1 transition-colors hover:text-accent"
            >
              {item.label}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-accent transition-transform duration-300 ease-out group-hover:scale-x-100 group-data-[status=active]:scale-x-100"
              />
            </Link>
          ))}
        </nav>

        <div className="hidden items-center justify-end gap-3 lg:flex">
          <Link
            to="/skincare"
            className="eyebrow bg-plum px-5 py-3 text-primary-foreground transition-colors hover:bg-magenta"
          >
            Shop Skincare
          </Link>
          <Link
            to="/oasis"
            className="eyebrow border border-gold/70 px-5 py-3 text-foreground transition-colors hover:bg-champagne/40"
          >
            Book Appointment
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          className="justify-self-end p-2 text-foreground lg:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background px-5 pb-6 lg:hidden">
          <nav className="flex flex-col">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="border-b border-border/60 py-4 font-serif text-2xl text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              to="/skincare"
              onClick={() => setOpen(false)}
              className="eyebrow bg-plum px-5 py-4 text-center text-primary-foreground"
            >
              Shop Skincare
            </Link>
            <Link
              to="/oasis"
              onClick={() => setOpen(false)}
              className="eyebrow border border-gold/70 px-5 py-4 text-center text-foreground"
            >
              Book Appointment
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
