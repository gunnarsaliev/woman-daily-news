import type { MetadataRoute } from 'next'
import { escapeXml } from '@/lib/feeds'
import { getAllPosts, getCategories } from '@/lib/payload'
import { categoryPath, postPath } from '@/lib/routes'
import { absoluteUrl, TRUST_PAGES } from '@/lib/site'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const [posts, categories] = await Promise.all([getAllPosts(), getCategories()])
    const newest = (items: { updatedAt: string }[]) =>
      items.reduce<string | undefined>((latest, item) => (!latest || item.updatedAt > latest ? item.updatedAt : latest), undefined)

    return [
      { url: absoluteUrl('/'), lastModified: newest(posts), changeFrequency: 'hourly', priority: 1 },
      ...categories.flatMap((category) => {
        const categoryPosts = posts.filter((post) => post.tags.includes(category.id))
        // Empty categories are thin pages; they are listed once they have stories.
        if (!categoryPosts.length) return []
        return [{ url: absoluteUrl(categoryPath(category.id)), lastModified: newest(categoryPosts), changeFrequency: 'daily' as const, priority: 0.7 }]
      }),
      ...TRUST_PAGES.map((page) => ({ url: absoluteUrl(page.path), changeFrequency: 'yearly' as const, priority: 0.3 })),
      ...posts.map((post) => ({
        url: absoluteUrl(postPath(post)),
        lastModified: post.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
        // Next.js writes image URLs into the XML unescaped; `&` in query strings would make the sitemap invalid.
        ...(post.image ? { images: [escapeXml(post.image)] } : {}),
      })),
    ]
  } catch (error) {
    // The home page is still listed while the CMS is unreachable; the next revalidation adds the rest.
    console.error(error)
    return [{ url: absoluteUrl('/'), changeFrequency: 'hourly', priority: 1 }]
  }
}
