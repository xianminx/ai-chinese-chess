import { Metadata } from "next";


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="prose prose-headings:mt-8 prose-headings:font-semibold prose-headings:text-black prose-h1:text-5xl prose-h2:text-4xl prose-h3:text-3xl prose-h4:text-2xl prose-h5:text-xl prose-h6:text-lg dark:prose-headings:text-white">
      <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">Deep nested page.mdx with layout.tsx</h1>
      <p>This is a deep nested page.mdx with layout.tsx </p>
        <ul>
          <li>See layout file at <a href="/docs/a/b/c/layout.tsx">/docs/a/b/c/layout.tsx</a></li>
          <li>See page file at <a href="/docs/a/b/c/page.mdx">/docs/a/b/c/page.mdx</a></li>
        </ul>
      {children}
    </div>
  );
}

export const metadata: Metadata = {
  title: "Deep nested page.mdx with layout.tsx",
  description: "This is a deep nested page.mdx with layout.tsx",
};
