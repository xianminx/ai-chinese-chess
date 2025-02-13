import configMdx from "@next/mdx";
import moonlightTheme from './assets/moonlight-ii.json' with { type: 'json' };

/** @type {import('next').NextConfig} */
const withMDX = configMdx({
    extension: /\.mdx?$/,
    options: {
        remarkPlugins: [
            ["remark-gfm"],
            ["remark-frontmatter"],
            ["remark-mdx-frontmatter"],
            ["remark-math"],
        ],
        rehypePlugins: [
            ["rehype-katex", { strict: true, throwOnError: true }],
            ["rehype-mathjax"],
            ["rehype-slug"],
            ["rehype-pretty-code", { keepBackground: true , theme: moonlightTheme }],
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
