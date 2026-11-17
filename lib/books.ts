import fs from "fs";
import path from "path";
import { cache } from "react";
import matter from "gray-matter";

const CONTENTS_DIR = path.join(process.cwd(), "contents");

export interface ChapterMeta {
  slug: string;
  title: string;
  description: string;
  order: number;
  wordCount: number;
  readingTimeMinutes: number;
  filePath: string;
  draft?: boolean;
}

export interface PartMeta {
  slug: string;
  number: number;
  title: string;
  description: string;
  order: number;
  hasIntro: boolean;
  introFilePath?: string;
  chapters: ChapterMeta[];
}

export interface VolumeMeta {
  slug: string;
  number: number;
  title: string;
  subtitle?: string;
  description: string;
  order: number;
  parts: PartMeta[];
}

export interface FrontmatterSection {
  slug: string;
  title: string;
  description: string;
  order: number;
  wordCount: number;
  readingTimeMinutes: number;
  filePath: string;
}

export interface BookMeta {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  author: string;
  category: string;
  themes: string[];
  edition: string;
  publishedYear: string;
  coverImage: string;
  priceLabel: string;
  featured: boolean;
  order: number;
  frontmatter: FrontmatterSection[];
  volumes: VolumeMeta[];
  totalChapters: number;
  totalVolumes: number;
  totalWords: number;
}

export interface ArticleMeta {
  slug: string;
  title: string;
  description: string;
  theme: string;
  publishedAt: string;
  author: string;
  order: number;
  wordCount: number;
  readingTimeMinutes: number;
  filePath: string;
}

export interface FlatChapterRef {
  bookSlug: string;
  volumeSlug: string;
  volumeTitle: string;
  partSlug: string;
  partTitle: string;
  chapterSlug: string;
  chapterTitle: string;
  href: string;
}

function readJsonSafe<T>(filePath: string): Partial<T> {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, "utf-8")) as Partial<T>;
    }
  } catch {
    // Fallback to defaults if JSON is malformed
  }
  return {};
}

function extractNumericSuffix(slug: string): number {
  const match = slug.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 999;
}

