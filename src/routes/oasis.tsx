import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Sparkles,
  HeartHandshake,
  Flower2,
  Footprints,
  Hand,
  Dumbbell,
  Droplet,
  Zap,
  Feather,
  Syringe,
  Smile,
  Lock,
  Eye,
  Star,
  Stethoscope,
  MessageCircle,
  GraduationCap,
  Gem,
  type LucideIcon,
} from "lucide-react";

import heroOasis from "@/assets/hero-oasis.jpeg";
import oasisFacial from "@/assets/oasis-facial.jpeg";
import oasisMassage from "@/assets/oasis-massage.jpeg";
import { Reveal } from "@/components/Reveal";
import { createBookingFn } from "@/server-fns/bookings";
import { listTreatmentsFn, type Treatment } from "@/server-fns/treatments";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "Facial Treatments": Sparkles,
  Massages: HeartHandshake,
  "Body Treatment": Flower2,
  Pedicure: Footprints,
  Manicure: Hand,
  "Body Sculpting": Dumbbell,
  "IV Therapy": Droplet,
  "Laser Treatment": Zap,
  Waxing: Feather,
  "PRP Treatments": Syringe,
  "Dental Care": Smile,
  "Private Care": Lock,
  Eyebrows: Eye,
  "Eyelash Extensions": Star,
  "Skin Consultation": Stethoscope,
  Counselling: MessageCircle,
  "Trainings & Workshops": GraduationCap,
};

const title = "Oasis — Luxury Spa & Wellness | Signature by Lilian";
const description =
  "Signature by Lilian Oasis is a sanctuary for relaxation and rejuvenation. Explore treatments, view pricing and book your appointment.";

// Preferred display order — falls back to appending any category not listed
// here (e.g. a brand-new one added later via the admin) at the end.
const CATEGORY_ORDER = [
  "Facial Treatments",
  "Massages",
  "Body Treatment",
  "Pedicure",
  "Manicure",
  "Body Sculpting",
  "IV Therapy",
  "Laser Treatment",
  "Waxing",
  "PRP Treatments",
  "Dental Care",
  "Private Care",
  "Eyebrows",
  "Eyelash Extensions",
  "Skin Consultation",
  "Counselling",
  "Trainings & Workshops",
];

function groupByCategory(treatments: Treatment[]) {
  const map = new Map<string, Treatment[]>();
  for (const t of treatments) {
    if (!map.has(t.category)) map.set(t.category, []);
    map.get(t.category)!.push(t);
  }
  for (const list of map.values()) list.sort((a, b) => a.sortOrder - b.sortOrder);

  const orderedKeys = [
    ...CATEGORY_ORDER.filter((c) => map.has(c)),
    ...Array.from(map.keys()).filter((c) => !CATEGORY_ORDER.includes(c)),
  ];
  return orderedKeys.map((category) => [category, map.get(category)!] as const);
}

function formatPrice(price: number | null, startingFrom = false) {
  if (price == null) return "Contact for pricing";
  return startingFrom ? `From ₦${price.toLocaleString()}` : `₦${price.toLocaleString()}`;
}

export const Route = createFileRoute("/oasis")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  loader: async () => {
    const allTreatments = await listTreatmentsFn();
    const treatments = allTreatments.filter((t) => !t.isArchived && t.isActive);
    return { treatments };
  },
  component: Oasis,
});

const reasons = [
  {
    title: "Private by design",
    copy: "Only three suites, so the space is never crowded and never rushed.",
  },
  {
    title: "Trained hands",
    copy: "Therapists with a minimum of eight years in clinical and spa practice.",
  },
  {
    title: "Considered products",
    copy: "Our own Signature formulations, used in every treatment.",
  },
];

const testimonials = [
  {
    name: "Ifeoma N.",
    text: "I have never felt so looked after. I booked the Escape and walked out feeling like a different person.",
  },
  {
    name: "Zainab M.",
    text: "The room, the light, the quiet. It is the only place in the city I truly switch off.",
  },
];

