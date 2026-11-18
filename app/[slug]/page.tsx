import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArticleCard } from '@/components/blog/article-card'
import type { BlogAuthor, BlogCategory } from '@/components/blog/blog-types'
import { type Breadcrumb, Breadcrumbs } from '@/components/blog/breadcrumbs'
import { getHeadings, RichText } from '@/components/blog/rich-text'
import { ShareButtons } from '@/components/blog/share-buttons'
import { SiteFooter } from '@/components/blog/site-footer'
import { TableOfContents } from '@/components/blog/table-of-contents'
import { Blogpost1 } from '@/components/blogpost1'
import { JsonLd } from '@/components/json-ld'
import { authorNames, markdownPath } from '@/lib/feeds'
import { type BlogPost, getCategories, getPostBySlug, getPosts } from '@/lib/payload'
import { categoryPath, postPath } from '@/lib/routes'
import { DEFAULT_SOCIAL_IMAGE, OPEN_GRAPH_DEFAULTS, SITE_NAME, socialImage } from '@/lib/site'
import { articleSchema, breadcrumbSchema, collectionPageSchema, tagLabels } from '@/lib/structured-data'

/**
 * Renders every content URL of the site:
 *   /<category>   a category's posts
 *   /<post>       a post (its canonical URL)
 */
type ContentPageProps = {
  params: Promise<{ slug: string }>
}

type ContentRoute =
  | { type: 'category'; category: BlogCategory; categories: BlogCategory[] }
  | { type: 'post'; post: BlogPost; categories: BlogCategory[] }

const RELATED_POSTS = 3

async function resolveRoute(slug: string): Promise<ContentRoute | null> {
  const categories = await getCategories()
  // A category and a post could share a slug; the category wins.
  const category = categories.find((item) => item.id === slug)
  if (category) return { type: 'category', category, categories }

  const post = await getPostBySlug(slug)
  return post ? { type: 'post', post, categories } : null
}

// Pages known at build time are prerendered; ones published later render on first visit.
export async function generateStaticParams() {
  const [posts, categories] = await Promise.all([getPosts(), getCategories()])
  return [...categories.map((category) => category.id), ...posts.map((post) => post.id)].map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: ContentPageProps): Promise<Metadata> {
  const { slug } = await params
  const route = await resolveRoute(slug)
  if (!route) return {}

  if (route.type === 'category') {
    const { category } = route
    const path = categoryPath(category.id)
    const description = category.description ?? `The latest ${category.label} stories from ${SITE_NAME}.`
    return {
      title: category.label,
      description,
      alternates: { canonical: path },
      openGraph: { ...OPEN_GRAPH_DEFAULTS, type: 'website', url: path, title: category.label, description, images: [DEFAULT_SOCIAL_IMAGE] },
      twitter: { card: 'summary_large_image', title: category.label, description, images: [DEFAULT_SOCIAL_IMAGE] },
    }
  }

  const { post, categories } = route
  const path = postPath(post)
  const section = categories.find((item) => item.id === post.categoryId)?.label
  const image = post.image ? socialImage(post.image, post.imageAlt) : DEFAULT_SOCIAL_IMAGE
  const authors: BlogAuthor[] = post.authors.length ? post.authors : [{ name: authorNames(post) }]
  return {
    title: post.metaTitle ?? post.title,
    description: post.summary,
    authors: authors.map((author) => ({ name: author.name, url: author.url })),
    keywords: tagLabels(post, categories),
    alternates: {
      canonical: path,
      // Clean Markdown copy of the article for LLMs and AI agents.
      types: { 'text/markdown': markdownPath(post) },
    },
    openGraph: {
      ...OPEN_GRAPH_DEFAULTS,
      type: 'article',
      url: path,
      title: post.title,
      description: post.summary,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: authors.map((author) => author.name),
      section,
      tags: tagLabels(post, categories),
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: [image],
    },
  }
}

