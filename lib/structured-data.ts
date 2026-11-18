import type { BreadcrumbList, CollectionPage, Graph, NewsArticle, Organization, Person, WebSite, WithContext } from 'schema-dts'
import type { BlogArticle, BlogCategory } from '@/components/blog/blog-types'
import type { Breadcrumb as BreadcrumbItem } from '@/components/blog/breadcrumbs'
import type { BlogPost } from '@/lib/payload'
import { postPath } from '@/lib/routes'
import {
  absoluteUrl,
  LOGO_SIZE,
  LOGO_URL,
  ORGANIZATION_ID,
  SITE_DESCRIPTION,
  SITE_LANGUAGE,
  SITE_NAME,
  SITE_SAME_AS,
  SITE_URL,
  WEBSITE_ID,
} from '@/lib/site'

/** Google truncates longer Article headlines. */
const MAX_HEADLINE_LENGTH = 110

const organizationRef = { '@id': ORGANIZATION_ID }

function organization(): Organization {
  return {
    '@type': 'NewsMediaOrganization',
    '@id': ORGANIZATION_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: { '@type': 'ImageObject', url: LOGO_URL, width: `${LOGO_SIZE}`, height: `${LOGO_SIZE}` },
    ...(SITE_SAME_AS.length ? { sameAs: SITE_SAME_AS } : {}),
  }
}

function website(): WebSite {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: SITE_LANGUAGE,
    publisher: organizationRef,
  }
}

/** Organization and WebSite, rendered once in the root layout; pages reference them by @id. */
export function siteSchema(): Graph {
  return { '@context': 'https://schema.org', '@graph': [organization(), website()] }
}

function headline(title: string) {
  return title.length <= MAX_HEADLINE_LENGTH ? title : `${title.slice(0, MAX_HEADLINE_LENGTH - 1).trimEnd()}…`
}

function authors(post: BlogPost): Person[] | typeof organizationRef {
  if (!post.authors.length) return organizationRef
  return post.authors.map((author) => ({
    '@type': 'Person',
    name: author.name,
    ...(author.url ? { url: author.url } : {}),
    ...(author.description ? { description: author.description } : {}),
  }))
}

/** Readable labels of a post's tags (category slugs), for keywords. */
export function tagLabels(post: BlogArticle, categories: BlogCategory[]) {
  const labels = new Map(categories.map((category) => [category.id, category.label]))
  return post.tags.map((tag) => labels.get(tag) ?? tag)
}

export function articleSchema(post: BlogPost, categories: BlogCategory[]): WithContext<NewsArticle> {
  const url = absoluteUrl(postPath(post))
  const category = categories.find((item) => item.id === post.categoryId)
  const keywords = tagLabels(post, categories)
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    '@id': `${url}#article`,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline: headline(post.title),
    description: post.summary,
    ...(post.image ? { image: [post.image] } : {}),
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: authors(post),
    publisher: organizationRef,
    isPartOf: { '@id': WEBSITE_ID },
    ...(category ? { articleSection: category.label } : {}),
    ...(keywords.length ? { keywords: keywords.join(', ') } : {}),
    ...(post.wordCount ? { wordCount: post.wordCount } : {}),
    inLanguage: SITE_LANGUAGE,
    isAccessibleForFree: true,
  }
}

/** Mirrors the visible breadcrumbs; the current page (no href) gets the page's own URL. */
export function breadcrumbSchema(items: BreadcrumbItem[], currentPath: string): WithContext<BreadcrumbList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: absoluteUrl(item.href ?? currentPath),
    })),
  }
}

export function collectionPageSchema(category: BlogCategory, path: string, posts: BlogArticle[]): WithContext<CollectionPage> {
  const url = absoluteUrl(path)
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': url,
    url,
    name: category.label,
    ...(category.description ? { description: category.description } : {}),
    inLanguage: SITE_LANGUAGE,
    isPartOf: { '@id': WEBSITE_ID },
    publisher: organizationRef,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: posts.map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: absoluteUrl(postPath(post)),
        name: post.title,
      })),
    },
  }
}
