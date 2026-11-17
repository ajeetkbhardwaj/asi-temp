import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { useMDXComponents } from "@/components/mdx-components";

interface MdxContentProps {
  source: string;
}

export function MdxContent({ source }: MdxContentProps) {
  const components = useMDXComponents();

  return (
    <div className="prose-reader">
      <MDXRemote
        source={source}
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeHighlight],
          },
        }}
      />
    </div>
  );
}
