"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import type { BookMeta } from "@/lib/books";
import { BookCard } from "@/components/book-card";

interface BooksCatalogProps {
  books: BookMeta[];
  initialTheme?: string;
}

export function BooksCatalog({
  books,
  initialTheme = "All",
}: BooksCatalogProps) {
  const allThemes = useMemo(() => {
    const unique = Array.from(
      new Set(books.flatMap((b) => [b.category, ...b.themes]))
    );
    return ["All", ...unique];
  }, [books]);

  const validInitial = allThemes.includes(initialTheme) ? initialTheme : "All";
  const [selectedFilter, setSelectedFilter] = useState<string>(validInitial);
  const [query, setQuery] = useState<string>("");

  const filteredBooks = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return books.filter((book) => {
      const matchesFilter =
        selectedFilter === "All" ||
        book.category === selectedFilter ||
        book.themes.includes(selectedFilter);
      if (!matchesFilter) return false;
      if (!normalized) return true;

      const searchableText = [
        book.title,
        book.subtitle,
        book.description,
        book.author,
        book.category,
        ...book.themes,
        ...book.volumes.flatMap((v) => [
          v.title,
          ...v.parts.flatMap((p) => [
            p.title,
            ...p.chapters.map((c) => c.title),
          ]),
        ]),
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalized);
    });
  }, [books, selectedFilter, query]);

  return (
    <div className="space-y-10">
      {/* Subject Filter & Search Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-border">
        <div
          role="tablist"
          aria-label="Filter books by subject"
          className="flex flex-wrap items-center gap-1 p-1 rounded-md bg-muted border border-border w-fit"
        >
          {allThemes.map((item) => {
            const active = selectedFilter === item;
            return (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedFilter(item)}
                className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>

        <div className="relative w-full lg:w-80 shrink-0">
          <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search books, volumes, or chapters..."
            aria-label="Search catalog"
            className="w-full pl-9 pr-9 py-2.5 text-sm rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-muted-foreground tabular-nums">
        <span>
          Showing {filteredBooks.length} of {books.length}{" "}
          {books.length === 1 ? "book" : "books"}
          {selectedFilter !== "All" ? ` · ${selectedFilter}` : ""}
        </span>
        <span>Authored by Ajeet Kumar</span>
      </div>

      {/* Book Grid */}
      {filteredBooks.length === 0 ? (
        <div className="rounded-md border border-border bg-card p-12 text-center space-y-3">
          <p className="font-serif text-lg text-foreground">
            No matching books or chapters found
          </p>
          <p className="text-sm text-muted-foreground">
            Try clearing your search query or switching back to all subjects.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedFilter("All");
              setQuery("");
            }}
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md border border-border bg-background hover:bg-muted transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBooks.map((book) => (
            <BookCard key={book.slug} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}
