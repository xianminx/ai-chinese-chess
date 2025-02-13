import { Metadata } from "next/types";
import { getDocs } from "./utils";  
import Link from "next/link";
import { Doc, formatDate } from "./utils";


export default function DocsPage() {
  const docs = getDocs();

  return (
    <div className="space-y-8 py-6">
      <h1 className="text-8xl font-semibold tracking-tight text-zinc-800 dark:text-zinc-100 text-center">
        Documentation
      </h1>
      <DocsIndex docs={docs} />
    </div>
  );
}


function DocsIndex({ docs }: { docs: Doc[] }) {
    return (
      <div className="space-y-2">
        {docs.map((doc) => (
          <Link 
            key={doc.routePath} 
            href={doc.routePath}
            className="group block p-4 rounded-lg border border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700 no-underline
              transition-all duration-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
          >
            <div className="flex justify-between items-baseline gap-2">
              <h2 className="text-base font-medium text-zinc-900 dark:text-zinc-100 transition-colors group-hover:text-teal-500 dark:group-hover:text-teal-400">
                {doc.metadata.title}
              </h2>
              <time
                className="text-sm text-zinc-500 dark:text-zinc-400 shrink-0"
                dateTime={doc.metadata.publishedAt}
                title={formatDate(doc.metadata.publishedAt).full}
              >
                {formatDate(doc.metadata.publishedAt).display}
              </time>
            </div>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 transition-colors group-hover:text-teal-500/70 dark:group-hover:text-teal-400/70">
              {doc.metadata.summary}
            </p>
          </Link>
        ))}
      </div>
    )
  }
  

export const metadata: Metadata = {
  title: "Documentation",
  description: "Documentation for the project",
};
