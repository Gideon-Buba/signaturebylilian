import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { Reveal } from "@/components/Reveal";
import { listJournalPostsFn } from "@/server-fns/journal";

const title = "Journal — Beauty & Wellness Notes | Signature by Lilian";
const description =
  "Skincare routines, ingredient education, wellness routines and self-care notes from the Signature by Lilian team.";

export const Route = createFileRoute("/journal/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  loader: async () => {
    const posts = await listJournalPostsFn();
    return { posts };
  },
  component: Journal,
});

type Category = "All" | "Skincare" | "Wellness";

function Journal() {
  const { posts } = Route.useLoaderData();
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
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground">
            New posts are on the way — check back soon.
          </p>
        )}

        {lead && (
          <Reveal className="group grid gap-10 lg:grid-cols-2 lg:gap-16">
            <Link
              to="/journal/$slug"
              params={{ slug: lead.slug }}
              className="block overflow-hidden"
            >
              {lead.coverImageUrl && (
                <img
                  src={lead.coverImageUrl}
                  alt={lead.title}
                  width={1280}
                  height={1600}
                  className="aspect-[5/4] w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.03]"
                />
              )}
            </Link>
            <div className="flex flex-col justify-center">
              <p className="eyebrow text-accent">{lead.category}</p>
              <Link to="/journal/$slug" params={{ slug: lead.slug }}>
                <h2 className="mt-4 font-serif text-3xl leading-tight text-foreground transition-colors hover:text-plum lg:text-5xl">
                  {lead.title}
                </h2>
              </Link>
              <p className="mt-5 max-w-lg leading-relaxed text-muted-foreground">{lead.excerpt}</p>
              <p className="mt-6 text-xs tracking-[0.18em] text-muted-foreground uppercase">
                {lead.publishedAt && new Date(lead.publishedAt).toLocaleDateString()}
                {lead.readTime && ` · ${lead.readTime} read`}
              </p>
            </div>
          </Reveal>
        )}

        <div className="mt-20 grid gap-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {rest.map((post, i) => (
            <Reveal key={post.id} delay={i * 80} as="article" className="group">
              <Link to="/journal/$slug" params={{ slug: post.slug }} className="block">
                <div className="overflow-hidden bg-secondary">
                  {post.coverImageUrl && (
                    <img
                      src={post.coverImageUrl}
                      alt={post.title}
                      loading="lazy"
                      width={912}
                      height={1104}
                      className="aspect-[4/3] w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04]"
                    />
                  )}
                </div>
                <p className="eyebrow mt-6 text-accent">{post.category}</p>
                <h3 className="mt-3 font-serif text-2xl leading-snug text-foreground transition-colors group-hover:text-plum">
                  {post.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
                <p className="mt-5 text-xs tracking-[0.18em] text-muted-foreground uppercase">
                  {post.publishedAt && new Date(post.publishedAt).toLocaleDateString()}
                  {post.readTime && ` · ${post.readTime} read`}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
