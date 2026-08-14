import { createFileRoute, Link } from "@tanstack/react-router";
import heroSkincare from "@/assets/hero-skincare.png";
import bodyButter from "@/assets/product-body-butter.jpeg";
import heroOasis from "@/assets/hero-oasis.jpeg";
import oasisMassage from "@/assets/oasis-massage.jpeg";
import { Reveal } from "@/components/Reveal";
import { SignatureUnderline } from "@/components/SignatureUnderline";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/catalog";
import { listTreatmentsFn } from "@/server-fns/treatments";

const title = "Signature by Lilian — Premium Skincare & Luxury Spa";
const description =
  "Discover Signature by Lilian: thoughtfully crafted skincare and the restorative wellness rituals of Signature by Lilian Oasis.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  loader: async () => {
    const treatments = await listTreatmentsFn();
    return { treatments };
  },
  component: Home,
});

function Home() {
  const { treatments } = Route.useLoaderData();
  const featuredTreatments = treatments.filter((t) => t.isFeatured).slice(0, 3);
  const oasisPreview = featuredTreatments.length > 0 ? featuredTreatments : treatments.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="mx-auto grid max-w-[1440px] items-stretch lg:grid-cols-[1.05fr_1fr]">
          <div className="flex flex-col justify-center px-5 py-20 lg:px-14 lg:py-32">
            <Reveal>
              <p className="eyebrow text-accent">Signature by Lilian</p>
              <h1 className="mt-6 font-serif text-[2.75rem] leading-[1.05] text-foreground sm:text-6xl lg:text-7xl">
                Your Beauty.
                <br />
                Your Wellbeing.
                <br />
                <span className="relative inline-block text-plum italic font-bold">
                  Your Signature.
                  <SignatureUnderline className="absolute inset-x-0 -bottom-3 h-3 text-plum/80 sm:-bottom-4 sm:h-4" />
                </span>
              </h1>
              <p className="mt-7 max-w-lg text-base leading-relaxed text-muted-foreground">
                Discover the world of Signature by Lilian, premium skincare and restorative wellness
                experiences designed to help you look, feel, and live beautifully.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/skincare"
                  className="eyebrow bg-plum px-8 py-4 text-center text-primary-foreground transition-colors hover:bg-magenta"
                >
                  Shop Skincare
                </Link>
                <Link
                  to="/oasis"
                  className="eyebrow border border-gold px-8 py-4 text-center text-foreground transition-colors hover:bg-champagne/40"
                >
                  Explore Oasis
                </Link>
              </div>
            </Reveal>
          </div>

          <div className="relative grid grid-cols-2 lg:h-[min(86vh,820px)]">
            <img
              src={heroSkincare}
              alt="Signature by Lilian skincare serum on ivory silk"
              width={1280}
              height={1600}
              className="h-full min-h-[340px] w-full object-cover"
            />
            <img
              src={heroOasis}
              alt="Candlelit treatment room at Signature by Lilian Oasis"
              width={1280}
              height={1600}
              className="h-full min-h-[340px] w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Two experiences */}
      <section className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10 lg:py-28">
        <Reveal className="max-w-2xl">
          <p className="eyebrow text-muted-foreground">Two Experiences, One Signature</p>
          <h2 className="mt-5 font-serif text-4xl leading-tight text-foreground lg:text-5xl">
            Beauty you can hold, and wellness you can feel.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal className="group">
            <div className="overflow-hidden bg-blush/50">
              <img
                src={bodyButter}
                alt="Signature by Lilian Skincare collection"
                loading="lazy"
                width={1280}
                height={1600}
                className="aspect-[5/4] w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.03]"
              />
            </div>
            <p className="eyebrow mt-7 text-magenta">Skincare</p>
            <h3 className="mt-3 font-serif text-3xl text-foreground lg:text-4xl">
              Signature by Lilian Skincare
            </h3>
            <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">
              Thoughtfully crafted skincare designed to nourish, care for, and enhance your natural
              beauty.
            </p>
            <Link
              to="/skincare"
              className="eyebrow mt-7 inline-block border-b border-plum pb-2 text-plum transition-colors hover:border-magenta hover:text-magenta"
            >
              Explore Skincare
            </Link>
          </Reveal>

          <Reveal className="group theme-oasis bg-background p-0" delay={120}>
            <div className="overflow-hidden bg-cream">
              <img
                src={oasisMassage}
                alt="Treatment room at Signature by Lilian Oasis"
                loading="lazy"
                width={1200}
                height={1008}
                className="aspect-[5/4] w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.03]"
              />
            </div>
            <p className="eyebrow mt-7 text-gold">Oasis</p>
            <h3 className="mt-3 font-serif text-3xl text-foreground lg:text-4xl">
              Signature by Lilian Oasis
            </h3>
            <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">
              A sanctuary for relaxation, beauty, self-care, and rejuvenation.
            </p>
            <Link
              to="/oasis"
              className="eyebrow mt-7 inline-block border-b border-gold pb-2 text-foreground transition-colors hover:text-accent"
            >
              Discover Oasis
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Featured products */}
      <section className="border-y border-border bg-secondary/30">
        <div className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10 lg:py-28">
          <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow text-magenta">Best Sellers</p>
              <h2 className="mt-4 font-serif text-4xl text-foreground lg:text-5xl">
                Loved by our community
              </h2>
            </div>
            <Link
              to="/skincare"
              className="eyebrow border-b border-plum pb-2 text-plum transition-colors hover:text-magenta"
            >
              View All Products
            </Link>
          </Reveal>

          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {products.map((product, i) => (
              <Reveal key={product.id} delay={i * 90}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Oasis strip */}
      <section className="theme-oasis bg-background">
        <div className="mx-auto grid max-w-[1440px] items-center gap-12 px-5 py-20 lg:grid-cols-2 lg:gap-20 lg:px-10 lg:py-28">
          <Reveal className="order-2 lg:order-1">
            <p className="eyebrow text-gold">The Oasis Experience</p>
            <h2 className="mt-5 font-serif text-4xl leading-tight text-foreground lg:text-5xl">
              Step away from the everyday
            </h2>
            <p className="mt-6 max-w-md leading-relaxed text-muted-foreground">
              Warm light, quiet rooms and therapists who take their time. Every ritual at Oasis is
              built around one thing — how you feel when you leave.
            </p>
            <ul className="mt-10 divide-y divide-border border-y border-border">
              {oasisPreview.map((t) => (
                <li key={t.id} className="flex items-baseline justify-between gap-6 py-5">
                  <div>
                    <p className="font-serif text-xl text-foreground">{t.name}</p>
                    {t.duration && (
                      <p className="mt-1 text-xs tracking-[0.18em] text-muted-foreground uppercase">
                        {t.duration}
                      </p>
                    )}
                  </div>
                  <span className="font-serif text-lg text-accent">
                    {t.price != null ? `₦${t.price.toLocaleString()}` : "Contact for pricing"}
                  </span>
                </li>
              ))}
            </ul>
            <Link
              to="/oasis"
              className="eyebrow mt-10 inline-block bg-foreground px-8 py-4 text-background transition-opacity hover:opacity-85"
            >
              Book an Appointment
            </Link>
          </Reveal>

          <Reveal className="order-1 lg:order-2" delay={100}>
            <img
              src={heroOasis}
              alt="Candlelit spa suite with champagne gold detailing"
              loading="lazy"
              width={1280}
              height={1600}
              className="aspect-[4/5] w-full object-cover"
            />
          </Reveal>
        </div>
      </section>

      {/* Journal teaser */}
      <section className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10 lg:py-24">
        <Reveal className="border border-border px-6 py-14 text-center lg:px-20 lg:py-20">
          <p className="eyebrow text-muted-foreground">The Journal</p>
          <h2 className="mx-auto mt-5 max-w-2xl font-serif text-3xl leading-tight text-foreground lg:text-4xl">
            Skincare knowledge, wellness rituals and the quiet art of taking care of yourself.
          </h2>
          <Link
            to="/journal"
            className="eyebrow mt-9 inline-block border-b border-plum pb-2 text-plum transition-colors hover:text-magenta"
          >
            Read the Journal
          </Link>
        </Reveal>
      </section>
    </>
  );
}
