import { createFileRoute } from "@tanstack/react-router";
import { Clock, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";

import { Reveal } from "@/components/Reveal";

const title = "Contact & Bookings — Signature by Lilian";
const description =
  "Reach Signature by Lilian by phone, email or Instagram, find our location and opening hours, or send us a message.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Contact,
});

const details = [
  { icon: Phone, label: "Phone", value: "+234 703 205 0584", href: "tel:+2347032050584" },
  {
    icon: Instagram,
    label: "Instagram",
    value: "@sbl.skincare",
    href: "https://www.instagram.com/sbl.skincare?igsh=MWExdjYyeHJ2dWpycg==",
  },
  {
    icon: Mail,
    label: "Email",
    value: "DrLilian@signaturebylilian.com",
    href: "mailto:DrLilian@signaturebylilian.com",
  },
  { icon: MapPin, label: "Visit", value: "24 Adeola Odeku Street, Victoria Island, Lagos" },
  { icon: Clock, label: "Hours", value: "Mon–Sat 9:00–18:30 · Sun by appointment" },
];

function Contact() {
  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1440px] px-5 py-16 lg:px-10 lg:py-24">
          <Reveal className="max-w-2xl">
            <p className="eyebrow text-accent">Contact</p>
            <h1 className="mt-6 font-serif text-[2.5rem] leading-[1.08] text-foreground lg:text-6xl">
              We'd love to hear from you
            </h1>
            <p className="mt-6 leading-relaxed text-muted-foreground">
              For orders, product advice or an Oasis appointment — Instagram is the fastest way to
              reach us.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1440px] gap-14 px-5 py-16 lg:grid-cols-[1fr_1.15fr] lg:gap-20 lg:px-10 lg:py-24">
        <Reveal>
          <ul className="divide-y divide-border border-y border-border">
            {details.map((d) => (
              <li key={d.label} className="flex items-start gap-5 py-6">
                <d.icon className="mt-1 size-4 shrink-0 text-accent" strokeWidth={1.5} />
                <div className="min-w-0">
                  <p className="eyebrow text-muted-foreground">{d.label}</p>
                  {d.href ? (
                    <a
                      href={d.href}
                      className="mt-2 block font-serif text-xl text-foreground transition-colors hover:text-accent"
                    >
                      {d.value}
                    </a>
                  ) : (
                    <p className="mt-2 font-serif text-xl text-foreground">{d.value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-2">
            {[
              {
                label: "Instagram",
                href: "https://www.instagram.com/sbl.skincare?igsh=MWExdjYyeHJ2dWpycg==",
              },
              { label: "Facebook", href: "#" },
              { label: "TikTok", href: "#" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="eyebrow border border-border px-5 py-3 text-muted-foreground transition-colors hover:border-accent hover:text-accent"
              >
                {s.label}
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal delay={100}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Message sent", { description: "We usually reply within one day." });
              (e.target as HTMLFormElement).reset();
            }}
            className="grid gap-5 border border-border bg-card p-7 lg:p-10"
          >
            <h2 className="font-serif text-3xl text-foreground">Send a message</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Name" name="name" />
              <Field label="Email" name="email" type="email" />
            </div>
            <Field label="Subject" name="subject" />
            <label className="grid gap-2">
              <span className="eyebrow text-muted-foreground">Message</span>
              <textarea
                required
                name="message"
                rows={5}
                className="border border-input bg-background px-4 py-3.5 text-sm text-foreground outline-none focus:border-accent"
              />
            </label>
            <button
              type="submit"
              className="eyebrow mt-2 bg-plum px-8 py-4 text-primary-foreground transition-colors hover:bg-magenta"
            >
              Send Message
            </button>
          </form>
        </Reveal>
      </section>

      <section className="border-t border-border">
        <iframe
          title="Signature by Lilian location map"
          src="https://www.openstreetmap.org/export/embed.html?bbox=3.406%2C6.420%2C3.446%2C6.446&layer=mapnik"
          loading="lazy"
          className="h-[420px] w-full border-0 grayscale-[35%]"
        />
      </section>
    </>
  );
}

function Field({ label, name, type = "text" }: { label: string; name: string; type?: string }) {
  return (
    <label className="grid gap-2">
      <span className="eyebrow text-muted-foreground">{label}</span>
      <input
        required
        type={type}
        name={name}
        className="border border-input bg-background px-4 py-3.5 text-sm text-foreground outline-none focus:border-accent"
      />
    </label>
  );
}
