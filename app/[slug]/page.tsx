import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArticleCard } from '@/components/blog/article-card'
import { SiteFooter } from '@/components/blog/site-footer'
import { Blogpost1 } from '@/components/blogpost1'
import { Breadcrumbs } from '@/components/blog/breadcrumbs'
import { getHeadings, RichText } from '@/components/blog/rich-text'
import { ShareButtons } from '@/components/blog/share-buttons'
import { TableOfContents } from '@/components/blog/table-of-contents'
import { getCategories, getPostBySlug, getPosts } from '@/lib/payload'

type ArticlePageProps = {
  params: Promise<{ slug: string }>
}

// Posts known at build time are prerendered; ones published later render on first visit.
export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((post) => ({ slug: post.id }))
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getPostBySlug(slug)
  if (!article) return {}

  return {
    title: article.metaTitle ?? article.title,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      type: 'article',
      images: article.image ? [{ url: article.image, alt: article.imageAlt }] : undefined,
    },
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const article = await getPostBySlug(slug)
  if (!article) notFound()

  const [posts, categories] = await Promise.all([getPosts(), getCategories()])
  const category = categories.find((item) => item.id === article.categoryId)
  const headings = article.content ? getHeadings(article.content) : []
  const others = posts.filter((item) => item.id !== article.id)
  const related = [
    ...others.filter((item) => item.categoryId === article.categoryId),
    ...others.filter((item) => item.categoryId !== article.categoryId),
  ].slice(0, 3)

  return (
    <main className="min-h-screen bg-[#f0f6ff] px-3 py-4 sm:px-6 sm:py-8 lg:px-8" id="top">
      <div className="mx-auto max-w-[1440px] overflow-clip rounded-[28px] border border-white/80 bg-white shadow-[0_24px_80px_-48px_rgba(38,94,162,0.35)]">
        <article className="px-5 pb-12 pt-8 sm:px-8 md:px-10 md:pt-10 lg:px-12">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              ...(category ? [{ label: category.label }] : []),
              { label: article.title },
            ]}
          />

          <Blogpost1
            body={article.content && <RichText root={article.content} />}
            className="pb-0 pt-8"
            date={`${article.date} · ${article.readTime}`}
            datePrefix={category ? `${category.label} ·` : undefined}
            description={article.summary}
            image={article.image ? { src: article.image, alt: article.imageAlt } : undefined}
            sidebar={
              <>
                <TableOfContents headings={headings} />
                <ShareButtons title={article.title} />
              </>
            }
            title={article.title}
          />

          <div className="mx-auto max-w-5xl">
            <div className="mt-8 flex flex-wrap gap-2 border-t border-slate-100 pt-6">
              {article.tags.map((tag) => (
                <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-sky-700" key={tag}>
                  #{tag}
                </span>
              ))}
            </div>
          </div>
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

        <SiteFooter />
      </div>
    </main>
  )
}