function humanizeSlug(slug: string): string {
  return slug
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function stripMdxBoilerplate(content: string): string {
  return content
    .replace(/^import\s+.*?;?\s*$/gm, "")
    .replace(/^export\s+const\s+metadata\s*=\s*\{[\s\S]*?\};?\s*$/gm, "")
    .replace(/<\/?(?:BookLayout|PartLayout)[^>]*>/g, "")
    .trim();
}

function computeStats(rawMarkdown: string): { wordCount: number; readingTimeMinutes: number } {
  const clean = stripMdxBoilerplate(rawMarkdown)
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*_`[\]()]/g, " ");
  const words = clean.split(/\s+/).filter(Boolean).length;
  return {
    wordCount: words,
    readingTimeMinutes: Math.max(1, Math.ceil(words / 220)),
  };
}

function parseMdxFile(filePath: string) {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const cleanContent = stripMdxBoilerplate(content);
  const stats = computeStats(cleanContent);
  return {
    frontmatter: data as Record<string, unknown>,
    content: cleanContent,
    ...stats,
  };
}

function loadBookMeta(bookSlug: string): BookMeta | null {
  const bookDir = path.join(CONTENTS_DIR, bookSlug);
  if (!fs.existsSync(bookDir) || !fs.statSync(bookDir).isDirectory()) {
    return null;
  }

  const bookJson = readJsonSafe<{
    title: string;
    subtitle: string;
    description: string;
    author: string;
    category: string;
    themes: string[];
    edition: string;
    publishedYear: string;
    coverImage: string;
    priceLabel: string;
    featured: boolean;
    order: number;
  }>(path.join(bookDir, "book.json"));

  const entries = fs.readdirSync(bookDir, { withFileTypes: true });

  // Frontmatter MDX files at book root (e.g. foreword.mdx, introduction.mdx)
  const frontmatterOrderMap: Record<string, number> = {
    preface: 1,
    foreword: 2,
    introduction: 3,
  };

  const frontmatter: FrontmatterSection[] = entries
    .filter((e) => e.isFile() && e.name.endsWith(".mdx"))
    .map((e) => {
      const slug = e.name.replace(/\.mdx$/, "");
      const filePath = path.join(bookDir, e.name);
      const parsed = parseMdxFile(filePath);
      const order =
        typeof parsed.frontmatter.order === "number"
          ? parsed.frontmatter.order
          : frontmatterOrderMap[slug] ?? 10;
      return {
        slug,
        title:
          typeof parsed.frontmatter.title === "string"
            ? parsed.frontmatter.title
            : humanizeSlug(slug),
        description:
          typeof parsed.frontmatter.description === "string"
            ? parsed.frontmatter.description
            : "",
        order,
        wordCount: parsed.wordCount,
        readingTimeMinutes: parsed.readingTimeMinutes,
        filePath,
      };
    })
    .sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug));

  // Volumes (directories inside book directory)
  const volumes: VolumeMeta[] = entries
    .filter((e) => e.isDirectory() && !e.name.startsWith("."))
    .map((volEntry) => {
      const volSlug = volEntry.name;
      const volDir = path.join(bookDir, volSlug);
      const volJson = readJsonSafe<{
        number: number;
        title: string;
        subtitle: string;
        description: string;
        order: number;
      }>(path.join(volDir, "volume.json"));

      const volNum =
        typeof volJson.number === "number"
          ? volJson.number
          : extractNumericSuffix(volSlug);
      const volOrder =
        typeof volJson.order === "number" ? volJson.order : volNum;

      const partEntries = fs.readdirSync(volDir, { withFileTypes: true });
      const parts: PartMeta[] = partEntries
        .filter((p) => p.isDirectory() && !p.name.startsWith("."))
        .map((partEntry) => {
          const partSlug = partEntry.name;
          const partDir = path.join(volDir, partSlug);
          const partJson = readJsonSafe<{
            number: number;
            title: string;
            description: string;
            order: number;
          }>(path.join(partDir, "part.json"));

          const partNum =
            typeof partJson.number === "number"
              ? partJson.number
              : extractNumericSuffix(partSlug);
          const partOrder =
            typeof partJson.order === "number" ? partJson.order : partNum;

          const partFiles = fs.readdirSync(partDir, { withFileTypes: true });
          const introFile = partFiles.find(
            (f) => f.isFile() && (f.name === "index.mdx" || f.name === "overview.mdx")
          );

          const chapters: ChapterMeta[] = partFiles
            .filter(
              (f) =>
                f.isFile() &&
                f.name.endsWith(".mdx") &&
                f.name !== "index.mdx" &&
                f.name !== "overview.mdx"
            )
            .map((chFile) => {
              const chSlug = chFile.name.replace(/\.mdx$/, "");
              const filePath = path.join(partDir, chFile.name);
              const parsed = parseMdxFile(filePath);
              const chOrder =
                typeof parsed.frontmatter.order === "number"
                  ? parsed.frontmatter.order
                  : extractNumericSuffix(chSlug);

              return {
                slug: chSlug,
                title:
                  typeof parsed.frontmatter.title === "string"
                    ? parsed.frontmatter.title
                    : humanizeSlug(chSlug),
                description:
                  typeof parsed.frontmatter.description === "string"
                    ? parsed.frontmatter.description
                    : "",
                order: chOrder,
                wordCount: parsed.wordCount,
                readingTimeMinutes: parsed.readingTimeMinutes,
                filePath,
                draft: Boolean(parsed.frontmatter.draft),
              };
            })
            .sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug));

          return {
            slug: partSlug,
            number: partNum,
            title: partJson.title || humanizeSlug(partSlug),
            description: partJson.description || "",
            order: partOrder,
            hasIntro: Boolean(introFile),
            introFilePath: introFile ? path.join(partDir, introFile.name) : undefined,
            chapters,
          };
        })
        .sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug));

      return {
        slug: volSlug,
        number: volNum,
        title: volJson.title || humanizeSlug(volSlug),
        subtitle: volJson.subtitle,
        description: volJson.description || "",
        order: volOrder,
        parts,
      };
    })
    .sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug));

  const totalChapters = volumes.reduce(
    (sum, v) => sum + v.parts.reduce((pSum, p) => pSum + p.chapters.length, 0),
    0
  );
  const totalWords =
    frontmatter.reduce((sum, f) => sum + f.wordCount, 0) +
    volumes.reduce(
      (sum, v) =>
        sum +
        v.parts.reduce(
          (pSum, p) => pSum + p.chapters.reduce((cSum, c) => cSum + c.wordCount, 0),
          0
        ),
      0
    );

  return {
    slug: bookSlug,
    title: bookJson.title || humanizeSlug(bookSlug),
    subtitle: bookJson.subtitle || "",
    description: bookJson.description || "",
    author: bookJson.author || "Ajeet Kumar",
    category: bookJson.category || "Engineering & Craft",
    themes: Array.isArray(bookJson.themes)
      ? bookJson.themes
      : [bookJson.category || "Engineering & Craft"],
    edition: bookJson.edition || "First Edition",
    publishedYear: bookJson.publishedYear || "2026",
    coverImage: bookJson.coverImage || "/images/book_cover_technical_clarity.jpg",
    priceLabel: bookJson.priceLabel || "Open Digital Edition",
    featured: Boolean(bookJson.featured),
    order:
      typeof bookJson.order === "number"
        ? bookJson.order
        : extractNumericSuffix(bookSlug),
    frontmatter,
    volumes,
    totalChapters,
    totalVolumes: volumes.length,
    totalWords,
  };
}

export const getAllBooks = cache((): BookMeta[] => {
  if (!fs.existsSync(CONTENTS_DIR)) return [];
  const entries = fs.readdirSync(CONTENTS_DIR, { withFileTypes: true });
  return entries
    .filter(
      (e) =>
        e.isDirectory() && !e.name.startsWith(".") && e.name !== "articles"
    )
    .map((e) => loadBookMeta(e.name))
    .filter((b): b is BookMeta => b !== null)
    .sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug));
});

export const getAllArticles = cache((): ArticleMeta[] => {
  const articlesDir = path.join(CONTENTS_DIR, "articles");
  if (!fs.existsSync(articlesDir)) return [];
  const files = fs.readdirSync(articlesDir, { withFileTypes: true });
  return files
    .filter((f) => f.isFile() && f.name.endsWith(".mdx"))
    .map((f) => {
      const slug = f.name.replace(/\.mdx$/, "");
      const filePath = path.join(articlesDir, f.name);
      const parsed = parseMdxFile(filePath);
      return {
        slug,
        title:
          typeof parsed.frontmatter.title === "string"
            ? parsed.frontmatter.title
            : humanizeSlug(slug),
        description:
          typeof parsed.frontmatter.description === "string"
            ? parsed.frontmatter.description
            : "",
        theme:
          typeof parsed.frontmatter.theme === "string"
            ? parsed.frontmatter.theme
            : "Essays",
        publishedAt:
          typeof parsed.frontmatter.publishedAt === "string"
            ? parsed.frontmatter.publishedAt
            : "2026",
        author:
          typeof parsed.frontmatter.author === "string"
            ? parsed.frontmatter.author
            : "Ajeet Kumar",
        order:
          typeof parsed.frontmatter.order === "number"
            ? parsed.frontmatter.order
            : 99,
        wordCount: parsed.wordCount,
        readingTimeMinutes: parsed.readingTimeMinutes,
        filePath,
      };
    })
    .sort((a, b) => a.order - b.order || b.publishedAt.localeCompare(a.publishedAt));
});

export const getArticleBySlug = cache(
  (slug: string): (ArticleMeta & { content: string }) | null => {
    const article = getAllArticles().find((a) => a.slug === slug);
    if (!article) return null;
    const parsed = parseMdxFile(article.filePath);
    return {
      ...article,
      content: parsed.content,
    };
  }
);

export const getBookBySlug = cache((bookSlug: string): BookMeta | null => {
  return loadBookMeta(bookSlug);
});

export function getBookFlatChapters(book: BookMeta): FlatChapterRef[] {
  const list: FlatChapterRef[] = [];
  for (const vol of book.volumes) {
    for (const part of vol.parts) {
      for (const ch of part.chapters) {
        list.push({
          bookSlug: book.slug,
          volumeSlug: vol.slug,
          volumeTitle: vol.title,
          partSlug: part.slug,
          partTitle: part.title,
          chapterSlug: ch.slug,
          chapterTitle: ch.title,
          href: `/books/${book.slug}/${vol.slug}/${part.slug}/${ch.slug}`,
        });
      }
    }
  }
  return list;
}

export function getChapterContent(
  bookSlug: string,
  volumeSlug: string,
  partSlug: string,
  chapterSlug: string
) {
  const book = getBookBySlug(bookSlug);
  if (!book) return null;

  const volume = book.volumes.find((v) => v.slug === volumeSlug);
  if (!volume) return null;

  const part = volume.parts.find((p) => p.slug === partSlug);
  if (!part) return null;

  const chapter = part.chapters.find((c) => c.slug === chapterSlug);
  if (!chapter) return null;

  const parsed = parseMdxFile(chapter.filePath);
  const flat = getBookFlatChapters(book);
  const idx = flat.findIndex(
    (item) =>
      item.volumeSlug === volumeSlug &&
      item.partSlug === partSlug &&
      item.chapterSlug === chapterSlug
  );

  return {
    book,
    volume,
    part,
    chapter,
    content: parsed.content,
    prevChapter: idx > 0 ? flat[idx - 1] : null,
    nextChapter: idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : null,
  };
}

export function getPartContent(
  bookSlug: string,
  volumeSlug: string,
  partSlug: string
) {
  const book = getBookBySlug(bookSlug);
  if (!book) return null;

  const volume = book.volumes.find((v) => v.slug === volumeSlug);
  if (!volume) return null;

  const part = volume.parts.find((p) => p.slug === partSlug);
  if (!part) return null;

  const introContent = part.introFilePath
    ? parseMdxFile(part.introFilePath).content
    : null;

  return {
    book,
    volume,
    part,
    introContent,
  };
}

export function getFrontmatterContent(bookSlug: string, sectionSlug: string) {
  const book = getBookBySlug(bookSlug);
  if (!book) return null;

  const idx = book.frontmatter.findIndex((f) => f.slug === sectionSlug);
  if (idx === -1) return null;

  const section = book.frontmatter[idx];
  const parsed = parseMdxFile(section.filePath);
  const flat = getBookFlatChapters(book);

  return {
    book,
    section,
    content: parsed.content,
    prevSection: idx > 0 ? book.frontmatter[idx - 1] : null,
    nextSection:
      idx < book.frontmatter.length - 1 ? book.frontmatter[idx + 1] : null,
    firstChapter: flat.length > 0 ? flat[0] : null,
  };
}
