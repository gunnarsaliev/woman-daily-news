import { articleCardImage } from '@/lib/brand-image'
import { getCategories, getPostBySlug } from '@/lib/payload'

/**
 * Generated sharing card for a post without its own image, at /og/<post slug>.
 * Lives outside /api/ because robots.txt disallows /api/, and some social crawlers (e.g. Twitterbot) obey it.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  try {
    const post = await getPostBySlug(slug)
    if (!post) return new Response('Not found', { status: 404 })

    const section = (await getCategories()).find((category) => category.id === post.categoryId)?.label
    return articleCardImage(post.title, section)
  } catch (error) {
    console.error(error)
    return new Response('Service unavailable', { status: 503, headers: { 'Cache-Control': 'no-store' } })
  }
}
