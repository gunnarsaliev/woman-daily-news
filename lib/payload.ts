import { cache } from 'react'
import type { BlogArticle, BlogAuthor, BlogCategory } from '@/components/blog/blog-types'
import type { LexicalNode } from '@/components/blog/rich-text'

/**
 * Server-side client for the Payload CMS REST API.
 *
 * PAYLOAD_API_URL          base URL of the CMS (default http://localhost:3001)
 * PAYLOAD_TENANT_ID        only show content of this tenant (default: all tenants)
 * PAYLOAD_LOCALE           content locale, e.g. "en" or "bg" (default: the CMS default)
 * PAYLOAD_FALLBACK_LOCALE  locale used for fields missing in PAYLOAD_LOCALE
 */
const API_URL = (process.env.PAYLOAD_API_URL ?? 'http://localhost:3001').replace(/\/$/, '')
const TENANT_ID = process.env.PAYLOAD_TENANT_ID
const LOCALE = process.env.PAYLOAD_LOCALE
const FALLBACK_LOCALE = process.env.PAYLOAD_FALLBACK_LOCALE

/**
 * Seconds before cached CMS responses (and the pages built from them) are refreshed in the background.
 * Publishing in the CMS can refresh them immediately through /api/revalidate, so this is only the fallback.
 */
const REVALIDATE_SECONDS = 300
/** Cache tag on every CMS response; /api/revalidate invalidates it. */
export const CMS_CACHE_TAG = 'payload'
/**
 * A CMS request slower than this errors instead of stalling the page.
 * The abort signal turns off fetch's per-render memoization, so the exported readers are wrapped in React
 * `cache()`, which dedupes them again across the layout, metadata and page of one render.
 */
const REQUEST_TIMEOUT_MS = 8000
const WORDS_PER_MINUTE = 200
const SUMMARY_LENGTH = 180
/** Shown for posts that have no main image in the CMS. */
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1635169852185-37f90ac07189'

type PayloadList<T> = { docs: T[]; hasNextPage?: boolean; nextPage?: number | null }

type PayloadMedia = {
  url?: string | null
  alt?: string | null
}

type PayloadCategory = {
  id: number
  slug?: string | null
  title?: string | null
  description?: string | null
}

/** An author as Payload returns it: a populated user/author document, or just its id at low depth. */
type PayloadAuthor = {
  id?: number | string
  name?: string | null
  slug?: string | null
  url?: string | null
  bio?: string | null
  description?: string | null
}

type PayloadPost = {
  id: number
  slug?: string | null
  title?: string | null
  mainImage?: PayloadMedia | number | null
  content?: { root?: LexicalNode } | null
  meta?: { title?: string | null; description?: string | null } | null
  categories?: (PayloadCategory | number)[] | null
  /** Set by the Payload website template's authors hook; preferred because it is readable without user access. */
  populatedAuthors?: PayloadAuthor[] | null
  authors?: (PayloadAuthor | number | string)[] | null
  publishedAt?: string | null
  createdAt: string
  updatedAt?: string | null
}

export type BlogPost = BlogArticle & {
  content?: LexicalNode
  metaTitle?: string
  publishedAt: string
  updatedAt: string
  authors: BlogAuthor[]
  wordCount: number
}

async function payloadFetch<T>(path: string, params: Record<string, string>): Promise<T> {
  const query = new URLSearchParams(params)
  if (TENANT_ID) query.set('where[tenant][equals]', TENANT_ID)
  if (LOCALE) query.set('locale', LOCALE)
  if (FALLBACK_LOCALE) query.set('fallback-locale', FALLBACK_LOCALE)

  const url = `${API_URL}/api/${path}?${query}`
  let response: Response
  try {
    response = await fetch(url, {
      next: { revalidate: REVALIDATE_SECONDS, tags: [CMS_CACHE_TAG] },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })
  } catch (cause) {
    throw new Error(`Could not reach Payload CMS at ${API_URL}. Is it running?`, { cause })
  }
  if (!response.ok) {
    throw new Error(`Payload CMS request failed with ${response.status}: ${url}`)
  }
  return response.json() as Promise<T>
}

function mediaUrl(url: string) {
  return url.startsWith('http') ? url : `${API_URL}${url}`
}

