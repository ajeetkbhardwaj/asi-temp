import type { MDXComponents } from "mdx/types";
import { cn } from "@/lib/utils";
import React from "react";

export function useMDXComponents(components: MDXComponents = {}): MDXComponents {
  return {
    h1: ({ className, ...props }) => (
      <h1
        className={cn(
          "scroll-m-24 font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-6 mt-8 first:mt-0",
          className
        )}
        {...props}
      />
    ),
    h2: ({ className, ...props }) => (
      <h2
        className={cn(
          "scroll-m-24 font-serif text-2xl font-semibold tracking-tight text-foreground mb-4 mt-10 first:mt-0",
          className
        )}
        {...props}
      />
    ),
    h3: ({ className, ...props }) => (
      <h3
        className={cn(
          "scroll-m-24 font-serif text-xl font-semibold tracking-tight text-foreground mb-3 mt-8",
          className
        )}
        {...props}
      />
    ),
    h4: ({ className, ...props }) => (
      <h4
        className={cn(
          "scroll-m-24 font-sans text-base font-semibold tracking-tight text-foreground mb-2 mt-6",
          className
        )}
        {...props}
      />
    ),
    p: ({ className, ...props }) => (
      <p
        className={cn(
          "leading-relaxed text-foreground/90 mb-5 [&:not(:first-child)]:mt-4",
          className
        )}
        {...props}
      />
    ),
    ul: ({ className, ...props }) => (
      <ul
        className={cn(
          "my-5 ml-6 list-disc space-y-2 text-foreground/90",
          className
        )}
        {...props}
      />
    ),
    ol: ({ className, ...props }) => (
      <ol
        className={cn(
          "my-5 ml-6 list-decimal space-y-2 text-foreground/90",
          className
        )}
        {...props}
      />
    ),
    li: ({ className, ...props }) => (
      <li className={cn("leading-relaxed pl-1", className)} {...props} />
    ),
    blockquote: ({ className, ...props }) => (
      <blockquote
        className={cn(
          "my-7 rounded-md border border-border bg-card px-6 py-4 italic text-muted-foreground",
          className
        )}
        {...props}
      />
    ),
    code: ({ className, ...props }) => {
      const isInPre =
        props.children?.toString().includes("\n") ||
        className?.includes("hljs") ||
        className?.includes("language-");

      if (isInPre) {
        return <code className={cn("font-mono text-sm", className)} {...props} />;
      }

      return (
        <code
          className={cn(
            "relative rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[0.85em] font-medium text-foreground",
            className
          )}
          {...props}
        />
      );
    },
    pre: ({
      className,
      children,
      ...props
    }: React.ComponentPropsWithoutRef<"pre">) => (
      <pre
        className={cn(
          "my-7 overflow-x-auto rounded-md border border-border bg-[#14161a] p-5 text-sm leading-relaxed text-slate-100",
          className
        )}
        {...props}
      >
        {children}
      </pre>
    ),
    strong: ({ className, ...props }) => (
      <strong
        className={cn("font-semibold text-foreground", className)}
        {...props}
      />
    ),
    a: ({ className, ...props }) => (
      <a
        className={cn(
          "font-medium text-primary underline underline-offset-4 decoration-primary/40 hover:decoration-primary transition-colors",
          className
        )}
        target={props.href?.startsWith("http") ? "_blank" : undefined}
        rel={props.href?.startsWith("http") ? "noopener noreferrer" : undefined}
        {...props}
      />
    ),
    hr: ({ ...props }) => <hr className="my-8 border-border" {...props} />,
    table: ({ className, ...props }) => (
      <div className="my-7 w-full overflow-x-auto rounded-md border border-border">
        <table className={cn("w-full border-collapse text-sm", className)} {...props} />
      </div>
    ),
    tr: ({ className, ...props }) => (
      <tr className={cn("border-b border-border last:border-b-0", className)} {...props} />
    ),
    th: ({ className, ...props }) => (
      <th
        className={cn(
          "bg-muted px-4 py-2.5 text-left font-semibold text-foreground",
          className
        )}
        {...props}
      />
    ),
    td: ({ className, ...props }) => (
      <td
        className={cn("px-4 py-2.5 text-muted-foreground", className)}
        {...props}
      />
    ),
    ...components,
  };
}
