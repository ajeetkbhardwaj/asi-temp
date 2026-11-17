"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, X } from "lucide-react";
import type { ArticleMeta } from "@/lib/books";

interface ArticlesCatalogProps {
  articles: ArticleMeta[];
}

export function ArticlesCatalog({ articles }: ArticlesCatalogProps) {
  const [selectedTheme, setSelectedTheme] = useState<string>("All");
  const [query, setQuery] = useState<string>("");

  const themes = useMemo(() => {
    const unique = Array.from(new Set(articles.map((a) => a.theme)));
    return ["All", ...unique];
  }, [articles]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((a) => {
      if (selectedTheme !== "All" && a.theme !== selectedTheme) return false;
      if (!q) return true;
      return `${a.title} ${a.description} ${a.theme}`.toLowerCase().includes(q);
    });
  }, [articles, selectedTheme, query]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border">
        <div
          role="tablist"
          aria-label="Filter articles by theme"
          className="flex flex-wrap items-center gap-1 p-1 rounded-md bg-muted border border-border w-fit"
        >
          {themes.map((theme) => {
            const active = selectedTheme === theme;
            return (
              <button
                key={theme}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedTheme(theme)}
                className={`px-3.5 py-2 text-xs font-medium rounded-sm transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  active
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {theme}
              </button>
            );
          })}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles and essays..."
            aria-label="Search articles"
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

      {filtered.length === 0 ? (
        <div className="rounded-md border border-border bg-card p-10 text-center space-y-2">
          <p className="font-serif text-lg text-foreground">
            No matching essays found
          </p>
          <p className="text-sm text-muted-foreground">
            Clear your search or select another theme.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border rounded-md border border-border bg-card">
          {filtered.map((article) => (
            <article
              key={article.slug}
              className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground tabular-nums">
                  <span>{article.theme}</span>
                  <span aria-hidden="true">·</span>
                  <span>{article.publishedAt}</span>
                  <span aria-hidden="true">·</span>
                  <span>{article.readingTimeMinutes} min read</span>
                </div>

                <h2 className="font-serif text-2xl font-semibold text-foreground">
                  <Link
                    href={`/articles/${article.slug}`}
                    className="hover:text-primary transition-colors"
                  >
                    {article.title}
                  </Link>
                </h2>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {article.description}
                </p>
              </div>

              <div className="shrink-0">
                <Link
                  href={`/articles/${article.slug}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
                >
                  <span>Read Essay</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
