import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen } from "lucide-react";
import type { BookMeta } from "@/lib/books";

interface BookCardProps {
  book: BookMeta;
}

export function BookCard({ book }: BookCardProps) {
  const firstVolume = book.volumes[0];
  const firstPart = firstVolume?.parts[0];
  const firstChapter = firstPart?.chapters[0];
  const startHref =
    firstVolume && firstPart && firstChapter
      ? `/books/${book.slug}/${firstVolume.slug}/${firstPart.slug}/${firstChapter.slug}`
      : `/books/${book.slug}`;

  return (
    <article className="group flex flex-col justify-between rounded-md border border-border bg-card overflow-hidden transition-transform duration-200 hover:-translate-y-0.5">
      <div>
        <Link
          href={`/books/${book.slug}`}
          className="block relative aspect-[3/4] w-full overflow-hidden bg-muted border-b border-border"
        >
          <Image
            src={book.coverImage}
            alt={`${book.title} cover`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            referrerPolicy="no-referrer"
          />
          <div className="sr-only">Open {book.title}</div>
        </Link>

        <div className="p-6 space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground tabular-nums">
            <span>{book.category}</span>
            <span aria-hidden="true">·</span>
            <span>
              {book.totalVolumes} {book.totalVolumes === 1 ? "Volume" : "Volumes"}
            </span>
            <span aria-hidden="true">·</span>
            <span>{book.totalChapters} Chapters</span>
          </div>

          <div className="space-y-1.5">
            <h3 className="font-serif text-xl font-semibold text-foreground leading-snug">
              <Link
                href={`/books/${book.slug}`}
                className="hover:text-primary transition-colors"
              >
                {book.title}
              </Link>
            </h3>
            <p className="text-xs font-medium text-muted-foreground">
              By {book.author} · {book.publishedYear}
            </p>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {book.description}
          </p>
        </div>
      </div>

      <div className="px-6 pb-6 pt-2 flex items-center justify-between gap-3">
        <Link
          href={startHref}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
        >
          <BookOpen className="h-4 w-4" />
          <span>Read Book</span>
        </Link>

        <Link
          href={`/books/${book.slug}`}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-border bg-background text-xs font-medium text-foreground hover:bg-muted transition-colors whitespace-nowrap shrink-0"
        >
          <span>Contents</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
}
