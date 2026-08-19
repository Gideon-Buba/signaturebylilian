import { createFileRoute, Link } from "@tanstack/react-router";
import founder from "@/assets/about-founder.jpeg";
import bodyButter from "@/assets/products/body-butter.jpeg";
import oasisMassage from "@/assets/oasis-massage.jpeg";
import { Reveal } from "@/components/Reveal";

const title = "About - Signature by Lilian";
const description =
  "The story, philosophy and vision behind Signature by Lilian, a beauty and wellness house built on skincare and the Oasis spa experience.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: About,
});

const standard = [
  {
    n: "01",
    title: "Purposeful",
    copy: "Every formulation is developed with intention, not trend.",
  },
  {
    n: "02",
    title: "Selected",
    copy: "Ingredients chosen with care for what the skin truly needs.",
  },
  {
    n: "03",
    title: "Refined",
    copy: "A sensory experience that makes daily routines feel indulgent.",
  },
  { n: "04", title: "Felt", copy: "Skin that feels as good as it looks, and stays that way." },
];

const promise = [
  { n: "01", title: "Purpose", copy: "We create with purpose and formulate with intention." },
  {
    n: "02",
    title: "Care",
    copy: "We select ingredients with care and balance performance with sensory pleasure.",
  },
  {
    n: "03",
    title: "Everyday luxury",
    copy: "Luxury isn't reserved for special occasions. It lives in the small routines of everyday life.",
  },
  {
    n: "04",
    title: "Quiet confidence",
    copy: "A nourishing touch. Skin that feels cared for. Quiet confidence in the mirror.",
  },
];

function SectionLabel({ n, children }: { n: string; children: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="font-serif text-3xl text-accent/30 lg:text-4xl">{n}</span>
      <span className="eyebrow text-sm tracking-[0.32em] text-accent">{children}</span>
    </div>
  );
}

