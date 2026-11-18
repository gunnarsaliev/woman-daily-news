import { postMarkdown, textResponse } from '@/lib/feeds'
import { getCategories, getPostBySlug } from '@/lib/payload'
import { postPath } from '@/lib/routes'
import { absoluteUrl } from '@/lib/site'

/**
 * Markdown version of a post, served at `<post URL>.md` through the rewrite in next.config.ts.
 * Gives LLMs and AI agents the article text without page chrome.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  try {
    const post = slug.length <= 2 ? await getPostBySlug(slug[slug.length - 1]) : null
    // Only the post's canonical path (plus .md) is served, mirroring the HTML page.
    if (!post || postPath(post) !== `/${slug.join('/')}`) return textResponse('Not found\n', 'text/markdown', { status: 404 })

    const category = (await getCategories()).find((item) => item.id === post.categoryId)
    return textResponse(postMarkdown(post, category), 'text/markdown', { canonical: absoluteUrl(postPath(post)), noindex: true })
  } catch (error) {
    console.error(error)
    return textResponse('Service unavailable\n', 'text/markdown', { status: 503 })
  }
}
