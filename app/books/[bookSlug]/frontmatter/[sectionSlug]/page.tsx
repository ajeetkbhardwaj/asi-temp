import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getAllBooks, getFrontmatterContent } from "@/lib/books";
import { MdxContent } from "@/components/mdx-content";
import { ReaderSidebar } from "@/components/reader-sidebar";

interface FrontmatterPageProps {
  params: Promise<{ bookSlug: string; sectionSlug: string }>;
}

export function generateStaticParams() {
  const paths: { bookSlug: string; sectionSlug: string }[] = [];
  for (const book of getAllBooks()) {
    for (const fm of book.frontmatter) {
      paths.push({ bookSlug: book.slug, sectionSlug: fm.slug });
    }
  }
  return paths;
}

export async function generateMetadata({
  params,
}: FrontmatterPageProps): Promise<Metadata> {
  const { bookSlug, sectionSlug } = await params;
  const data = getFrontmatterContent(bookSlug, sectionSlug);
  if (!data) return { title: "Section Not Found — Kumar Press" };
  return {
    title: `${data.section.title} · ${data.book.title} — Kumar Press`,
    description: data.section.description,
  };
}

export default async function FrontmatterPage({
  params,
}: FrontmatterPageProps) {
  const { bookSlug, sectionSlug } = await params;
  const data = getFrontmatterContent(bookSlug, sectionSlug);
  if (!data) notFound();

  const { book, section, content, prevSection, nextSection, firstChapter } =
    data;

  const nextTarget = nextSection
    ? {
        href: `/books/${book.slug}/frontmatter/${nextSection.slug}`,
        label: nextSection.title,
      }
    : firstChapter
      ? {
          href: firstChapter.href,
          label: `Chapter 1: ${firstChapter.chapterTitle}`,
        }
      : null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
        <div className="lg:col-span-3">
          <ReaderSidebar book={book} activeFrontmatterSlug={section.slug} />
        </div>

        <div className="lg:col-span-9 max-w-3xl">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-8 no-print"
          >
            <Link href="/books" className="hover:text-foreground">
              Books
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href={`/books/${book.slug}`} className="hover:text-foreground">
              {book.title}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground font-medium">{section.title}</span>
          </nav>

          {/* Header */}
          <header className="space-y-4 pb-8 mb-8 border-b border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground tabular-nums">
              <span>Front Matter</span>
              <span aria-hidden="true">·</span>
              <span>{section.readingTimeMinutes} min read</span>
              <span aria-hidden="true">·</span>
              <span>By {book.author}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground leading-tight">
              {section.title}
            </h1>
            {section.description && (
              <p className="text-base text-muted-foreground leading-relaxed">
                {section.description}
              </p>
            )}
          </header>

          {/* Prose */}
          <article>
            <MdxContent source={content} />
          </article>

          {/* Prev / Next Navigation */}
          <nav className="mt-14 pt-8 border-t border-border flex flex-col sm:flex-row justify-between gap-4 no-print">
            {prevSection ? (
              <Link
                href={`/books/${book.slug}/frontmatter/${prevSection.slug}`}
                className="flex items-center gap-3 p-4 rounded-md border border-border bg-card hover:bg-muted/40 transition-colors"
              >
                <ChevronLeft className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Previous</p>
                  <p className="text-sm font-medium text-foreground">
                    {prevSection.title}
                  </p>
                </div>
              </Link>
            ) : (
              <Link
                href={`/books/${book.slug}`}
                className="flex items-center gap-3 p-4 rounded-md border border-border bg-card hover:bg-muted/40 transition-colors"
              >
                <ChevronLeft className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Back</p>
                  <p className="text-sm font-medium text-foreground">
                    Book Overview
                  </p>
                </div>
              </Link>
            )}

            {nextTarget && (
              <Link
                href={nextTarget.href}
                className="flex items-center justify-end gap-3 p-4 rounded-md border border-border bg-card hover:bg-muted/40 transition-colors text-right"
              >
                <div>
                  <p className="text-xs text-muted-foreground">Next</p>
                  <p className="text-sm font-medium text-foreground">
                    {nextTarget.label}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </Link>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
}
