import type { Metadata } from 'next'
import { BlogHome } from '@/components/blog/blog-home'
import type { BlogArticle, BlogCategory, BlogHomeData } from '@/components/blog/blog-types'
import blogData from '@/lib/blog-data.json'
import { type BlogPost, getCategories, getPosts } from '@/lib/payload'
import { DEFAULT_SOCIAL_IMAGE, OPEN_GRAPH_DEFAULTS, SITE_NAME } from '@/lib/site'

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
    types: { 'application/rss+xml': [{ url: '/feed.xml', title: `${SITE_NAME} RSS feed` }] },
  },
  // Setting openGraph here replaces the file-based app/opengraph-image, so the default card is listed explicitly.
  openGraph: { ...OPEN_GRAPH_DEFAULTS, type: 'website', url: '/', images: [DEFAULT_SOCIAL_IMAGE] },
}

/** Only what the home page's cards, search and filters use; the rest of each post stays on the server. */
function toHomeArticle(post: BlogPost): BlogArticle {
  return {
    id: post.id,
    title: post.title,
    categoryId: post.categoryId,
    summary: post.summary,
    tags: post.tags,
    readTime: post.readTime,
    date: post.date,
    image: post.image,
    imageAlt: post.imageAlt,
  }
}

export default async function Page() {
  let articles: BlogArticle[] = []
  let categories: BlogCategory[] = []
  try {
    const [posts, allCategories] = await Promise.all([getPosts(), getCategories()])
    articles = posts.map(toHomeArticle)
    categories = allCategories
  } catch (error) {
    // The home page still renders (with an empty state) while the CMS is unreachable.
    console.error(error)
  }

  // Hero copy and brand list stay local; stories and categories come from Payload CMS.
  const data: BlogHomeData = {
    hero: blogData.hero,
    trustedBy: blogData.trustedBy,
    categories: [{ id: 'all', label: 'All' }, ...categories],
    spotlightArticleId: articles[0]?.id ?? '',
    articles,
  }

  return <BlogHome data={data} />
}

