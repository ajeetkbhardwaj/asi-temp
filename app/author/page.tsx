import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, FileText, Mail } from "lucide-react";
import { getAllArticles, getAllBooks } from "@/lib/books";

export const metadata: Metadata = {
  title: "About Ajeet Kumar — Kumar Press",
  description:
    "About Ajeet Kumar, author and founder of Kumar Press. Writing philosophy, multi-volume books, essays, and publishing inquiries.",
};

export default function AuthorPage() {
  const books = getAllBooks();
  const articles = getAllArticles();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 lg:py-16 space-y-16">
      {/* Author Introduction */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-stretch">
        <div className="md:col-span-5 relative min-h-[260px] rounded-md overflow-hidden border border-border bg-muted">
          <Image
            src="/images/author_studio_desk.jpg"
            alt="Ajeet Kumar writing desk and book manuscripts"
            fill
            sizes="(max-width: 768px) 100vw, 42vw"
            className="object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="md:col-span-7 flex flex-col justify-center space-y-5">
          <p className="text-xs font-semibold text-primary">
            Author &amp; Publisher · Kumar Press
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground">
            Ajeet Kumar
          </h1>
          <div className="space-y-4 text-base text-muted-foreground leading-relaxed">
            <p>
              I write long-form technical books and essays focused on software
              clarity, distributed systems, and engineering judgment. Kumar
              Press is my independent publishing home where complex subjects are
              distilled into structured, multi-volume works.
            </p>
            <p>
              Like classic reference libraries, every book here is organized into
              volumes, parts, and chapters—designed for focused sequential
              reading and lasting clarity.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/books"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <BookOpen className="h-4 w-4" />
              <span>Browse Books</span>
            </Link>
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md border border-border bg-background text-foreground text-sm font-medium hover:bg-muted transition-colors"
            >
              <FileText className="h-4 w-4" />
              <span>Read Articles</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Editorial Approach */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-border">
        <div className="space-y-2">
          <h2 className="font-serif text-lg font-semibold text-foreground">
            01. Ideas in Volumes
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Complex engineering disciplines deserve room to breathe. Structuring
            works across volumes and parts keeps foundational concepts separate
            from advanced reference material.
          </p>
        </div>
        <div className="space-y-2">
          <h2 className="font-serif text-lg font-semibold text-foreground">
            02. Living Manuscripts
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Every chapter and essay lives in plain MDX files under{" "}
            <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">
              contents/
            </code>
            , allowing continuous refinement without separating web and print
            editions.
          </p>
        </div>
        <div className="space-y-2">
          <h2 className="font-serif text-lg font-semibold text-foreground">
            03. Thematic Discovery
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Books and essays are indexed by theme and reading path so builders
            can jump straight to the exact volume, part, or concept they need.
          </p>
        </div>
      </section>

      {/* Published Books */}
      <section className="space-y-6 pt-10 border-t border-border">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl font-semibold text-foreground">
            Books by Ajeet Kumar
          </h2>
          <Link
            href="/books"
            className="text-sm font-medium text-primary hover:underline underline-offset-4"
          >
            Browse Catalog
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {books.map((book) => (
            <Link
              key={book.slug}
              href={`/books/${book.slug}`}
              className="group p-6 rounded-md border border-border bg-card hover:bg-muted/40 transition-colors space-y-3"
            >
              <div className="flex items-center gap-2 text-xs text-muted-foreground tabular-nums">
                <span>{book.category}</span>
                <span aria-hidden="true">·</span>
                <span>{book.totalVolumes} Volumes</span>
                <span aria-hidden="true">·</span>
                <span>{book.totalChapters} Chapters</span>
              </div>
              <h3 className="font-serif text-xl font-semibold text-foreground group-hover:text-primary transition-colors flex items-center justify-between gap-2">
                <span>{book.title}</span>
                <ArrowRight className="h-4 w-4 shrink-0" />
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {book.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Articles + Contact */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-10 border-t border-border">
        <div className="md:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-semibold text-foreground">
              Recent Essays
            </h2>
            <Link
              href="/articles"
              className="text-sm font-medium text-primary hover:underline underline-offset-4"
            >
              View all ({articles.length})
            </Link>
          </div>
          <div className="divide-y divide-border rounded-md border border-border bg-card">
            {articles.slice(0, 3).map((article) => (
              <Link
                key={article.slug}
                href={`/articles/${article.slug}`}
                className="block p-4 hover:bg-muted/40 transition-colors"
              >
                <p className="text-xs text-muted-foreground">
                  {article.theme} · {article.publishedAt}
                </p>
                <p className="font-serif text-base font-semibold text-foreground mt-1">
                  {article.title}
                </p>
              </Link>
            ))}
          </div>
        </div>

        <div className="md:col-span-5 rounded-md border border-border bg-card p-6 space-y-4 h-fit">
          <h2 className="font-serif text-xl font-semibold text-foreground">
            Reader &amp; Press Inquiries
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            For feedback on any chapter, translation rights, speaking sessions,
            or bulk team editions, reach out directly.
          </p>
          <a
            href="mailto:ajeetkamla7897@gmail.com"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md border border-border bg-background text-foreground text-sm font-medium hover:bg-muted transition-colors"
          >
            <Mail className="h-4 w-4" />
            <span>ajeetkamla7897@gmail.com</span>
          </a>
        </div>
      </section>
    </div>
  );
}
