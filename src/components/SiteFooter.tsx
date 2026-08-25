import { Link, useRouterState } from "@tanstack/react-router";

import skincareLogo from "@/assets/skincare-logo.png";
import oasisLogo from "@/assets/oasis-logo.png";

const columns = [
  {
    title: "Signature by Lilian",
    links: [
      { label: "Skincare", to: "/skincare" as const },
      { label: "Oasis", to: "/oasis" as const },
      { label: "About", to: "/about" as const },
      { label: "Journal", to: "/journal" as const },
      { label: "Contact", to: "/contact" as const },
    ],
  },
  {
    title: "Customer",
    links: [
      { label: "Shop", to: "/skincare" as const },
      { label: "Orders", to: "/contact" as const },
      { label: "Shipping", to: "/contact" as const },
      { label: "Returns", to: "/contact" as const },
      { label: "FAQs", to: "/contact" as const },
    ],
  },
];

const SKINCARE_INSTAGRAM = "https://www.instagram.com/sbl.skincare?igsh=MWExdjYyeHJ2dWpycg==";
const OASIS_INSTAGRAM = "https://www.instagram.com/sbl_oasis?igsh=MTNvMjNpd2F0ZGhlNg==";
const WHATSAPP_LINK = "https://wa.me/2349046004543";

export function SiteFooter() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isOasis = pathname.startsWith("/oasis");
  const logo = isOasis ? oasisLogo : skincareLogo;
  const social = [
    { label: "Instagram", href: isOasis ? OASIS_INSTAGRAM : SKINCARE_INSTAGRAM },
    { label: "WhatsApp", href: WHATSAPP_LINK },
  ];

  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-[1440px] px-5 py-16 lg:px-10 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <img
              src={logo}
              alt={isOasis ? "Signature by Lilian Oasis" : "Signature by Lilian Skincare"}
              loading="lazy"
              className="h-24 w-auto"
            />
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              Premium skincare and restorative wellness experiences, created to help you look, feel,
              and live beautifully.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="eyebrow text-muted-foreground">{col.title}</h3>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-foreground transition-colors hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="eyebrow text-muted-foreground">Connect</h3>
            <ul className="mt-5 space-y-3">
              {social.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-sm text-foreground transition-colors hover:text-accent"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-border pt-7 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Signature by Lilian. All rights reserved.</p>
          <p className="tracking-[0.2em] uppercase">Skincare · Oasis</p>
        </div>
      </div>
    </footer>
  );
}
