import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  getAllArticles,
  getAllBooks,
  getArticleBySlug,
} from "@/lib/books";
import { MdxContent } from "@/components/mdx-content";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Essay Not Found — Kumar Press" };
  return {
    title: `${article.title} — Kumar Press`,
    description: article.description,
  };
}

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const relatedBooks = getAllBooks().slice(0, 2);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 lg:py-14 space-y-12">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-xs text-muted-foreground no-print"
      >
        <Link href="/articles" className="hover:text-foreground">
          Articles
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium truncate">
          {article.title}
        </span>
      </nav>

      <header className="space-y-5 pb-8 border-b border-border">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground tabular-nums">
          <span>{article.theme}</span>
          <span aria-hidden="true">·</span>
          <span>{article.publishedAt}</span>
          <span aria-hidden="true">·</span>
          <span>{article.readingTimeMinutes} min read</span>
          <span aria-hidden="true">·</span>
          <span>By {article.author}</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground leading-tight">
          {article.title}
        </h1>

        {article.description && (
          <p className="text-lg text-muted-foreground leading-relaxed">
            {article.description}
          </p>
        )}
      </header>

      <article className="max-w-3xl">
        <MdxContent source={article.content} />
      </article>

      <section className="pt-10 border-t border-border space-y-6 no-print">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl font-semibold text-foreground">
            Explore Related Books
          </h2>
          <Link
            href="/articles"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>All Articles</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {relatedBooks.map((book) => (
            <Link
              key={book.slug}
              href={`/books/${book.slug}`}
              className="p-5 rounded-md border border-border bg-card hover:bg-muted/40 transition-colors space-y-2"
            >
              <p className="text-xs text-muted-foreground">
                {book.category} · {book.totalVolumes} Volumes
              </p>
              <h3 className="font-serif text-lg font-semibold text-foreground">
                {book.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {book.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
