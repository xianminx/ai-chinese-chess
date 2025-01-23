import type { NextConfig } from "next";
import createMDX from "@next/mdx";
// import remarkGfm from 'remark-gfm';

const withMDX = createMDX({
  extension: /\.md?$/,
  options: {
    // remarkPlugins: [remarkGfm],
    // rehypePlugins: [['rehype-katex', { strict: true, throwOnError: true }]],
  },
});

const nextConfig: NextConfig = {
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
