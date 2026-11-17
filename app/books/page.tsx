import type { Metadata } from "next";
import { getAllBooks } from "@/lib/books";
import { BooksCatalog } from "@/components/books-catalog";

export const metadata: Metadata = {
  title: "Book Catalog — Kumar Press",
  description:
    "Explore all multi-volume books written by Ajeet Kumar. Filter by subject and read by volume, part, and chapter.",
};

interface BooksPageProps {
  searchParams: Promise<{ theme?: string }>;
}

export default async function BooksPage({ searchParams }: BooksPageProps) {
  const books = getAllBooks();
  const { theme } = await searchParams;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 lg:py-16 space-y-10">
      <header className="space-y-3 max-w-2xl">
        <p className="text-xs font-semibold text-primary">
          Kumar Press · Complete Catalog
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground">
          Books &amp; Multi-Volume Editions
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          Browse every book published under Kumar Press by subject, volume, or
          topic and start reading any chapter immediately.
        </p>
      </header>

      <BooksCatalog books={books} initialTheme={theme || "All"} />
    </div>
  );
}
