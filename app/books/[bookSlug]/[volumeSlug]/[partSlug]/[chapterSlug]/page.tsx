import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getAllBooks, getChapterContent } from "@/lib/books";
import { MdxContent } from "@/components/mdx-content";
import { ReaderSidebar } from "@/components/reader-sidebar";

interface ChapterPageProps {
  params: Promise<{
    bookSlug: string;
    volumeSlug: string;
    partSlug: string;
    chapterSlug: string;
  }>;
}

export function generateStaticParams() {
  const paths: {
    bookSlug: string;
    volumeSlug: string;
    partSlug: string;
    chapterSlug: string;
  }[] = [];

  for (const book of getAllBooks()) {
    for (const vol of book.volumes) {
      for (const part of vol.parts) {
        for (const ch of part.chapters) {
          paths.push({
            bookSlug: book.slug,
            volumeSlug: vol.slug,
            partSlug: part.slug,
            chapterSlug: ch.slug,
          });
        }
      }
    }
  }
  return paths;
}

export async function generateMetadata({
  params,
}: ChapterPageProps): Promise<Metadata> {
  const { bookSlug, volumeSlug, partSlug, chapterSlug } = await params;
  const data = getChapterContent(bookSlug, volumeSlug, partSlug, chapterSlug);
  if (!data) return { title: "Chapter Not Found — Kumar Press" };
  return {
    title: `${data.chapter.title} · ${data.book.title} — Kumar Press`,
    description: data.chapter.description,
  };
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { bookSlug, volumeSlug, partSlug, chapterSlug } = await params;
  const data = getChapterContent(bookSlug, volumeSlug, partSlug, chapterSlug);
  if (!data) notFound();

  const { book, volume, part, chapter, content, prevChapter, nextChapter } =
    data;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
        {/* Left Sidebar TOC */}
        <div className="lg:col-span-3">
          <ReaderSidebar
            book={book}
            activeVolumeSlug={volume.slug}
            activePartSlug={part.slug}
            activeChapterSlug={chapter.slug}
          />
        </div>

        {/* Main Reading Column */}
        <div className="lg:col-span-9 max-w-3xl">
          {/* Breadcrumbs */}
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
            <Link
              href={`/books/${book.slug}/${volume.slug}/${part.slug}`}
              className="hover:text-foreground"
            >
              Part {part.number}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground font-medium">
              Chapter {chapter.order}
            </span>
          </nav>

          {/* Chapter Header */}
          <header className="space-y-5 pb-8 mb-10 border-b border-border">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground tabular-nums">
              <span>{volume.title}</span>
              <span aria-hidden="true">·</span>
              <span>
                Part {part.number}, Chapter {chapter.order}
              </span>
              <span aria-hidden="true">·</span>
              <span>{chapter.readingTimeMinutes} min read</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground leading-tight">
              {chapter.title}
            </h1>

            {chapter.description && (
              <p className="text-base text-muted-foreground leading-relaxed">
                {chapter.description}
              </p>
            )}
          </header>

          {/* MDX Prose */}
          <article>
            <MdxContent source={content} />
          </article>

          {/* Prev / Next Chapter Navigation */}
          <nav className="mt-16 pt-8 border-t border-border space-y-6 no-print">
            <div className="flex justify-center">
              <Link
                href={`/books/${book.slug}/${volume.slug}/${part.slug}`}
                className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Back to Part {part.number}: {part.title}
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prevChapter ? (
                <Link
                  href={prevChapter.href}
                  className="flex items-center gap-3 p-4 rounded-md border border-border bg-card hover:bg-muted/40 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Previous</p>
                    <p className="text-sm font-medium text-foreground truncate">
                      {prevChapter.chapterTitle}
                    </p>
                  </div>
                </Link>
              ) : (
                <div />
              )}

              {nextChapter ? (
                <Link
                  href={nextChapter.href}
                  className="flex items-center justify-end gap-3 p-4 rounded-md border border-border bg-card hover:bg-muted/40 transition-colors text-right"
                >
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Next</p>
                    <p className="text-sm font-medium text-foreground truncate">
                      {nextChapter.chapterTitle}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </Link>
              ) : (
                <div />
              )}
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
