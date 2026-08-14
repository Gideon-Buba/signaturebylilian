import { createFileRoute, Link } from "@tanstack/react-router";

import founder from "@/assets/about-founder.jpeg";
import bodyButter from "@/assets/product-body-butter.jpeg";
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

const values = [
  {
    title: "Beauty",
    copy: "Not a standard to meet — a version of yourself you recognise and like.",
  },
  { title: "Confidence", copy: "What good skin and real rest quietly give back to you." },
  { title: "Wellness", copy: "Care that reaches past the surface and into how your days feel." },
  { title: "Self-care", copy: "Unapologetic, scheduled, and never treated as an indulgence." },
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
            Dr Lilian started formulating for herself. Nothing on the shelf was honest about what it
            could do, and almost nothing was made for the skin she actually had. What began in a
            small kitchen with a notebook became Signature by Lilian.
          </p>
          <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
            The peacock in our mark is deliberate. It stands for transformation and for the kind of
            beauty that doesn't need to apologise for taking up space.
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
            <p className="eyebrow text-muted-foreground">Our Philosophy</p>
            <p className="mt-7 font-serif text-3xl leading-snug text-foreground italic lg:text-4xl">
              “Beauty should never feel like correction. It should feel like care that continues
              after you've left the room.”
            </p>
            <p className="eyebrow mt-8 text-accent">Dr Lilian, Founder</p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10 lg:py-24">
        <Reveal className="max-w-2xl">
          <p className="eyebrow text-accent">Two Halves of One Idea</p>
          <h2 className="mt-4 font-serif text-4xl leading-tight text-foreground lg:text-5xl">
            Skincare and Oasis were always meant to meet
          </h2>
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
            <h3 className="mt-7 font-serif text-2xl text-gold">Oasis — the deeper reset</h3>
            <p className="mt-3 max-w-md leading-relaxed text-muted-foreground">
              What a trained pair of hands and ninety uninterrupted minutes can do that no product
              alone can.
            </p>
            <Link
              to="/oasis"
              className="eyebrow mt-6 inline-block border-b border-gold pb-2 text-foreground transition-colors hover:text-gold"
            >
              Discover Oasis
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10 lg:py-24">
          <Reveal>
            <p className="eyebrow text-muted-foreground">What We Believe</p>
          </Reveal>
          <div className="mt-12 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 80} className="bg-background p-8 lg:p-10">
                <h3 className="font-serif text-2xl text-foreground">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{v.copy}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
