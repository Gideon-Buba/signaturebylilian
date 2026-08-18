import { createFileRoute, Link } from "@tanstack/react-router";
import founder from "@/assets/about-founder.jpeg";
import bodyButter from "@/assets/products/body-butter.jpeg";
import oasisMassage from "@/assets/oasis-massage.jpeg";
import { Reveal } from "@/components/Reveal";

const title = "About — Signature by Lilian";
const description =
  "The story, philosophy and vision behind Signature by Lilian — a beauty and wellness house built on skincare and the Oasis spa experience.";

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
  "Purposeful formulations.",
  "Thoughtfully selected ingredients.",
  "Refined sensory experiences.",
  "Skin that feels as good as it looks.",
];

const promise = [
  { title: "Purpose", copy: "We create with purpose and formulate with intention." },
  {
    title: "Care",
    copy: "We select ingredients with care and balance performance with sensory pleasure.",
  },
  {
    title: "Everyday luxury",
    copy: "Luxury isn't reserved for special occasions — it lives in the small routines of everyday life.",
  },
  {
    title: "Quiet confidence",
    copy: "A nourishing touch. Skin that feels cared for. Quiet confidence in the mirror.",
  },
];

function About() {
  return (
    <>
      <section className="mx-auto grid max-w-[1440px] items-center gap-12 px-5 py-16 lg:grid-cols-[1.1fr_1fr] lg:gap-20 lg:px-10 lg:py-24">
        <Reveal>
          <p className="eyebrow text-accent">Our Story</p>
          <h1 className="mt-6 font-serif text-[2.5rem] leading-[1.08] text-foreground lg:text-6xl">
            It began with one question about skin
          </h1>
          <p className="mt-7 max-w-xl leading-relaxed text-muted-foreground">
            Before Signature by Lilian became a brand, it was a personal pursuit. Dr Lilian Eze
            started formulating for herself, searching for skincare that truly responded to her
            skin's needs rather than offering another version of beauty.
          </p>
          <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
            She wanted products that felt as good as they performed — formulas created with
            intention, ingredients chosen for a reason, skincare that respected the complexity of
            the skin while elevating the experience of caring for it.
          </p>
          <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
            What began with curiosity, experimentation, and a notebook gradually evolved into
            something much bigger: Signature by Lilian Skincare — a beauty brand built on the belief
            that skin deserves intentional care, visible transformation, and lasting confidence.
          </p>
        </Reveal>
        <Reveal delay={100}>
          <img
            src={founder}
            alt="Dr Lilian, founder of Signature by Lilian"
            width={1008}
            height={1008}
            className="aspect-[4/5] w-full object-cover"
          />
        </Reveal>
      </section>

      <section className="border-y border-border bg-secondary/30">
        <div className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10 lg:py-24">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="eyebrow text-muted-foreground">Beauty, With Intention</p>
            <p className="mt-7 font-serif text-3xl leading-snug text-foreground lg:text-4xl">
              We believe beautiful skin begins with understanding it.
            </p>
            <p className="mt-6 leading-relaxed text-muted-foreground">
              We combine carefully selected ingredients with a refined sensory experience to create
              skincare that nourishes, replenishes, refines, and restores — while making daily
              rituals feel quietly indulgent. We are interested in more than just a temporary glow.
              We are committed to skin that feels balanced, healthy, and consistently cared for,
              reflecting confidence and self-esteem over time.
            </p>
            <p className="eyebrow mt-8 text-accent">
              Where Nature Meets Science for Timeless Beauty
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <p className="eyebrow text-accent">The Signature Standard</p>
            <h2 className="mt-4 font-serif text-3xl leading-tight text-foreground lg:text-4xl">
              Every ingredient is chosen for a reason
            </h2>
            <p className="mt-6 max-w-md leading-relaxed text-muted-foreground">
              We do not include ingredients for appearance or trend. From rich botanical oils and
              nourishing butters to targeted actives, each formulation is developed with precision
              and respect for what the skin truly needs. Because luxury is not only visual — it is
              experiential.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <ul className="grid gap-px border border-border bg-border sm:grid-cols-2">
              {standard.map((line) => (
                <li key={line} className="bg-background p-6 font-serif text-lg text-foreground">
                  {line}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10 lg:py-24">
          <Reveal className="max-w-2xl">
            <p className="eyebrow text-accent">More Than Skincare</p>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-foreground lg:text-5xl">
              Skincare and Oasis were always meant to meet
            </h2>
            <p className="mt-6 max-w-xl leading-relaxed text-muted-foreground">
              Signature by Lilian has evolved beyond skincare into a broader expression of beauty,
              self-care, and wellbeing — from the products you use at home to experiences designed
              to help you slow down, reconnect, and restore balance.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <img
                src={bodyButter}
                alt="Signature by Lilian Skincare products"
                loading="lazy"
                width={1280}
                height={1600}
                className="aspect-[5/4] w-full object-cover"
              />
              <h3 className="mt-7 font-serif text-2xl text-plum">Skincare — the daily practice</h3>
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
            <Reveal delay={100}>
              <img
                src={oasisMassage}
                alt="Signature by Lilian Oasis treatment room"
                loading="lazy"
                width={1200}
                height={1008}
                className="aspect-[5/4] w-full object-cover"
              />
              <h3 className="mt-7 font-serif text-2xl text-gold">SBL Oasis — the deeper reset</h3>
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
        <div className="mx-auto grid max-w-[1440px] items-center gap-12 px-5 py-20 lg:grid-cols-[1fr_1.1fr] lg:gap-20 lg:px-10 lg:py-24">
          <Reveal>
            <img
              src={founder}
              alt="Dr Lilian Eze, founder of Signature by Lilian"
              width={1008}
              height={1008}
              className="aspect-[4/5] w-full object-cover"
            />
          </Reveal>
          <Reveal delay={100}>
            <p className="eyebrow text-accent">Meet the Founder</p>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-foreground lg:text-5xl">
              Dr Lilian Eze
            </h2>
            <p className="mt-6 max-w-xl leading-relaxed text-muted-foreground">
              Signature by Lilian grew from Dr Lilian's curiosity, creativity, and personal pursuit
              of better skincare. What began as a desire to understand her own skin developed into a
              deeper passion for formulation, product development, and creating meaningful beauty
              experiences.
            </p>
            <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
              For Dr Lilian, beauty has never been only about appearance. It is about confidence. It
              is about how you feel in your skin. It is about the value of time spent on yourself —
              and creating products and experiences that honour that time.
            </p>
            <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
              Today, Signature by Lilian reflects that philosophy in every detail — from formulation
              to packaging, from skincare to spa, from the smallest product detail to the experience
              of stepping into SBL Oasis. Every detail carries a Signature.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10 lg:py-24">
          <Reveal>
            <p className="eyebrow text-muted-foreground">Our Promise</p>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-foreground lg:text-5xl">
              Luxury. Purity. Radiance. Redefined.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {promise.map((v, i) => (
              <Reveal key={v.title} delay={i * 80} className="bg-background p-8 lg:p-10">
                <h3 className="font-serif text-2xl text-foreground">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{v.copy}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-foreground text-background">
        <div className="mx-auto max-w-[1440px] px-5 py-20 text-center lg:px-10 lg:py-28">
          <Reveal className="mx-auto max-w-2xl">
            <p className="eyebrow text-gold">Welcome to Our World</p>
            <p className="mt-7 font-serif text-3xl leading-snug lg:text-4xl">
              Beauty should be effective. Beauty should be intentional. And beauty should feel like
              you.
            </p>
            <p className="eyebrow mt-8 text-background/70">
              Signature by Lilian — Where Nature Meets Science for Timeless Beauty
            </p>
            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
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
