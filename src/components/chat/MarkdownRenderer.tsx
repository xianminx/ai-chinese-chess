import React from 'react';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Components } from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
}

// interface CodeProps {
//   inline?: boolean;
//   className?: string;
//   children: React.ReactNode;
//   // You can include additional props if needed
//   [key: string]: any;
// }

// const CodeBlock: React.FC<CodeProps> = ({
//   inline,
//   className,
//   children,
//   ...props
// }) => {
//   const language = className?.replace('language-', '') || 'text';

//   if (inline) {
//     return (
//       <code
//         className="px-1 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
//         {...props}
//       >
//         {children}
//       </code>
//     );
//   } else {
//     return (
//       <div className="relative group">
//         <pre
//           className={`${className} rounded-md bg-gray-800 dark:bg-gray-900 p-4 overflow-x-auto`}
//         >
//           <code
//             className={`language-${language} text-sm text-gray-100`}
//             {...props}
//           >
//             {children}
//           </code>
//         </pre>
//       </div>
//     );
//   }
// };




export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const components: Components = {
    // code: CodeBlock,
    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
    ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
    li: ({ children }) => <li className="mb-1">{children}</li>,
    a: ({ href, children }) => (
      <a href={href} className="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-gray-300 dark:border-gray-600 pl-4 italic my-2">
        {children}
      </blockquote>
    ),
    table: ({ children }) => (
      <div className="overflow-x-auto my-2">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          {children}
        </table>
      </div>
    ),
    th: ({ children }) => (
      <th className="px-3 py-2 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {children}
      </td>
    ),
  };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={components}
    >
      {content}
    </ReactMarkdown>
  );
} 