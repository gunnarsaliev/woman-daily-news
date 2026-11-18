import { lexicalToHtml } from '@/lib/lexical-to-html'
import { authorNames, cdata, escapeXml, textResponse } from '@/lib/feeds'
import { getCategories, getPosts } from '@/lib/payload'
import { postPath } from '@/lib/routes'
import { absoluteUrl, SITE_DESCRIPTION, SITE_LANGUAGE, SITE_NAME } from '@/lib/site'

const MAX_ITEMS = 50

/** RSS 2.0 feed of the latest posts, with full text, for feed readers, Google News and aggregators. */
export async function GET() {
  try {
    const [posts, categories] = await Promise.all([getPosts(), getCategories()])
    const labels = new Map(categories.map((category) => [category.id, category.label]))
    const items = posts.slice(0, MAX_ITEMS).map((post) => {
      const url = absoluteUrl(postPath(post))
      const section = labels.get(post.categoryId)
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <dc:creator>${escapeXml(authorNames(post))}</dc:creator>
${section ? `      <category>${escapeXml(section)}</category>\n` : ''}      <description>${escapeXml(post.summary)}</description>
      <content:encoded>${cdata(lexicalToHtml(post.content))}</content:encoded>
${post.image ? `      <media:content url="${escapeXml(post.image)}" medium="image" />\n` : ''}    </item>`
    })

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${escapeXml(absoluteUrl('/'))}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>${SITE_LANGUAGE}</language>
    <atom:link href="${escapeXml(absoluteUrl('/feed.xml'))}" rel="self" type="application/rss+xml" />
${posts[0] ? `    <lastBuildDate>${new Date(posts[0].publishedAt).toUTCString()}</lastBuildDate>\n` : ''}${items.join('\n')}
  </channel>
</rss>
`
    return textResponse(xml, 'application/rss+xml')
  } catch (error) {
    console.error(error)
    return textResponse('Service unavailable', 'text/plain', { status: 503 })
  }
}
