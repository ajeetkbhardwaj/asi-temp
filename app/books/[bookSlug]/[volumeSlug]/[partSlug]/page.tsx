import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getAllBooks, getPartContent } from "@/lib/books";
import { MdxContent } from "@/components/mdx-content";
import { ReaderSidebar } from "@/components/reader-sidebar";

interface PartPageProps {
  params: Promise<{ bookSlug: string; volumeSlug: string; partSlug: string }>;
}

export function generateStaticParams() {
  const paths: { bookSlug: string; volumeSlug: string; partSlug: string }[] = [];
  for (const book of getAllBooks()) {
    for (const vol of book.volumes) {
      for (const part of vol.parts) {
        paths.push({
          bookSlug: book.slug,
          volumeSlug: vol.slug,
          partSlug: part.slug,
        });
      }
    }
  }
  return paths;
}

export async function generateMetadata({
  params,
}: PartPageProps): Promise<Metadata> {
  const { bookSlug, volumeSlug, partSlug } = await params;
  const data = getPartContent(bookSlug, volumeSlug, partSlug);
  if (!data) return { title: "Part Not Found — Kumar Press" };
  return {
    title: `Part ${data.part.number}: ${data.part.title} · ${data.book.title} — Kumar Press`,
    description: data.part.description,
  };
}

export default async function PartPage({ params }: PartPageProps) {
  const { bookSlug, volumeSlug, partSlug } = await params;
  const data = getPartContent(bookSlug, volumeSlug, partSlug);
  if (!data) notFound();

  const { book, volume, part, introContent } = data;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
        <div className="lg:col-span-3">
          <ReaderSidebar
            book={book}
            activeVolumeSlug={volume.slug}
            activePartSlug={part.slug}
          />
        </div>

        <div className="lg:col-span-9 max-w-3xl space-y-10">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground no-print"
          >
            <Link href="/books" className="hover:text-foreground">
              Books
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href={`/books/${book.slug}`} className="hover:text-foreground">
              {book.title}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span>{volume.title}</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground font-medium">
              Part {part.number}
            </span>
          </nav>

          {/* Part Header */}
          <header className="space-y-4 pb-8 border-b border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground tabular-nums">
              <span>{volume.title}</span>
              <span aria-hidden="true">·</span>
              <span>Part {part.number}</span>
              <span aria-hidden="true">·</span>
              <span>{part.chapters.length} Chapters</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground leading-tight">
              Part {part.number}: {part.title}
            </h1>
            {part.description && (
              <p className="text-base text-muted-foreground leading-relaxed">
                {part.description}
              </p>
            )}
          </header>

          {/* Optional Part Intro MDX */}
          {introContent && (
            <article>
              <MdxContent source={introContent} />
            </article>
          )}

          {/* Chapters List */}
          <section className="space-y-4 pt-4">
            <h2 className="font-serif text-2xl font-semibold text-foreground">
              Chapters in Part {part.number}
            </h2>
            <div className="divide-y divide-border rounded-md border border-border bg-card">
              {part.chapters.map((ch) => (
                <Link
                  key={ch.slug}
                  href={`/books/${book.slug}/${volume.slug}/${part.slug}/${ch.slug}`}
                  className="group flex items-start justify-between gap-4 p-5 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-baseline gap-4 min-w-0">
                    <span className="font-mono text-xs text-muted-foreground tabular-nums shrink-0">
                      {part.number}.{ch.order}
                    </span>
                    <div className="space-y-1 min-w-0">
                      <p className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                        {ch.title}
                      </p>
                      {ch.description && (
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {ch.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 text-xs text-muted-foreground tabular-nums mt-1">
                    <span>{ch.readingTimeMinutes} min</span>
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
