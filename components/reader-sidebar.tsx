"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, ListTree } from "lucide-react";
import type { BookMeta } from "@/lib/books";
import { cn } from "@/lib/utils";

interface ReaderSidebarProps {
  book: BookMeta;
  activeVolumeSlug?: string;
  activePartSlug?: string;
  activeChapterSlug?: string;
  activeFrontmatterSlug?: string;
}

export function ReaderSidebar({
  book,
  activeVolumeSlug,
  activePartSlug,
  activeChapterSlug,
  activeFrontmatterSlug,
}: ReaderSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navContent = (
    <div className="space-y-6">
      <div className="pb-4 border-b border-border">
        <Link
          href={`/books/${book.slug}`}
          className="font-serif text-base font-semibold text-foreground hover:text-primary transition-colors block"
        >
          {book.title}
        </Link>
        <p className="text-xs text-muted-foreground mt-1">By {book.author}</p>
      </div>

      {book.frontmatter.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground tracking-wide">
            Front Matter
          </p>
          <ul className="space-y-1">
            {book.frontmatter.map((fm) => {
              const active = activeFrontmatterSlug === fm.slug;
              return (
                <li key={fm.slug}>
                  <Link
                    href={`/books/${book.slug}/frontmatter/${fm.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "block px-2.5 py-1.5 rounded-sm text-sm transition-colors",
                      active
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    {fm.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="space-y-5">
        {book.volumes.map((vol) => (
          <div key={vol.slug} className="space-y-3">
            <p className="text-xs font-semibold text-foreground">
              {vol.title}
            </p>
            <div className="space-y-3 pl-2 border-l border-border">
              {vol.parts.map((part) => {
                const isPartActive =
                  activeVolumeSlug === vol.slug && activePartSlug === part.slug;
                return (
                  <div key={part.slug} className="space-y-1.5">
                    <Link
                      href={`/books/${book.slug}/${vol.slug}/${part.slug}`}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "block px-2 py-1 text-xs font-medium rounded-sm transition-colors",
                        isPartActive && !activeChapterSlug
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Part {part.number}: {part.title}
                    </Link>

                    <ul className="space-y-0.5 pl-2">
                      {part.chapters.map((ch) => {
                        const isChActive =
                          isPartActive && activeChapterSlug === ch.slug;
                        return (
                          <li key={ch.slug}>
                            <Link
                              href={`/books/${book.slug}/${vol.slug}/${part.slug}/${ch.slug}`}
                              onClick={() => setMobileOpen(false)}
                              className={cn(
                                "flex items-baseline gap-2 px-2 py-1.5 rounded-sm text-sm transition-colors",
                                isChActive
                                  ? "bg-primary text-primary-foreground font-medium"
                                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
                              )}
                            >
                              <span className="font-mono text-[11px] opacity-75 shrink-0 tabular-nums">
                                {part.number}.{ch.order}
                              </span>
                              <span className="leading-snug">{ch.title}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <aside className="no-print">
      {/* Mobile Toggle */}
      <div className="lg:hidden mb-6">
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-md border border-border bg-card text-sm font-medium text-foreground"
        >
          <span className="inline-flex items-center gap-2">
            <ListTree className="h-4 w-4 text-primary" />
            <span>Book Table of Contents</span>
          </span>
          {mobileOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
        {mobileOpen && (
          <div className="mt-2 p-4 rounded-md border border-border bg-card">
            {navContent}
          </div>
        )}
      </div>

      {/* Desktop Sticky Sidebar */}
      <div className="hidden lg:block sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-4">
        {navContent}
      </div>
    </aside>
  );
}
