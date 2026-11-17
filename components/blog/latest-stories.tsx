import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ArticleCard } from '@/components/blog/article-card'
import type { BlogArticle } from '@/components/blog/blog-types'

type LatestStoriesProps = {
  stories: BlogArticle[]
  page: number
  pageNumbers: number[]
  onPageChange: (page: number) => void
}

export function LatestStories({ stories, page, pageNumbers, onPageChange }: LatestStoriesProps) {
  const currentPageIndex = pageNumbers.indexOf(page)
  const previousPage = currentPageIndex > 0 ? pageNumbers[currentPageIndex - 1] : pageNumbers[0]
  const nextPage = pageNumbers[(currentPageIndex + 1 + pageNumbers.length) % pageNumbers.length]

  return (
    <section aria-labelledby="latest-stories-heading">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">Latest stories</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-slate-900 sm:text-3xl" id="latest-stories-heading">
            Fresh reads for your day
          </h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-slate-500">Honest advice and everyday inspiration on health, relationships, money and the moments in between.</p>
      </div>

      {stories.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {stories.map((article, index) => (
            <ArticleCard article={article} featured={index === 0 && stories.length > 3} key={article.id} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 px-6 py-12 text-center text-sm text-slate-500">
          No stories to show yet. Try a different search or topic.
        </div>
      )}

      <nav aria-label="Story pages" className="mt-9 flex items-center justify-center gap-1.5">
        <Button
          aria-label="Previous page"
          className="size-9 rounded-full text-slate-500"
          disabled={page === pageNumbers[0]}
          onClick={() => onPageChange(previousPage)}
          size="icon"
          variant="ghost"
        >
          <ChevronLeft aria-hidden="true" />
        </Button>
        {pageNumbers.slice(0, 4).map((pageNumber) => (
          <Button
            aria-current={page === pageNumber ? 'page' : undefined}
            aria-label={`Page ${pageNumber}`}
            className={`size-9 rounded-full ${page === pageNumber ? 'bg-sky-600 text-white hover:bg-sky-700' : 'text-slate-500'}`}
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            size="icon"
            variant={page === pageNumber ? 'default' : 'ghost'}
          >
            {pageNumber}
          </Button>
        ))}
        <span aria-hidden="true" className="px-1 text-sm text-slate-400">…</span>
        <Button
          aria-current={page === pageNumbers[pageNumbers.length - 1] ? 'page' : undefined}
          aria-label={`Page ${pageNumbers[pageNumbers.length - 1]}`}
          className={`size-9 rounded-full ${page === pageNumbers[pageNumbers.length - 1] ? 'bg-sky-600 text-white hover:bg-sky-700' : 'text-slate-500'}`}
          onClick={() => onPageChange(pageNumbers[pageNumbers.length - 1])}
          size="icon"
          variant={page === pageNumbers[pageNumbers.length - 1] ? 'default' : 'ghost'}
        >
          {pageNumbers[pageNumbers.length - 1]}
        </Button>
        <Button
          aria-label="Next page"
          className="size-9 rounded-full text-slate-500"
          onClick={() => onPageChange(nextPage)}
          size="icon"
          variant="ghost"
        >
          <ChevronRight aria-hidden="true" />
        </Button>
      </nav>
    </section>
  )
}
