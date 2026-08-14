import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import heroSkincare from "@/assets/skincare-products-hero.jpeg";
import oasisFacial from "@/assets/oasis-facial.jpeg";
import oasisMassage from "@/assets/oasis-massage.jpeg";
import glowSerum from "@/assets/product-glow-serum.jpeg";
import bodyButter from "@/assets/product-body-butter.jpeg";
import bodyOil from "@/assets/product-body-oil.jpeg";
import { Reveal } from "@/components/Reveal";

const title = "Journal — Beauty & Wellness Notes | Signature by Lilian";
const description =
  "Skincare routines, ingredient education, wellness rituals and self-care notes from the Signature by Lilian team.";

export const Route = createFileRoute("/journal")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Journal,
});

type Category = "All" | "Skincare" | "Wellness";

const posts: {
  title: string;
  category: Exclude<Category, "All">;
  excerpt: string;
  read: string;
  date: string;
  image: string;
}[] = [
  {
    title: "How to build a routine your skin will keep",
    category: "Skincare",
    excerpt:
      "Four steps, in order, and the one habit that undoes all of them. A practical guide to a routine you can actually maintain.",
    read: "6 min",
    date: "May 2026",
    image: heroSkincare,
  },
  {
    title: "Niacinamide, honestly: what it does and doesn't do",
    category: "Skincare",
    excerpt:
      "It is in almost everything now. Here is what the research supports, and what percentage your skin actually needs.",
    read: "5 min",
    date: "April 2026",
    image: glowSerum,
  },
  {
    title: "The evening wind-down we recommend to every client",
    category: "Wellness",
    excerpt:
      "Thirty minutes, no screens, warm water and a scalp massage. Small ritual, unreasonably large effect on sleep.",
    read: "4 min",
    date: "April 2026",
    image: oasisMassage,
  },
  {
    title: "What actually happens during a Signature Facial",
    category: "Wellness",
    excerpt: "A step-by-step walk through the ritual, from the first cleanse to the final massage.",
    read: "7 min",
    date: "March 2026",
    image: oasisFacial,
  },
  {
    title: "Facial oils: who they're for, and when to use them",
    category: "Skincare",
    excerpt:
      "Oily skin can use oil. The trick is what you layer it over, and how much you actually need.",
    read: "5 min",
    date: "March 2026",
    image: bodyOil,
  },
  {
    title: "Self-care is a schedule, not a mood",
    category: "Wellness",
    excerpt:
      "Why the people who feel best are the ones who book it in advance and treat it like any other appointment.",
    read: "4 min",
    date: "February 2026",
    image: bodyButter,
  },
];

function Journal() {
  const [active, setActive] = useState<Category>("All");
  const filtered = active === "All" ? posts : posts.filter((p) => p.category === active);
  const [lead, ...rest] = filtered;

  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1440px] px-5 py-16 lg:px-10 lg:py-24">
          <Reveal className="max-w-3xl">
            <p className="eyebrow text-accent">The Journal</p>
            <h1 className="mt-6 font-serif text-[2.5rem] leading-[1.08] text-foreground lg:text-6xl">
              Notes on skin, rest and looking after yourself
            </h1>
            <p className="mt-6 max-w-xl leading-relaxed text-muted-foreground">
              Everything we've learned formulating products and treating skin, written plainly.
            </p>
          </Reveal>

          <Reveal className="mt-10 flex flex-wrap gap-2" delay={80}>
            {(["All", "Skincare", "Wellness"] as Category[]).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setActive(c)}
                data-active={active === c}
                className="eyebrow border border-border px-5 py-3 text-muted-foreground transition-colors data-[active=true]:border-plum data-[active=true]:bg-plum data-[active=true]:text-primary-foreground"
              >
                {c}
              </button>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-16 lg:px-10 lg:py-20">
        {lead && (
          <Reveal className="group grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="overflow-hidden">
              <img
                src={lead.image}
                alt={lead.title}
                width={1280}
                height={1600}
                className="aspect-[5/4] w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.03]"
              />
            </div>
            <div className="flex flex-col justify-center">
              <p className="eyebrow text-accent">{lead.category}</p>
              <h2 className="mt-4 font-serif text-3xl leading-tight text-foreground lg:text-5xl">
                {lead.title}
              </h2>
              <p className="mt-5 max-w-lg leading-relaxed text-muted-foreground">{lead.excerpt}</p>
              <p className="mt-6 text-xs tracking-[0.18em] text-muted-foreground uppercase">
                {lead.date} · {lead.read} read
              </p>
            </div>
          </Reveal>
        )}

        <div className="mt-20 grid gap-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {rest.map((post, i) => (
            <Reveal key={post.title} delay={i * 80} as="article" className="group">
              <div className="overflow-hidden bg-secondary">
                <img
                  src={post.image}
                  alt={post.title}
                  loading="lazy"
                  width={912}
                  height={1104}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04]"
                />
              </div>
              <p className="eyebrow mt-6 text-accent">{post.category}</p>
              <h3 className="mt-3 font-serif text-2xl leading-snug text-foreground">
                {post.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
              <p className="mt-5 text-xs tracking-[0.18em] text-muted-foreground uppercase">
                {post.date} · {post.read} read
              </p>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
