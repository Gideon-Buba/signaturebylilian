import { createFileRoute, Link } from "@tanstack/react-router";
import { Leaf, Sparkles, FlaskConical, Heart } from "lucide-react";

import heroSkincare from "@/assets/skincare-products-hero.jpeg";
import { Reveal } from "@/components/Reveal";
import { ProductCard } from "@/components/ProductCard";
import { toStoreProduct } from "@/lib/product-display";
import { listProductsFn } from "@/server-fns/products";

const title = "Skincare — Signature by Lilian";
const description =
  "Shop Signature by Lilian Skincare: serums, creams, cleansers and facial oils crafted to nourish and enhance your natural beauty.";

export const Route = createFileRoute("/skincare/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  loader: async () => {
    const allProducts = await listProductsFn();
    const products = allProducts.filter((p) => !p.isArchived);
    return { products };
  },
  component: Skincare,
});

const pillars = [
  {
    icon: FlaskConical,
    title: "Proven actives",
    copy: "Formulas built on ingredients with real, published evidence — never trend-led.",
  },
  {
    icon: Leaf,
    title: "Kind to skin",
    copy: "pH-balanced, dermatologist-tested and free from needless irritants.",
  },
  {
    icon: Sparkles,
    title: "Visible results",
    copy: "Designed for glow you can see within a single cycle of use.",
  },
  {
    icon: Heart,
    title: "Made with care",
    copy: "Small batches, cruelty-free, and formulated by hand before it ever ships.",
  },
];

const collections = [
  { name: "The Glow Edit", copy: "Brightening care for dull, uneven tone." },
  { name: "Barrier Repair", copy: "For sensitive, reactive and compromised skin." },
  { name: "Night Rituals", copy: "Overnight renewal oils, masks and treatments." },
];

const reviews = [
  {
    name: "Adaeze O.",
    text: "Six weeks with the Glow Serum and my tone has completely evened out. It feels like a treat every morning.",
    product: "Glow Serum (50ml)",
  },
  {
    name: "Bisi A.",
    text: "The face soap is the only cleanse my sensitive skin has never reacted to. I've repurchased four times.",
    product: "Face Soap (200g)",
  },
  {
    name: "Kemi T.",
    text: "The packaging, the texture, the scent — it feels far more expensive than it is.",
    product: "Body Butter (300g)",
  },
];

const tips = [
  {
    step: "01",
    title: "Cleanse gently",
    copy: "Lukewarm water, no scrubbing. Your barrier is worth protecting.",
  },
  {
    step: "02",
    title: "Treat with intent",
    copy: "Serums on damp skin, thinnest textures first, one new active at a time.",
  },
  {
    step: "03",
    title: "Seal it in",
    copy: "Moisturiser every night, SPF every morning — without exception.",
  },
];

function Skincare() {
  const { products } = Route.useLoaderData();

  return (
    <>
      <section className="border-b border-border bg-blush/40">
        <div className="mx-auto grid max-w-[1440px] items-center gap-12 px-5 py-16 lg:grid-cols-[1fr_1fr] lg:gap-20 lg:px-10 lg:py-24">
          <Reveal>
            <p className="eyebrow text-magenta">Signature by Lilian Skincare</p>
            <h1 className="mt-6 font-serif text-[2.5rem] leading-[1.08] text-foreground lg:text-6xl">
              Skincare that honours <span className="text-plum italic">your</span> skin
            </h1>
            <p className="mt-6 max-w-lg leading-relaxed text-muted-foreground">
              Thoughtfully crafted formulas designed to nourish, care for, and enhance your natural
              beauty — nothing extra, nothing harsh.
            </p>
            <a
              href="#products"
              className="eyebrow mt-9 inline-block bg-plum px-8 py-4 text-primary-foreground transition-colors hover:bg-magenta"
            >
              Shop the Collection
            </a>
          </Reveal>
          <Reveal delay={100}>
            <img
              src={heroSkincare}
              alt="Signature by Lilian serum bottles styled on silk with orchids"
              width={1280}
              height={1600}
              className="aspect-[4/5] w-full object-cover"
            />
          </Reveal>
        </div>
      </section>

      <section id="products" className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10 lg:py-28">
        <Reveal>
          <p className="eyebrow text-magenta">Featured Products</p>
          <h2 className="mt-4 font-serif text-4xl text-foreground lg:text-5xl">The collection</h2>
        </Reveal>
        {products.length === 0 ? (
          <p className="mt-10 text-sm text-muted-foreground">
            New products are on the way — check back soon.
          </p>
        ) : (
          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {products.map((p, i) => (
              <Reveal key={p.id} delay={i * 90}>
                <ProductCard product={toStoreProduct(p)} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      <section className="border-y border-border bg-secondary/30">
        <div className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10 lg:py-24">
          <Reveal>
            <p className="eyebrow text-muted-foreground">Collections</p>
            <h2 className="mt-4 font-serif text-4xl text-foreground lg:text-5xl">
              Curated for your concern
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-px border border-border bg-border sm:grid-cols-3">
            {collections.map((c, i) => (
              <Reveal key={c.name} delay={i * 80} className="bg-background p-8 lg:p-10">
                <h3 className="font-serif text-2xl text-foreground">{c.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.copy}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10 lg:py-24">
        <Reveal className="max-w-xl">
          <p className="eyebrow text-magenta">Why Signature by Lilian</p>
          <h2 className="mt-4 font-serif text-4xl text-foreground lg:text-5xl">
            Formulated with restraint
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 80}>
              <p.icon className="size-5 text-magenta" strokeWidth={1.5} />
              <h3 className="mt-5 font-serif text-2xl text-foreground">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.copy}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-plum text-primary-foreground">
        <div className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10 lg:py-24">
          <Reveal>
            <p className="eyebrow text-blush">Customer Reviews</p>
            <h2 className="mt-4 font-serif text-4xl lg:text-5xl">In their words</h2>
          </Reveal>
          <div className="mt-14 grid gap-10 lg:grid-cols-3">
            {reviews.map((r, i) => (
              <Reveal key={r.name} delay={i * 90}>
                <p className="font-serif text-2xl leading-snug italic">“{r.text}”</p>
                <p className="eyebrow mt-6 text-blush">{r.name}</p>
                <p className="mt-2 text-xs text-primary-foreground/70">{r.product}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10 lg:py-24">
        <Reveal className="max-w-xl">
          <p className="eyebrow text-magenta">Skincare Tips</p>
          <h2 className="mt-4 font-serif text-4xl text-foreground lg:text-5xl">
            A routine that actually works
          </h2>
        </Reveal>
        <div className="mt-12 divide-y divide-border border-y border-border">
          {tips.map((t, i) => (
            <Reveal key={t.step} delay={i * 80} className="grid gap-4 py-8 sm:grid-cols-[6rem_1fr]">
              <span className="eyebrow text-magenta">{t.step}</span>
              <div>
                <h3 className="font-serif text-2xl text-foreground">{t.title}</h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  {t.copy}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-16 text-center">
          <Link
            to="/journal"
            className="eyebrow inline-block border-b border-plum pb-2 text-plum transition-colors hover:text-magenta"
          >
            More in the Journal
          </Link>
        </Reveal>
      </section>
    </>
  );
}
