

import { getDocs } from "@/app/docs/utils";
import { baseUrl } from "@/utils/url";
export async function GET() {
  const allDocs = await getDocs();

  const itemsXml = allDocs
    .sort((a, b) => {
      if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
        return -1;
      }
      return 1;
    })
    .map(
      (doc) =>
        `<item>
          <title>${doc.metadata.title}</title>
          <link>${baseUrl}/docs/${doc.slug}</link>
          <description>${doc.metadata.summary || ""}</description>
          <pubDate>${new Date(doc.metadata.publishedAt).toUTCString()}</pubDate>
        </item>`
    )
    .join("\n");

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
        <title>AI Agent for Chess</title>
        <link>${baseUrl}</link>
        <description>AI Agent for Chess</description>
        ${itemsXml}
    </channel>
  </rss>`;

  return new Response(rssFeed, {
    headers: {
      "Content-Type": "text/xml",
    },
  });
}
