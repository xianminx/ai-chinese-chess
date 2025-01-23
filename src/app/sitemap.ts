import { getDocs } from '@/app/docs/utils'

export const baseUrl = 'https://chess.houkui.dev'

export default async function sitemap() {
  const docs = getDocs().map((doc) => ({
    url: `${baseUrl}/docs/${doc.slug}`,
    lastModified: doc.metadata.publishedAt,
  }))

  const routes = ['', '/docs'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...docs]
}
