import { getDocs } from '@/app/docs/utils'
import { baseUrl } from '@/utils/url'

export default async function sitemap() {
  const docs = getDocs().map((doc) => ({
    url: `${baseUrl}/docs/${doc.slug}`,
    lastModified: doc.metadata.publishedAt,
  }))

  const routes = ['', '/docs'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
  }));

  return [...routes, ...docs]
}