function Oasis() {
  const { treatments } = Route.useLoaderData();
  const featured = treatments.filter((t) => t.isFeatured);
  const grouped = useMemo(() => groupByCategory(treatments), [treatments]);
  const [activeCategory, setActiveCategory] = useState(grouped[0]?.[0] ?? "");
  const activeItems = grouped.find(([category]) => category === activeCategory)?.[1] ?? [];

  return (
    <div className="theme-oasis bg-background">
      <section className="relative border-b border-border">
        <img
          src={heroOasis}
          alt="Candlelit treatment suite at Signature by Lilian Oasis"
          width={1280}
          height={1600}
          className="h-[70vh] min-h-[460px] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.18_0.01_60/0.82)] via-[oklch(0.18_0.01_60/0.35)] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1440px] px-5 pb-14 lg:px-10 lg:pb-20">
          <p className="eyebrow text-champagne">Signature by Lilian Oasis</p>
          <h1 className="mt-5 max-w-3xl font-serif text-[2.5rem] leading-[1.08] text-cream lg:text-6xl">
            A sanctuary for relaxation, beauty and rejuvenation
          </h1>
          <a
            href="#booking"
            className="eyebrow mt-9 inline-block bg-champagne px-8 py-4 text-accent-foreground transition-opacity hover:opacity-90"
          >
            Book an Appointment
          </a>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1440px] items-center gap-12 px-5 py-20 lg:grid-cols-2 lg:gap-20 lg:px-10 lg:py-28">
        <Reveal>
          <p className="eyebrow text-gold">The Oasis Experience</p>
          <h2 className="mt-5 font-serif text-4xl leading-tight text-foreground lg:text-5xl">
            Time, warmth and complete serenity
          </h2>
          <p className="mt-6 leading-relaxed text-muted-foreground">
            From the moment the door closes behind you, the pace changes. Tea in the lounge, warm
            towels, low light and a therapist who has read your notes before you arrive.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Oasis exists for the part of self-care that cannot be bottled — being cared for,
            properly, by someone else.
          </p>
        </Reveal>
        <Reveal delay={100}>
          <img
            src={oasisFacial}
            alt="Facial massage during a treatment at Oasis"
            loading="lazy"
            width={1200}
            height={1008}
            className="aspect-[5/4] w-full object-cover"
          />
        </Reveal>
      </section>

      {featured.length > 0 && (
        <section className="border-y border-border bg-secondary/40">
          <div className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10 lg:py-28">
            <Reveal className="max-w-xl">
              <p className="eyebrow text-gold">Signature Treatments</p>
              <h2 className="mt-4 font-serif text-4xl text-foreground lg:text-5xl">
                A few of our favourites
              </h2>
            </Reveal>

            <div className="mt-14 grid gap-px bg-border lg:grid-cols-2">
              {featured.map((t, i) => (
                <Reveal key={t.id} delay={i * 80} className="bg-background p-8 lg:p-12">
                  <div className="flex flex-wrap items-baseline justify-between gap-4">
                    <h3 className="font-serif text-3xl text-foreground">{t.name}</h3>
                    <span className="font-serif text-2xl text-accent">
                      {formatPrice(t.price, t.category === "IV Therapy")}
                    </span>
                  </div>
                  {t.duration && <p className="eyebrow mt-3 text-muted-foreground">{t.duration}</p>}
                  {t.description && (
                    <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">
                      {t.description}
                    </p>
                  )}
                  {t.benefits.length > 0 && (
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {t.benefits.map((b) => (
                        <li
                          key={b}
                          className="border border-gold/40 px-3 py-1.5 text-xs tracking-[0.12em] text-foreground uppercase"
                        >
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                  <a
                    href="#booking"
                    className="eyebrow mt-8 inline-block border-b border-gold pb-2 text-foreground transition-colors hover:text-accent"
                  >
                    Book Now
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10 lg:py-24">
        <Reveal className="max-w-xl">
          <p className="eyebrow text-gold">Full Price List</p>
          <h2 className="mt-4 font-serif text-4xl text-foreground lg:text-5xl">Our spa menu</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Choose a category to see treatments and pricing.
          </p>
        </Reveal>

        <div className="mt-12 min-w-0 lg:grid lg:grid-cols-[240px_1fr] lg:items-start lg:gap-12">
          <nav aria-label="Treatment categories">
            <Reveal className="scrollbar-none -mx-5 flex gap-2 overflow-x-auto px-5 pb-4 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0">
              {grouped.map(([category, items]) => {
                const Icon = CATEGORY_ICONS[category] ?? Gem;
                const active = category === activeCategory;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    data-active={active}
                    className="eyebrow group flex shrink-0 items-center gap-2.5 border-b-2 border-transparent px-1 py-3 text-left text-muted-foreground transition-colors hover:text-foreground data-[active=true]:border-gold data-[active=true]:text-foreground lg:w-full lg:border-b-0 lg:border-l-2 lg:px-4"
                  >
                    <Icon className="size-4 shrink-0 text-gold/80" strokeWidth={1.5} />
                    <span className="whitespace-nowrap lg:whitespace-normal">{category}</span>
                    <span className="ml-auto text-[10px] text-muted-foreground/60">
                      {items.length}
                    </span>
                  </button>
                );
              })}
            </Reveal>
          </nav>

          <Reveal delay={100} className="mt-10 min-w-0 border border-border/70 p-8 lg:mt-0 lg:p-12">
            <div className="flex items-baseline justify-between gap-4 border-b border-border pb-5">
              <h3 className="font-serif text-2xl text-foreground lg:text-3xl">{activeCategory}</h3>
              <span className="eyebrow shrink-0 text-muted-foreground">
                {activeItems.length} treatment{activeItems.length === 1 ? "" : "s"}
              </span>
            </div>
            <div className="grid gap-x-12 sm:grid-cols-2">
              {activeItems.map((t) => (
                <div
                  key={t.id}
                  className="flex flex-wrap items-baseline gap-x-2 border-b border-border/40 py-4"
                >
                  <span className="min-w-0 text-foreground">{t.name}</span>
                  {t.duration && (
                    <span className="shrink-0 text-xs text-muted-foreground">({t.duration})</span>
                  )}
                  <span
                    aria-hidden="true"
                    className="mx-1 h-px min-w-4 flex-1 translate-y-[-4px] border-b border-dotted border-border"
                  />
                  <span className="shrink-0 font-serif text-lg text-accent">
                    {formatPrice(t.price, t.category === "IV Therapy")}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10 lg:py-24">
        <Reveal className="max-w-xl">
          <p className="eyebrow text-gold">Why Choose Oasis</p>
          <h2 className="mt-4 font-serif text-4xl text-foreground lg:text-5xl">
            Small, private, considered
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-10 lg:grid-cols-3">
          {reasons.map((r, i) => (
            <Reveal key={r.title} delay={i * 80}>
              <div className="hairline" />
              <h3 className="mt-6 font-serif text-2xl text-foreground">{r.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{r.copy}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-border">
        <div className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10 lg:py-24">
          <Reveal>
            <p className="eyebrow text-gold">Treatment Gallery</p>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[oasisMassage, oasisFacial, heroOasis].map((src, i) => (
              <Reveal key={i} delay={i * 90}>
                <img
                  src={src}
                  alt="Inside Signature by Lilian Oasis"
                  loading="lazy"
                  width={1200}
                  height={1008}
                  className="aspect-[3/4] w-full object-cover transition-transform duration-[1200ms] hover:scale-[1.02]"
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 90}>
              <p className="font-serif text-2xl leading-snug text-foreground italic lg:text-3xl">
                “{t.text}”
              </p>
              <p className="eyebrow mt-6 text-muted-foreground">{t.name}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <BookingSection treatments={treatments} />
    </div>
  );
}

function BookingSection({ treatments }: { treatments: Treatment[] }) {
  const grouped = useMemo(() => groupByCategory(treatments), [treatments]);
  const [treatment, setTreatment] = useState(treatments[0]?.id ?? "");

  const bookingMutation = useMutation({
    mutationFn: createBookingFn,
    onSuccess: () => {
      toast.success("Booking request received", {
        description: "We'll confirm your appointment by phone shortly.",
      });
    },
    onError: () => {
      toast.error("Couldn't send your request", {
        description: "Please try again, or call us directly.",
      });
    },
  });

  return (
    <section id="booking" className="border-t border-border bg-cream">
      <div className="mx-auto grid max-w-[1440px] gap-14 px-5 py-20 lg:grid-cols-[1fr_1.1fr] lg:gap-20 lg:px-10 lg:py-28">
        <Reveal>
          <p className="eyebrow text-gold">Appointments</p>
          <h2 className="mt-5 font-serif text-4xl leading-tight text-foreground lg:text-5xl">
            Reserve your time at Oasis
          </h2>
          <p className="mt-6 max-w-md leading-relaxed text-muted-foreground">
            Tell us what you'd like and when suits you. We confirm every booking personally within a
            few hours.
          </p>
          <dl className="mt-10 space-y-5 text-sm">
            <div>
              <dt className="eyebrow text-muted-foreground">Call</dt>
              <dd className="mt-2 font-serif text-xl text-foreground">
                <a href="tel:+2349130123123" className="transition-colors hover:text-accent">
                  09130123123
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow text-muted-foreground">Opening hours</dt>
              <dd className="mt-2 text-foreground">
                Mon–Sat, 9:00 am – 6:00 pm · Sun by appointment
              </dd>
            </div>
          </dl>
        </Reveal>

        <Reveal delay={100} className="min-w-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const formData = new FormData(form);
              const selected = treatments.find((t) => t.id === treatment);

              bookingMutation.mutate(
                {
                  data: {
                    customerName: String(formData.get("name") ?? ""),
                    phone: String(formData.get("phone") ?? ""),
                    email: String(formData.get("email") ?? ""),
                    treatmentId: selected?.id,
                    treatmentName: selected?.name ?? "Not specified",
                    preferredDate: String(formData.get("date") ?? ""),
                    preferredTime: String(formData.get("time") ?? ""),
                    notes: String(formData.get("notes") ?? ""),
                  },
                },
                {
                  onSuccess: () => {
                    form.reset();
                    setTreatment(treatments[0]?.id ?? "");
                  },
                },
              );
            }}
            className="grid min-w-0 gap-5 border border-border bg-background p-7 lg:p-10"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name" name="name" />
              <Field label="Phone" name="phone" type="tel" />
            </div>
            <Field label="Email" name="email" type="email" />
            <label className="grid min-w-0 gap-2">
              <span className="eyebrow text-muted-foreground">Treatment</span>
              <select
                value={treatment}
                onChange={(e) => setTreatment(e.target.value)}
                className="w-full min-w-0 border border-input bg-background px-4 py-3.5 text-sm text-foreground outline-none focus:border-accent"
              >
                {grouped.map(([category, items]) => (
                  <optgroup key={category} label={category}>
                    {items.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                        {t.duration ? ` — ${t.duration}` : ""} ·{" "}
                        {formatPrice(t.price, category === "IV Therapy")}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </label>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Preferred date" name="date" type="date" />
              <Field label="Preferred time" name="time" type="time" />
            </div>
            <label className="grid gap-2">
              <span className="eyebrow text-muted-foreground">Notes (optional)</span>
              <textarea
                name="notes"
                rows={3}
                className="border border-input bg-background px-4 py-3.5 text-sm text-foreground outline-none focus:border-accent"
              />
            </label>
            <button
              type="submit"
              disabled={bookingMutation.isPending}
              className="eyebrow mt-2 bg-foreground px-8 py-4 text-background transition-opacity hover:opacity-85 disabled:opacity-60"
            >
              {bookingMutation.isPending ? "Sending…" : "Request Appointment"}
            </button>
          </form>
        </Reveal>
      </div>
    </section>
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
