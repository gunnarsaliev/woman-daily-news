import { escapeXml, textResponse } from '@/lib/feeds'
import { getPosts } from '@/lib/payload'
import { postPath } from '@/lib/routes'
import { absoluteUrl, SITE_LANGUAGE, SITE_NAME } from '@/lib/site'

/** Google News only reads articles published in the last two days. */
const NEWS_WINDOW_MS = 2 * 24 * 60 * 60 * 1000
/** Google News sitemaps may list at most 1,000 articles. */
const MAX_ARTICLES = 1000

/** Google News sitemap: https://developers.google.com/search/docs/crawling-indexing/sitemaps/news-sitemap */
export async function GET() {
  try {
    const since = Date.now() - NEWS_WINDOW_MS
    const posts = (await getPosts()).filter((post) => Date.parse(post.publishedAt) >= since).slice(0, MAX_ARTICLES)

    const urls = posts.map(
      (post) => `  <url>
    <loc>${escapeXml(absoluteUrl(postPath(post)))}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(SITE_NAME)}</news:name>
        <news:language>${SITE_LANGUAGE}</news:language>
      </news:publication>
      <news:publication_date>${post.publishedAt}</news:publication_date>
      <news:title>${escapeXml(post.title)}</news:title>
    </news:news>
  </url>`,
    )

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls.join('\n')}
</urlset>
`
    return textResponse(xml, 'application/xml')
  } catch (error) {
    console.error(error)
    return textResponse('Service unavailable', 'text/plain', { status: 503 })
  }
}
