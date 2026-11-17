import type { Metadata } from "next";
import { getAllArticles } from "@/lib/books";
import { ArticlesCatalog } from "@/components/articles-catalog";

export const metadata: Metadata = {
  title: "Articles & Essays — Kumar Press",
  description:
    "Essays and columns by Ajeet Kumar on software craft, distributed systems, and technical clarity.",
};

export default function ArticlesPage() {
  const articles = getAllArticles();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 lg:py-16 space-y-10">
      <header className="space-y-3 max-w-2xl">
        <p className="text-xs font-semibold text-primary">
          Kumar Press · Essays &amp; Columns
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground">
          Articles &amp; Field Notes
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          Standalone essays by Ajeet Kumar exploring themes across writing
          craft, mental models, and multi-volume publishing.
        </p>
      </header>

      <ArticlesCatalog articles={articles} />
    </div>
  );
}
