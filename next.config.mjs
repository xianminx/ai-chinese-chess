import configMdx from "@next/mdx";
import moonlightTheme from './assets/moonlight-ii.json' with { type: 'json' };
import remarkGfm from 'remark-gfm'

import fs from 'fs';
import path from 'path';
/** @type {import('next').NextConfig} */
const withMDX = configMdx({
    extension: /\.mdx?$/,
    options: {
        remarkPlugins: [
            remarkGfm,
            ["remark-frontmatter"],
            ["remark-mdx-frontmatter"],
            ["remark-math"],
            remarkDebug
        ],
        rehypePlugins: [
            ["rehype-katex", { strict: true, throwOnError: true }],
            // ["rehype-mathjax"],
            ["rehype-slug"],
            ["rehype-pretty-code", { keepBackground: true , theme: moonlightTheme }],
            rehypeDebug
        ],
    },
});

const nextConfig = {
    pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
    experimental: {
        mdxRs: false,
    },
    rewrites: async () => {
        return [
            {
                source: "/api/py/:path*",
                destination:
                    process.env.NODE_ENV === "development"
                        ? "http://127.0.0.1:8000/api/py/:path*"
                        : "/api/",
            },
        ];
    },
};

export default withMDX(nextConfig);

// Create a debug remark plugin
function remarkDebug() {
    return (tree, file) => {
        
        console.log('=== Remark Transform Debug ===')
        console.log('File path:', file.path)
        
        // Create inspect directory if it doesn't exist
        const inspectDir = path.join(process.cwd(), 'inspect');
        if (!fs.existsSync(inspectDir)){
            fs.mkdirSync(inspectDir, { recursive: true });
        }
        
        // Write AST to debug file with same name as source
        const fileName = path.relative(process.cwd(), file.path).replace(/\//g, '-').replace(/\.[^/.]+$/, '') + '-remark.json';
        const debugPath = path.join(inspectDir, fileName);
        fs.writeFileSync(
            debugPath,
            JSON.stringify(tree, null, 2)
        );
        console.log('AST written to:', debugPath);
    }
}

function rehypeDebug() {
    return (tree, file) => {
        console.log('=== Rehype Transform Debug ===')
        // Create inspect directory if it doesn't exist
        const inspectDir = path.join(process.cwd(), 'inspect');
        if (!fs.existsSync(inspectDir)){
            fs.mkdirSync(inspectDir, { recursive: true });
        }
        
        // Write AST to debug file with same name as source
        const fileName = path.relative(process.cwd(), file.path).replace(/\//g, '-').replace(/\.[^/.]+$/, '') + '-rehype.json';
        const debugPath = path.join(inspectDir, fileName);
        fs.writeFileSync(
            debugPath,
            JSON.stringify(tree, null, 2)
        );
    }
}
