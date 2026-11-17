import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/40 mt-20 no-print">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div className="space-y-2">
            <Link
              href="/"
              className="font-serif text-lg font-semibold text-foreground"
            >
              Kumar Press
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Independent digital bookstore and publishing studio by Ajeet Kumar.
              Multi-volume books and essays written for focused online reading.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground">Catalog</p>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li>
                <Link href="/books" className="hover:text-foreground transition-colors">
                  Books
                </Link>
              </li>
              <li>
                <Link href="/articles" className="hover:text-foreground transition-colors">
                  Articles &amp; Essays
                </Link>
              </li>
              <li>
                <Link href="/author" className="hover:text-foreground transition-colors">
                  About Ajeet Kumar
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2 md:text-right">
            <p className="text-sm font-semibold text-foreground">Publishing</p>
            <p className="text-sm text-muted-foreground">
              Authored &amp; curated by Ajeet Kumar
            </p>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Kumar Press. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