function plainText(node: LexicalNode | undefined): string {
  if (!node) return ''
  if (typeof node.text === 'string') return node.text
  return (node.children ?? []).map(plainText).join(node.type === 'root' ? ' ' : '')
}

function truncate(text: string, length: number) {
  if (text.length <= length) return text
  return `${text.slice(0, text.lastIndexOf(' ', length)).replace(/[\s.,;:!?]+$/, '')}…`
}

function toAuthors(post: PayloadPost): BlogAuthor[] {
  const source = post.populatedAuthors?.length ? post.populatedAuthors : (post.authors ?? [])
  return source.flatMap((author) => {
    if (typeof author !== 'object' || !author?.name) return []
    const description = author.bio || author.description || undefined
    return [{ name: author.name, url: author.url || undefined, description }]
  })
}

function toBlogPost(post: PayloadPost): BlogPost | null {
  // Posts without a slug or without a title in the requested locale can't be shown.
  if (!post.slug || !post.title) return null

  const text = plainText(post.content?.root).replace(/\s+/g, ' ').trim()
  const words = text ? text.split(' ').length : 0
  const categories = (post.categories ?? []).filter((item): item is PayloadCategory => typeof item === 'object')
  const image = typeof post.mainImage === 'object' ? post.mainImage : null
  const publishedAt = post.publishedAt || post.createdAt

  return {
    id: post.slug,
    title: post.title,
    categoryId: categories[0]?.slug ?? '',
    summary: post.meta?.description || truncate(text, SUMMARY_LENGTH),
    tags: categories.map((category) => category.slug).filter((slug): slug is string => Boolean(slug)),
    readTime: `${Math.max(1, Math.round(words / WORDS_PER_MINUTE))} min read`,
    date: new Date(publishedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    }),
    image: image?.url ? mediaUrl(image.url) : FALLBACK_IMAGE,
    imageAlt: (image?.url && image.alt) || post.title,
    content: post.content?.root,
    metaTitle: post.meta?.title || undefined,
    publishedAt: new Date(publishedAt).toISOString(),
    updatedAt: new Date(post.updatedAt || publishedAt).toISOString(),
    authors: toAuthors(post),
    wordCount: words,
  }
}

/** Readable label for a category that has no title in the requested locale. */
function titleFromSlug(slug: string) {
  const words = slug.replace(/-/g, ' ')
  return words.charAt(0).toUpperCase() + words.slice(1)
}

/** All published posts, newest first. */
export const getPosts = cache(async (): Promise<BlogPost[]> => {
  const data = await payloadFetch<PayloadList<PayloadPost>>('blog', {
    depth: '1',
    limit: '100',
    sort: '-createdAt',
  })
  return data.docs.map(toBlogPost).filter((post) => post !== null)
})

/** Most posts fetched per CMS request when listing every post. */
const PAGE_SIZE = 100
/** Upper bound on pages fetched by getAllPosts, so a misbehaving CMS can't loop forever. */
const MAX_PAGES = 50

/** Every published post, newest first, across as many CMS pages as needed (for sitemaps and feeds). */
export const getAllPosts = cache(async (): Promise<BlogPost[]> => {
  const posts: BlogPost[] = []
  for (let page = 1; page <= MAX_PAGES; page++) {
    const data = await payloadFetch<PayloadList<PayloadPost>>('blog', {
      depth: '1',
      limit: String(PAGE_SIZE),
      page: String(page),
      sort: '-createdAt',
    })
    posts.push(...data.docs.map(toBlogPost).filter((post) => post !== null))
    if (!data.hasNextPage) break
  }
  return posts
})

export const getPostBySlug = cache(async (slug: string): Promise<BlogPost | null> => {
  const data = await payloadFetch<PayloadList<PayloadPost>>('blog', {
    depth: '1',
    limit: '1',
    'where[slug][equals]': slug,
  })
  const post = data.docs[0]
  return post ? toBlogPost(post) : null
})

export const getCategories = cache(async (): Promise<BlogCategory[]> => {
  const data = await payloadFetch<PayloadList<PayloadCategory>>('blog-categories', {
    depth: '0',
    limit: '100',
  })
  return data.docs.flatMap((category) =>
    category.slug
      ? [{ id: category.slug, label: category.title || titleFromSlug(category.slug), description: category.description || undefined }]
      : [],
  )
})
