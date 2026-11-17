import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Clock3 } from 'lucide-react'
import type { BlogArticle } from '@/components/blog/blog-types'

function ArticleMeta({ article, light = false }: { article: BlogArticle; light?: boolean }) {
  return (
    <div className={`mt-2 flex items-center gap-2 text-xs ${light ? 'text-white/70' : 'text-slate-400'}`}>
      <Clock3 aria-hidden="true" className="size-3.5" />
      <span>{article.readTime}</span>
      <span aria-hidden="true">·</span>
      <span>{article.date}</span>
    </div>
  )
}

function TagList({ tags, light = false }: { tags: string[]; light?: boolean }) {
  return (
    <div className={`flex flex-wrap gap-x-2 gap-y-1 text-[11px] font-medium ${light ? 'text-sky-200' : 'text-sky-700'}`}>
      {tags.map((tag) => <span key={tag}>#{tag}</span>)}
    </div>
  )
}

type FeaturedStoriesProps = {
  spotlight: BlogArticle
  trending: BlogArticle[]
  supporting: BlogArticle[]
}

export function FeaturedStories({ spotlight, trending, supporting }: FeaturedStoriesProps) {
  return (
    <section aria-label="Featured stories" className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-[0.88fr_1.78fr_0.98fr]">
      <aside aria-label="Most read" className="flex flex-col divide-y divide-slate-100 lg:pr-1">
        <h2 className="pb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Most read</h2>
        {trending.map((article) => (
          <article className="py-3.5" key={article.id}>
            <TagList tags={article.tags} />
            <h3 className="mt-2 text-sm font-semibold leading-snug text-slate-900">
              <Link className="hover:text-sky-700" href={`/${article.id}`}>{article.title}</Link>
            </h3>
            <ArticleMeta article={article} />
          </article>
        ))}
        {trending.length === 0 && <p className="py-5 text-sm text-slate-500">More stories coming soon.</p>}
      </aside>

      <article className="group relative isolate min-h-[360px] overflow-hidden rounded-[22px] bg-slate-900 sm:min-h-[460px] lg:min-h-0">
        {spotlight.image && (
          <Image
            alt={spotlight.imageAlt}
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 52vw"
            src={spotlight.image}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/15 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-8">
          <TagList light tags={spotlight.tags} />
          <h2 className="mt-3 max-w-xl text-balance text-2xl font-semibold leading-tight tracking-[-0.025em] sm:text-3xl lg:text-[34px]">
            <Link className="after:absolute after:inset-0 after:content-['']" href={`/${spotlight.id}`}>{spotlight.title}</Link>
          </h2>
          <p className="mt-2 max-w-lg text-sm leading-6 text-white/75">{spotlight.summary}</p>
          <div className="mt-4 flex items-center justify-between gap-4">
            <ArticleMeta light article={spotlight} />
            <span aria-hidden="true" className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-sm">
              <ArrowUpRight className="size-4" />
            </span>
          </div>
        </div>
      </article>

      <aside aria-label="More featured stories" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:flex lg:flex-col">
        {supporting.map((article) => (
          <article className="relative overflow-hidden rounded-[18px] border border-slate-100 bg-white p-1.5" key={article.id}>
            <div className="relative aspect-[1.75] overflow-hidden rounded-[13px] bg-slate-100">
              {article.image && <Image alt={article.imageAlt} className="object-cover" fill sizes="(max-width: 1024px) 50vw, 25vw" src={article.image} />}
            </div>
            <div className="px-2.5 pb-2.5 pt-3">
              <TagList tags={article.tags.slice(0, 3)} />
              <h3 className="mt-2 line-clamp-2 text-sm font-semibold leading-snug text-slate-900">
                <Link className="after:absolute after:inset-0 after:content-['']" href={`/${article.id}`}>{article.title}</Link>
              </h3>
              <ArticleMeta article={article} />
            </div>
          </article>
        ))}
      </aside>
    </section>
  )
}
