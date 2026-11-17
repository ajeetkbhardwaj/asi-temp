import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, FileText } from "lucide-react";
import { getAllArticles, getAllBooks } from "@/lib/books";
import { BookCard } from "@/components/book-card";

export default function HomePage() {
  const books = getAllBooks();
  const articles = getAllArticles().slice(0, 4);
  const totalVolumes = books.reduce((sum, b) => sum + b.totalVolumes, 0);
  const totalChapters = books.reduce((sum, b) => sum + b.totalChapters, 0);
  const allThemes = Array.from(new Set(books.flatMap((b) => b.themes)));

  return (
    <div>
      {/* Section 1: Author & Press Hero Spotlight */}
      <section className="border-b border-border bg-card/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-between space-y-8">
              <div className="space-y-5">
                <p className="text-xs font-semibold tracking-wide text-primary">
                  Kumar Press · Authored by Ajeet Kumar
                </p>
                <h1 className="font-serif text-4xl sm:text-5xl font-semibold tracking-tight text-foreground leading-[1.12]">
                  Books, essays, and multi-volume field guides for builders.
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
                  Explore original books and essays written by Ajeet Kumar—spanning
                  technical clarity, distributed systems, and engineering craft.
                  Read structured editions organized cleanly by volume, part, and chapter.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    href="/books"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>Explore Books</span>
                  </Link>
                  <Link
                    href="/articles"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-border bg-background text-foreground text-sm font-medium hover:bg-muted transition-colors whitespace-nowrap shrink-0"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Read Essays</span>
                  </Link>
                </div>

                <div className="grid grid-cols-3 gap-6 pt-6 border-t border-border tabular-nums">
                  <div>
                    <p className="font-serif text-2xl font-semibold text-foreground">
                      {books.length}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Books Published
                    </p>
                  </div>
                  <div>
                    <p className="font-serif text-2xl font-semibold text-foreground">
                      {totalVolumes}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Volumes
                    </p>
                  </div>
                  <div>
                    <p className="font-serif text-2xl font-semibold text-foreground">
                      {totalChapters + articles.length}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Chapters &amp; Essays
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 relative min-h-[300px] lg:min-h-[440px] rounded-md overflow-hidden border border-border bg-muted">
              <Image
                src="/images/hero_bookstore_press.jpg"
                alt="Kumar Press hardcover volumes and manuscript notebook"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Thematic Directory Strip (inspired by devdutt.com subject index) */}
      <section className="border-b border-border bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-wrap items-center justify-between gap-4">
          <span className="text-xs font-semibold text-muted-foreground">
            Browse by Subject:
          </span>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            {allThemes.map((theme) => (
              <Link
                key={theme}
                href={`/books?theme=${encodeURIComponent(theme)}`}
                className="text-foreground/80 hover:text-primary hover:underline underline-offset-4 transition-colors"
              >
                {theme}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Featured Books Catalog */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 lg:py-20 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-6">
          <div className="space-y-2">
            <h2 className="font-serif text-3xl font-semibold text-foreground">
              Books &amp; Multi-Volume Works
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl">
              Complete digital editions structured across volumes, parts, and
              chapters for focused online reading.
            </p>
          </div>

          <Link
            href="/books"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline underline-offset-4 whitespace-nowrap shrink-0"
          >
            <span>View full catalog</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {books.map((book) => (
            <BookCard key={book.slug} book={book} />
          ))}
        </div>
      </section>

      {/* Section 3: Recent Articles & Essays (inspired by devdutt.com articles showcase) */}
      <section className="border-t border-border bg-card/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 lg:py-20 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-6">
            <div className="space-y-2">
              <h2 className="font-serif text-3xl font-semibold text-foreground">
                Recent Articles &amp; Essays
              </h2>
              <p className="text-sm text-muted-foreground max-w-xl">
                Shorter columns and field notes on clarity, systems thinking, and
                how these books are crafted.
              </p>
            </div>

            <Link
              href="/articles"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline underline-offset-4 whitespace-nowrap shrink-0"
            >
              <span>All essays</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/articles/${article.slug}`}
                className="group p-6 rounded-md border border-border bg-background hover:bg-muted/40 transition-colors flex flex-col justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground tabular-nums">
                    <span>{article.theme}</span>
                    <span aria-hidden="true">·</span>
                    <span>{article.publishedAt}</span>
                    <span aria-hidden="true">·</span>
                    <span>{article.readingTimeMinutes} min read</span>
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {article.description}
                  </p>
                </div>

                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary">
                  <span>Read essay</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: About Author & Publishing Studio */}
      <section className="border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-[340px] rounded-md overflow-hidden border border-border bg-muted">
              <Image
                src="/images/author_studio_desk.jpg"
                alt="Ajeet Kumar writing desk with bound proofs and manuscript pages"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="lg:col-span-7 flex flex-col justify-center space-y-5">
              <p className="text-xs font-semibold text-primary">
                About the Author &amp; Studio
              </p>
              <h2 className="font-serif text-3xl font-semibold text-foreground">
                Written by Ajeet Kumar for long-term clarity
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                Kumar Press exists as a focused home for multi-volume technical
                books and essays. Every work is maintained as structured MDX
                manuscripts so readers can explore concepts sequentially across
                volumes, parts, and chapters with fast navigation.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/author"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md border border-border bg-background text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  <span>About Ajeet Kumar</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
