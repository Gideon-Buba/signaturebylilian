import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { Reveal } from "@/components/Reveal";
import { getJournalPostFn } from "@/server-fns/journal";

export const Route = createFileRoute("/journal/$slug")({
  loader: async ({ params }) => {
    try {
      const post = await getJournalPostFn({ data: { slug: params.slug } });
      return { post };
    } catch {
      throw notFound();
    }
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.post.title} — Signature by Lilian Journal` },
          { name: "description", content: loaderData.post.excerpt },
        ]
      : [],
  }),
  component: JournalPostDetail,
});

function JournalPostDetail() {
  const { post } = Route.useLoaderData();

  return (
    <article className="mx-auto max-w-3xl px-5 py-14 lg:px-10 lg:py-20">
      <nav className="eyebrow text-muted-foreground">
        <Link to="/journal" className="hover:text-accent">
          Journal
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{post.category}</span>
      </nav>

      <Reveal>
        <p className="eyebrow mt-6 text-accent">{post.category}</p>
        <h1 className="mt-4 font-serif text-4xl leading-tight text-foreground lg:text-5xl">
          {post.title}
        </h1>
        <p className="mt-4 text-xs tracking-[0.18em] text-muted-foreground uppercase">
          {post.publishedAt && new Date(post.publishedAt).toLocaleDateString()}
          {post.readTime && ` · ${post.readTime} read`}
        </p>
      </Reveal>

      {post.coverImageUrl && (
        <Reveal delay={80}>
          <img
            src={post.coverImageUrl}
            alt={post.title}
            width={1280}
            height={800}
            className="mt-10 aspect-[8/5] w-full object-cover"
          />
        </Reveal>
      )}

      <Reveal delay={120}>
        <div className="prose-journal mt-10" dangerouslySetInnerHTML={{ __html: post.body }} />
      </Reveal>

      <div className="mt-16 border-t border-border pt-8">
        <Link
          to="/journal"
          className="eyebrow border-b border-plum pb-2 text-plum transition-colors hover:text-magenta"
        >
          Back to Journal
        </Link>
      </div>
    </article>
  );
}
