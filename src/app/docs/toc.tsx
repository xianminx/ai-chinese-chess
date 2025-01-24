/**
 * TOC component for the documentation page
 * @returns 
 */

import Link from "next/link";
import { getDocs } from "./utils";
import { formatDate } from "./utils";

export function DocsIndex() {
  const docs = getDocs().sort((a, b) => 
    new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime()
  );

  return (
    <div className="space-y-8 py-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-800 dark:text-zinc-100">
          Documentation
        </h1>
      {docs.map((doc) => (
        <Link 
          key={doc.slug} 
          href={`/docs/${doc.slug}`}
          className="block group"
        >
          <article className="flex flex-col space-y-2.5 rounded-2xl p-5 transition-colors border border-zinc-300/40 hover:bg-zinc-50 dark:border-zinc-700/40 dark:hover:bg-zinc-800/40">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-semibold tracking-tight text-zinc-800 dark:text-zinc-100 group-hover:text-teal-500 dark:group-hover:text-teal-400">
                {doc.metadata.title}
              </h2>
              <time className="text-sm text-zinc-600 dark:text-zinc-400" dateTime={doc.metadata.publishedAt}>
                {formatDate(doc.metadata.publishedAt)}
              </time>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
              {doc.metadata.summary}
            </p>
            <div className="flex items-center text-sm text-teal-500 dark:text-teal-400">
              <span className="group-hover:underline">Read more</span>
              <svg 
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
                className="ml-1 h-4 w-4 stroke-current"
              >
                <path
                  d="M6.75 5.75 9.25 8l-2.5 2.25"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
} 