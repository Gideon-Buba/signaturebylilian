import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import logo from "@/assets/logo-signature.png";

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

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto grid max-w-[1440px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 lg:grid-cols-[1fr_auto_1fr] lg:px-10">
        <Link to="/" className="flex min-w-0 items-center" aria-label="Signature by Lilian home">
          <img
            src={logo}
            alt="Signature by Lilian"
            width={1024}
            height={640}
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
              className="eyebrow transition-colors hover:text-accent"
            >
              {item.label}
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
