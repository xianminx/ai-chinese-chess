import "katex/dist/katex.min.css";
import type { MDXComponents } from "mdx/types";
import React from "react";

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including inline styles,
// components from other libraries, and more.

// Helper function to extract text from nested structures
function extractText(node: React.ReactNode): string {
  if (typeof node === "string") {
    return node;
  }
  if (Array.isArray(node)) {
    return node.map(extractText).join("");
  }
  if (React.isValidElement(node)) {
    return extractText(node.props.children);
  }
  return "";
}

function getAlertType(text: string): string {
  const match = text.match(/\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i);

  if (match) {
    return match[1].toLowerCase();
  }
  return "default";
}

// Function to remove the alert type marker from React nodes
function removeAlertMarker(node: React.ReactNode): React.ReactNode {
  if (typeof node === "string") {
    return node
      .replace(/\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/i, "")
      .trim()
      .replace(/^["']|["']$/g, "");
  }
  if (Array.isArray(node)) {
    return node.map(removeAlertMarker);
  }
  if (React.isValidElement(node)) {
    return React.cloneElement(node, {
      ...node.props,
      children: removeAlertMarker(node.props.children),
    });
  }
  return node;
}

// Alert type definitions
const alertTypes = {
  note: {
    style: "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-200",
    color: "text-blue-900 dark:text-blue-200",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" width="16" height="16">
        <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"/>
      </svg>
    )
  },
  tip: {
    style: "border-green-500 bg-green-50 dark:bg-green-900/30 text-green-900 dark:text-green-200",
    color: "text-green-900 dark:text-green-200",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" width="16" height="16">
        <path d="M8 1.5c-2.363 0-4 1.69-4 3.75 0 .984.424 1.625.984 2.304l.214.253c.223.264.47.556.673.848.284.411.537.896.621 1.49a.75.75 0 0 1-1.484.211c-.04-.282-.163-.547-.37-.847a8.456 8.456 0 0 0-.542-.68c-.084-.1-.173-.205-.268-.32C3.201 7.75 2.5 6.766 2.5 5.25 2.5 2.31 4.863 0 8 0s5.5 2.31 5.5 5.25c0 1.516-.701 2.5-1.328 3.259-.095.115-.184.22-.268.319-.207.245-.383.453-.541.681-.208.3-.33.565-.37.847a.751.751 0 0 1-1.485-.212c.084-.593.337-1.078.621-1.489.203-.292.45-.584.673-.848.075-.088.147-.173.213-.253.561-.679.985-1.32.985-2.304 0-2.06-1.637-3.75-4-3.75ZM5.75 12h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1 0-1.5ZM6 15.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Z"/>
      </svg>
    )
  },
  important: {
    style: "border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-900 dark:text-purple-200",
    color: "text-purple-900 dark:text-purple-200",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" width="16" height="16">
        <path d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v9.5A1.75 1.75 0 0 1 14.25 13H8.06l-2.573 2.573A1.458 1.458 0 0 1 3 14.543V13H1.75A1.75 1.75 0 0 1 0 11.25Zm1.75-.25a.25.25 0 0 0-.25.25v9.5c0 .138.112.25.25.25h2a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h6.5a.25.25 0 0 0 .25-.25v-9.5a.25.25 0 0 0-.25-.25Zm7 2.25v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"/>
      </svg>
    )
  },
  warning: {
    style: "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-200",
    color: "text-yellow-900 dark:text-yellow-200",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" width="16" height="16">
        <path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"/>
      </svg>
    )
  },
  caution: {
    style: "border-red-500 bg-red-50 dark:bg-red-900/30 text-red-900 dark:text-red-200",
    color: "text-red-900 dark:text-red-200",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" width="16" height="16">
        <path d="M4.47.22A.749.749 0 0 1 5 0h6c.199 0 .389.079.53.22l4.25 4.25c.141.14.22.331.22.53v6a.749.749 0 0 1-.22.53l-4.25 4.25A.749.749 0 0 1 11 16H5a.749.749 0 0 1-.53-.22L.22 11.53A.749.749 0 0 1 0 11V5c0-.199.079-.389.22-.53Zm.84 1.28L1.5 5.31v5.38l3.81 3.81h5.38l3.81-3.81V5.31L10.69 1.5ZM8 4a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"/>
      </svg>
    )
  },
  default: {
    style: "border-gray-500 bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300",
    color: "text-gray-700 dark:text-gray-300",
    icon: null
  }
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Allows customizing built-in components, e.g. to add styling.
    // h1: ({ children }) => (
    //   <h1 style={{ color: "red", fontSize: "48px" }}>{children}</h1>
    // ),
    // table: ({ children }) => (
    //   <div className="overflow-x-auto my-4">
    //     <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700">
    //       {children}
    //     </table>
    //   </div>
    // ),
    // thead: ({ children }) => (
    //   <thead className="bg-gray-50 dark:bg-gray-800">{children}</thead>
    // ),
    // tbody: ({ children }) => (
    //   <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">{children}</tbody>
    // ),
    // tr: ({ children }) => (
    //   <tr>{children}</tr>
    // ),
    // th: ({ children }) => (
    //   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
    //     {children}
    //   </th>
    // ),
    // td: ({ children }) => (
    //   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
    //     {children}
    //   </td>
    // ),
    // img: (props) => (
    //   <Image
    //     sizes="100vw"
    //     style={{ width: "100%", height: "auto" }}
    //     {...(props as ImageProps)}
    //   />
    // ),
    ...components,
    blockquote: ({ children }) => {
      const text = extractText(children);
      const alertType = getAlertType(text);
      const alert = alertTypes[alertType as keyof typeof alertTypes];
      const cleanedContent = removeAlertMarker(children);

      const blockquoteClasses = `
        prose 
        prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 
        prose-blockquote:font-normal prose-blockquote:text-gray-700 
        prose-blockquote:before:content-none prose-blockquote:after:content-none
        dark:prose-blockquote:text-gray-300 prose-blockquote:bg-gray-50 
        dark:prose-blockquote:bg-gray-800/50 prose-blockquote:rounded-r-lg
        prose-p:before:content-none prose-p:after:content-none
        prose-p:my-0 prose-p:py-0
        ${alert.style}
      `.trim();

      return (
        <blockquote className={blockquoteClasses}>
          {alert.icon && (
            <span className={`py-2 text-sm flex items-center gap-2 !not-italic ${alert.color}`}>
              {alert.icon}
              <span className="font-bold">
                {alertType.charAt(0).toUpperCase() + alertType.slice(1).toLowerCase()}
              </span>
            </span>
          )}
          <div className="py-1 !not-italic">{cleanedContent}</div>
        </blockquote>
      );
    },
    // code: ({ children }) => {
    //   return <code className="mx-1">{children}</code>;
    // },
  };
}