export default async function ContentPage({ params }: ContentPageProps) {
  const { slug } = await params
  const route = await resolveRoute(slug)
  if (!route) notFound()

  return (
    <main className="min-h-screen bg-[#f0f6ff] px-3 py-4 sm:px-6 sm:py-8 lg:px-8" id="top">
      <div className="mx-auto max-w-[1440px] overflow-clip rounded-[28px] border border-white/80 bg-white shadow-[0_24px_80px_-48px_rgba(38,94,162,0.35)]">
        {route.type === 'category' ? (
          <CategoryView category={route.category} />
        ) : (
          <PostView categories={route.categories} post={route.post} />
        )}
        <SiteFooter />
      </div>
    </main>
  )
}

async function CategoryView({ category }: { category: BlogCategory }) {
  const posts = (await getPosts()).filter((post) => post.tags.includes(category.id))
  const path = categoryPath(category.id)
  const breadcrumbs: Breadcrumb[] = [{ label: 'Home', href: '/' }, { label: category.label }]

  return (
    <section aria-labelledby="category-heading" className="px-5 pb-12 pt-8 sm:px-8 md:px-10 md:pt-10 lg:px-12">
      <JsonLd data={collectionPageSchema(category, path, posts)} />
      <JsonLd data={breadcrumbSchema(breadcrumbs, path)} />
      <Breadcrumbs items={breadcrumbs} />

      <header className="mt-8 max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-[-0.035em] text-pretty text-slate-900 md:text-5xl" id="category-heading">
          {category.label}
        </h1>
        {category.description && <p className="mt-3 text-lg text-slate-500">{category.description}</p>}
      </header>

      {posts.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <ArticleCard article={post} key={post.id} />
          ))}
        </div>
      ) : (
        <p className="mt-8 text-slate-500">No stories in this category yet.</p>
      )}
    </section>
  )
}

async function PostView({ post, categories }: { post: BlogPost; categories: BlogCategory[] }) {
  const posts = await getPosts()
  const category = categories.find((item) => item.id === post.categoryId)
  const labels = new Map(categories.map((item) => [item.id, item.label]))
  const headings = post.content ? getHeadings(post.content) : []
  const others = posts.filter((item) => item.id !== post.id)
  const related = [
    ...others.filter((item) => item.categoryId === post.categoryId),
    ...others.filter((item) => item.categoryId !== post.categoryId),
  ].slice(0, RELATED_POSTS)
  const breadcrumbs: Breadcrumb[] = [
    { label: 'Home', href: '/' },
    ...(category ? [{ label: category.label, href: categoryPath(category.id) }] : []),
    { label: post.title },
  ]

  return (
    <>
      <JsonLd data={articleSchema(post, categories)} />
      <JsonLd data={breadcrumbSchema(breadcrumbs, postPath(post))} />
      <article className="px-5 pb-12 pt-8 sm:px-8 md:px-10 md:pt-10 lg:px-12">
        <Breadcrumbs items={breadcrumbs} />

        <Blogpost1
          body={post.content && <RichText root={post.content} />}
          bylines={post.authors.length ? post.authors : [{ name: authorNames(post) }]}
          className="pb-0 pt-8"
          date={post.date}
          datePrefix={category ? `${category.label} ·` : undefined}
          dateSuffix={post.readTime}
          description={post.summary}
          image={post.image ? { src: post.image, alt: post.imageAlt } : undefined}
          publishedAt={post.publishedAt}
          sidebar={
            <>
              <TableOfContents headings={headings} />
              <ShareButtons title={post.title} />
            </>
          }
          title={post.title}
          updatedAt={post.updatedAt}
        />

        {post.tags.length > 0 && (
          <div className="mx-auto max-w-5xl">
            <div className="mt-8 flex flex-wrap gap-2 border-t border-slate-100 pt-6">
              {post.tags.map((tag) => (
                <Link
                  className="rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-sky-700 hover:bg-sky-50"
                  href={categoryPath(tag)}
                  key={tag}
                >
                  #{labels.get(tag) ?? tag}
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      {related.length > 0 && (
        <section aria-labelledby="related-stories-heading" className="border-t border-slate-100 px-5 py-12 sm:px-8 md:px-10 lg:px-12">
          <h2 className="text-2xl font-semibold tracking-[-0.035em] text-slate-900" id="related-stories-heading">
            More stories for you
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {related.map((item) => (
              <ArticleCard article={item} key={item.id} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}
