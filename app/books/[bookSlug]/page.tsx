import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight, BookOpen, ChevronRight } from "lucide-react";
import {
  getAllBooks,
  getBookBySlug,
  getBookFlatChapters,
} from "@/lib/books";

interface BookPageProps {
  params: Promise<{ bookSlug: string }>;
}

export function generateStaticParams() {
  return getAllBooks().map((b) => ({ bookSlug: b.slug }));
}

export async function generateMetadata({
  params,
}: BookPageProps): Promise<Metadata> {
  const { bookSlug } = await params;
  const book = getBookBySlug(bookSlug);
  if (!book) {
    return { title: "Book Not Found — Kumar Press" };
  }
  return {
    title: `${book.title} — Kumar Press`,
    description: book.description,
  };
}

export default async function BookDetailPage({ params }: BookPageProps) {
  const { bookSlug } = await params;
  const book = getBookBySlug(bookSlug);
  if (!book) notFound();

  const flatChapters = getBookFlatChapters(book);
  const firstHref =
    book.frontmatter[0]
      ? `/books/${book.slug}/frontmatter/${book.frontmatter[0].slug}`
      : flatChapters[0]?.href || `/books/${book.slug}`;
  const estimatedHours = Math.max(1, Math.round(book.totalWords / 13000));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 lg:py-14 space-y-14">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-xs text-muted-foreground"
      >
        <Link href="/books" className="hover:text-foreground transition-colors">
          Books
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium">{book.title}</span>
      </nav>

      {/* Book Hero Split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        <div className="lg:col-span-4">
          <div className="relative aspect-[3/4] w-full max-w-sm mx-auto lg:mx-0 rounded-md overflow-hidden border border-border bg-muted">
            <Image
              src={book.coverImage}
              alt={`${book.title} cover`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 33vw"
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground tabular-nums">
              <span>{book.category}</span>
              <span aria-hidden="true">·</span>
              <span>{book.edition}</span>
              <span aria-hidden="true">·</span>
              <span>{book.publishedYear}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground leading-tight">
              {book.title}
            </h1>

            {book.subtitle && (
              <p className="font-serif italic text-lg text-muted-foreground">
                {book.subtitle}
              </p>
            )}

            <p className="text-sm font-medium text-foreground">
              Written by {book.author}
            </p>
          </div>

          <p className="text-base text-muted-foreground leading-relaxed max-w-2xl">
            {book.description}
          </p>

          {book.themes.length > 0 && (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Subjects:</span>
              {book.themes.map((theme, i) => (
                <span key={theme} className="inline-flex items-center gap-3">
                  <Link
                    href={`/books?theme=${encodeURIComponent(theme)}`}
                    className="hover:text-primary underline underline-offset-4 decoration-border hover:decoration-primary transition-colors"
                  >
                    {theme}
                  </Link>
                  {i < book.themes.length - 1 && <span aria-hidden="true">·</span>}
                </span>
              ))}
            </div>
          )}

          {/* Metrics Row */}
          <div className="grid grid-cols-3 gap-6 py-5 border-y border-border max-w-lg tabular-nums">
            <div>
              <p className="font-serif text-2xl font-semibold text-foreground">
                {book.totalVolumes}
              </p>
              <p className="text-xs text-muted-foreground">
                {book.totalVolumes === 1 ? "Volume" : "Volumes"}
              </p>
            </div>
            <div>
              <p className="font-serif text-2xl font-semibold text-foreground">
                {book.totalChapters}
              </p>
              <p className="text-xs text-muted-foreground">Chapters</p>
            </div>
            <div>
              <p className="font-serif text-2xl font-semibold text-foreground">
                ~{estimatedHours}h
              </p>
              <p className="text-xs text-muted-foreground">Reading Time</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href={firstHref}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
            >
              <BookOpen className="h-4 w-4" />
              <span>Start Reading</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Front Matter */}
      {book.frontmatter.length > 0 && (
        <section className="space-y-4 pt-8 border-t border-border">
          <h2 className="font-serif text-2xl font-semibold text-foreground">
            Front Matter
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {book.frontmatter.map((fm) => (
              <Link
                key={fm.slug}
                href={`/books/${book.slug}/frontmatter/${fm.slug}`}
                className="group p-5 rounded-md border border-border bg-card hover:bg-muted/40 transition-colors flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {fm.title}
                  </h3>
                  {fm.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {fm.description}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground tabular-nums pt-1">
                    {fm.readingTimeMinutes} min read
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0 mt-1" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Multi-Volume Table of Contents */}
      <section className="space-y-10 pt-8 border-t border-border">
        <div className="space-y-1">
          <h2 className="font-serif text-2xl font-semibold text-foreground">
            Volumes, Parts &amp; Chapters
          </h2>
          <p className="text-sm text-muted-foreground">
            Read any volume, part, or chapter directly in sequence.
          </p>
        </div>

        <div className="space-y-10">
          {book.volumes.map((vol) => (
            <div
              key={vol.slug}
              className="rounded-md border border-border bg-card p-6 sm:p-8 space-y-8"
            >
              <div className="pb-6 border-b border-border">
                <div className="space-y-1.5">
                  <h3 className="font-serif text-2xl font-semibold text-foreground">
                    {vol.title}
                  </h3>
                  {vol.subtitle && (
                    <p className="text-sm font-medium text-primary">
                      {vol.subtitle}
                    </p>
                  )}
                  {vol.description && (
                    <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
                      {vol.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-8">
                {vol.parts.map((part) => (
                  <div key={part.slug} className="space-y-4">
                    <div>
                      <Link
                        href={`/books/${book.slug}/${vol.slug}/${part.slug}`}
                        className="font-serif text-lg font-semibold text-foreground hover:text-primary transition-colors"
                      >
                        Part {part.number}: {part.title}
                      </Link>
                      {part.description && (
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {part.description}
                        </p>
                      )}
                    </div>

                    <div className="divide-y divide-border rounded-md border border-border bg-background">
                      {part.chapters.map((ch) => (
                        <Link
                          key={ch.slug}
                          href={`/books/${book.slug}/${vol.slug}/${part.slug}/${ch.slug}`}
                          className="group flex items-start justify-between gap-4 p-4 hover:bg-muted/40 transition-colors"
                        >
                          <div className="flex items-baseline gap-4 min-w-0">
                            <span className="font-mono text-xs text-muted-foreground tabular-nums shrink-0">
                              {part.number}.{ch.order}
                            </span>
                            <div className="space-y-1 min-w-0">
                              <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                                {ch.title}
                              </p>
                              {ch.description && (
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                  {ch.description}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0 text-xs text-muted-foreground tabular-nums">
                            <span>{ch.readingTimeMinutes} min</span>
                            <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