function About() {
  return (
    <>
      <section className="relative overflow-hidden">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 -right-10 font-serif text-[13rem] leading-none text-accent/[0.05] select-none lg:text-[20rem]"
        >
          Lilian
        </span>
        <div className="relative mx-auto grid max-w-[1440px] items-center gap-12 px-5 py-20 lg:grid-cols-[1.1fr_1fr] lg:gap-20 lg:px-10 lg:py-28">
          <Reveal>
            <SectionLabel n="01">Our Story</SectionLabel>
            <h1 className="mt-7 font-serif text-[2.75rem] leading-[1.05] text-foreground lg:text-7xl">
              It began with
              <span className="block text-plum italic">one question</span>
              about skin.
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Before Signature by Lilian became a brand, it was a personal pursuit. Dr Lilian Eze
              started formulating for herself, searching for skincare that truly responded to her
              skin's needs rather than offering another version of beauty.
            </p>
            <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
              She wanted products that felt as good as they performed: formulas created with
              intention, ingredients chosen for a reason, skincare that respected the complexity of
              the skin while elevating the experience of caring for it.
            </p>
            <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
              What began with curiosity, experimentation, and a notebook gradually evolved into
              something much bigger: Signature by Lilian Skincare, a beauty brand built on the
              belief that skin deserves intentional care, visible transformation, and lasting
              confidence.
            </p>
          </Reveal>
          <Reveal delay={100} className="relative">
            <div className="absolute -inset-4 -z-10 border border-accent/25 lg:-inset-6" />
            <img
              src={founder}
              alt="Dr Lilian, founder of Signature by Lilian"
              width={1008}
              height={1008}
              className="aspect-[4/5] w-full object-cover"
            />
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-plum text-primary-foreground">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-[16rem] leading-none text-primary-foreground/[0.06] select-none"
        >
          &rdquo;
        </span>
        <div className="relative mx-auto max-w-[1440px] px-5 py-24 lg:px-10 lg:py-32">
          <Reveal className="mx-auto max-w-3xl text-center">
            <span className="eyebrow text-sm tracking-[0.32em] text-champagne">
              Beauty, With Intention
            </span>
            <p className="mt-8 font-serif text-4xl leading-snug italic lg:text-5xl">
              We believe beautiful skin begins with understanding it.
            </p>
            <p className="mt-8 leading-relaxed text-primary-foreground/75">
              We combine carefully selected ingredients with a refined sensory experience to create
              skincare that nourishes, replenishes, refines, and restores, making daily routines
              feel quietly indulgent. We are interested in more than just a temporary glow. We are
              committed to skin that feels balanced, healthy, and consistently cared for, reflecting
              confidence and self-esteem over time.
            </p>
            <p className="eyebrow mt-10 text-sm tracking-[0.28em] text-champagne">
              Where Nature Meets Science for Timeless Beauty
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-24 lg:px-10 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <Reveal>
            <SectionLabel n="02">The Signature Standard</SectionLabel>
            <h2 className="mt-6 font-serif text-4xl leading-tight text-foreground lg:text-5xl">
              Every ingredient is chosen for a reason
            </h2>
            <p className="mt-6 max-w-md leading-relaxed text-muted-foreground">
              We do not include ingredients for appearance or trend. From rich botanical oils and
              nourishing butters to targeted actives, each formulation is developed with precision
              and respect for what the skin truly needs. Because luxury is not only visual. It is
              experiential.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <div className="grid gap-px border border-border bg-border sm:grid-cols-2">
              {standard.map((s) => (
                <div
                  key={s.n}
                  className="group bg-background p-8 transition-colors hover:bg-secondary/40"
                >
                  <span className="font-serif text-2xl text-accent/40">{s.n}</span>
                  <h3 className="mt-4 font-serif text-xl text-foreground">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.copy}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-[1440px] px-5 py-24 lg:px-10 lg:py-32">
          <Reveal className="max-w-2xl">
            <SectionLabel n="03">More Than Skincare</SectionLabel>
            <h2 className="mt-6 font-serif text-4xl leading-tight text-foreground lg:text-5xl">
              Skincare and Oasis were always meant to meet
            </h2>
            <p className="mt-6 max-w-xl leading-relaxed text-muted-foreground">
              Signature by Lilian has evolved beyond skincare into a broader expression of beauty,
              self-care, and wellbeing: from the products you use at home to experiences designed to
              help you slow down, reconnect, and restore balance.
            </p>
          </Reveal>

          <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal className="relative">
              <div className="absolute -top-4 -left-4 -z-10 h-full w-full border border-plum/30" />
              <img
                src={bodyButter}
                alt="Signature by Lilian Skincare products"
                loading="lazy"
                width={1280}
                height={1600}
                className="aspect-[5/4] w-full object-cover"
              />
              <h3 className="mt-8 font-serif text-2xl text-plum">Skincare, the daily practice</h3>
              <p className="mt-3 max-w-md leading-relaxed text-muted-foreground">
                What you do every morning and every night, in your own bathroom, with formulas that
                respect your barrier.
              </p>
              <Link
                to="/skincare"
                className="eyebrow mt-6 inline-block border-b border-plum pb-2 text-plum transition-colors hover:text-magenta"
              >
                Explore Skincare
              </Link>
            </Reveal>
            <Reveal delay={100} className="relative">
              <div className="absolute -top-4 -left-4 -z-10 h-full w-full border border-gold/40" />
              <img
                src={oasisMassage}
                alt="Signature by Lilian Oasis treatment room"
                loading="lazy"
                width={1200}
                height={1008}
                className="aspect-[5/4] w-full object-cover"
              />
              <h3 className="mt-8 font-serif text-2xl text-gold">SBL Oasis, the deeper reset</h3>
              <p className="mt-3 max-w-md leading-relaxed text-muted-foreground">
                Skincare meets relaxation, indulgence meets intention, and beauty becomes an
                experience rather than a routine.
              </p>
              <Link
                to="/oasis"
                className="eyebrow mt-6 inline-block border-b border-gold pb-2 text-foreground transition-colors hover:text-gold"
              >
                Discover Oasis
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-secondary/30">
        <div className="mx-auto grid max-w-[1440px] items-center gap-14 px-5 py-24 lg:grid-cols-[1fr_1.15fr] lg:gap-20 lg:px-10 lg:py-32">
          <Reveal className="relative order-2 lg:order-1">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-16 -left-4 font-serif text-[9rem] leading-none text-accent/15 select-none"
            >
              &ldquo;
            </span>
            <SectionLabel n="04">Meet the Founder</SectionLabel>
            <h2 className="mt-6 font-serif text-4xl leading-tight text-foreground lg:text-5xl">
              Dr Lilian Eze
            </h2>
            <p className="mt-7 max-w-xl leading-relaxed text-muted-foreground">
              Signature by Lilian grew from Dr Lilian's curiosity, creativity, and personal pursuit
              of better skincare. What began as a desire to understand her own skin developed into a
              deeper passion for formulation, product development, and creating meaningful beauty
              experiences.
            </p>
            <p className="mt-4 font-serif text-2xl leading-snug text-plum italic">
              "Beauty has never been only about appearance. It is about confidence. It is about how
              you feel in your skin."
            </p>
            <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
              It is about the value of time spent on yourself, and creating products and experiences
              that honour that time. Today, Signature by Lilian reflects that philosophy in every
              detail: from formulation to packaging, from skincare to spa, from the smallest product
              detail to the experience of stepping into SBL Oasis. Every detail carries a Signature.
            </p>
          </Reveal>
          <Reveal delay={100} className="relative order-1 lg:order-2">
            <div className="absolute -inset-4 -z-10 border border-accent/25 lg:-inset-6" />
            <img
              src={founder}
              alt="Dr Lilian Eze, founder of Signature by Lilian"
              width={1008}
              height={1008}
              className="aspect-[4/5] w-full object-cover"
            />
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-[1440px] px-5 py-24 lg:px-10 lg:py-32">
          <Reveal>
            <SectionLabel n="05">Our Promise</SectionLabel>
            <h2 className="mt-6 font-serif text-4xl leading-tight text-foreground lg:text-5xl">
              Luxury. Purity. Radiance. Redefined.
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {promise.map((v, i) => (
              <Reveal
                key={v.title}
                delay={i * 80}
                className="group bg-background p-8 transition-colors hover:bg-secondary/40 lg:p-10"
              >
                <span className="font-serif text-2xl text-accent/40">{v.n}</span>
                <h3 className="mt-4 font-serif text-2xl text-foreground">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{v.copy}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-border bg-foreground text-background">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-20 left-1/2 -translate-x-1/2 font-serif text-[10rem] leading-none whitespace-nowrap text-background/[0.05] select-none lg:text-[14rem]"
        >
          SIGNATURE
        </span>
        <div className="relative mx-auto max-w-[1440px] px-5 py-24 text-center lg:px-10 lg:py-32">
          <Reveal className="mx-auto max-w-2xl">
            <span className="eyebrow text-sm tracking-[0.32em] text-gold">
              Welcome to Our World
            </span>
            <p className="mt-8 font-serif text-4xl leading-snug lg:text-5xl">
              Beauty should be effective. Beauty should be intentional. And beauty should feel like
              you.
            </p>
            <p className="eyebrow mt-8 text-background/60">
              Signature by Lilian: Where Nature Meets Science for Timeless Beauty
            </p>
            <div className="mt-12 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/skincare"
                className="eyebrow bg-plum px-8 py-4 text-center text-primary-foreground transition-colors hover:bg-magenta"
              >
                Shop Skincare
              </Link>
              <Link
                to="/oasis"
                className="eyebrow border border-gold px-8 py-4 text-center text-background transition-colors hover:bg-background/10"
              >
                Discover SBL Oasis
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
