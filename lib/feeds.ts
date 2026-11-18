import type { BlogCategory } from '@/components/blog/blog-types'
import { lexicalToMarkdown } from '@/lib/lexical-to-markdown'
import type { BlogPost } from '@/lib/payload'
import { postPath } from '@/lib/routes'
import { absoluteUrl, SITE_NAME } from '@/lib/site'

/** CDN caching for feeds, llms.txt and Markdown endpoints: fresh for 10 minutes, then served stale while refreshed. */
export const FEED_CACHE_CONTROL = 'public, s-maxage=600, stale-while-revalidate=86400'

/** A text response for crawlers; errors are never cached, so a CMS outage heals on the next request. */
export function textResponse(body: string, contentType: string, init: { status?: number; canonical?: string; noindex?: boolean } = {}) {
  const status = init.status ?? 200
  const headers: Record<string, string> = {
    'Content-Type': `${contentType}; charset=utf-8`,
    'Cache-Control': status === 200 ? FEED_CACHE_CONTROL : 'no-store',
  }
  if (init.canonical) headers.Link = `<${init.canonical}>; rel="canonical"`
  // Markdown copies and llms.txt are for AI agents; the HTML page is what search engines should index.
  if (init.noindex) headers['X-Robots-Tag'] = 'noindex'
  return new Response(body, { status, headers })
}

/** Escapes text for XML element content and attribute values. */
export function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/** Wraps text in CDATA, splitting any `]]>` it contains. */
export function cdata(value: string) {
  return `<![CDATA[${value.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`
}

/** URL of a post's Markdown version (served via the rewrite in next.config.ts). */
export function markdownPath(post: { id: string; categoryId: string }) {
  return `${postPath(post)}.md`
}

export function authorNames(post: BlogPost) {
  return post.authors.length ? post.authors.map((author) => author.name).join(', ') : `${SITE_NAME} Editorial Team`
}

/** A post as a standalone Markdown document with a metadata header, for LLMs and AI search engines. */
export function postMarkdown(post: BlogPost, category?: BlogCategory) {
  const lines = [
    `# ${post.title}`,
    '',
    `> ${post.summary}`,
    '',
    `- URL: ${absoluteUrl(postPath(post))}`,
    `- Publisher: ${SITE_NAME}`,
    `- Author: ${authorNames(post)}`,
    `- Published: ${post.publishedAt}`,
    `- Updated: ${post.updatedAt}`,
    ...(category ? [`- Section: ${category.label}`] : []),
    ...(post.tags.length ? [`- Tags: ${post.tags.join(', ')}`] : []),
    '',
    lexicalToMarkdown(post.content),
  ]
  return `${lines.join('\n').trim()}\n`
}
