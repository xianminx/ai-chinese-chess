import "katex/dist/katex.min.css";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div
        className="prose prose-stone dark:prose-invert prose-a:text-teal-500 
        prose-h1:text-2xl prose-h1:font-semibold prose-h1:tracking-tighter
        prose-headings:scroll-mt-20 prose-headings:font-display 
        prose-a:underline-offset-4 prose-a:font-medium hover:prose-a:text-teal-500
        prose-pre:my-0 prose-pre:bg-zinc-900 prose-pre:shadow-lg
        prose-img:rounded-lg prose-img:shadow-lg
        max-w-none
        "
      >
        {children}
      </div>
    </div>
  );
}
