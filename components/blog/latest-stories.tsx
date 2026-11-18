import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ArticleCard } from '@/components/blog/article-card'
import type { BlogArticle } from '@/components/blog/blog-types'

type LatestStoriesProps = {
  /** The stories on the current page. */
  stories: BlogArticle[]
  /** 1-based current page. */
  page: number
  pageCount: number
  onPageChange: (page: number) => void
}

/** Up to this many pages, every number is shown; beyond it, distant pages collapse into an ellipsis. */
const MAX_PLAIN_PAGES = 5

/** Page numbers to show, with `null` for a gap: 1 … 4 5 6 … 12. */
function pageItems(page: number, pageCount: number): (number | null)[] {
  if (pageCount <= MAX_PLAIN_PAGES) return Array.from({ length: pageCount }, (_, index) => index + 1)

  const start = Math.max(2, Math.min(page - 1, pageCount - 3))
  const end = Math.min(pageCount - 1, Math.max(page + 1, 4))
  const middle = Array.from({ length: end - start + 1 }, (_, index) => start + index)
  return [1, ...(start > 2 ? [null] : []), ...middle, ...(end < pageCount - 1 ? [null] : []), pageCount]
}

export function LatestStories({ stories, page, pageCount, onPageChange }: LatestStoriesProps) {
  return (
    <section aria-labelledby="latest-stories-heading">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">Latest stories</p>
          <h2 className="mt-2 scroll-mt-8 text-2xl font-semibold tracking-[-0.035em] text-slate-900 sm:text-3xl" id="latest-stories-heading">
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

      {pageCount > 1 && (
        <nav aria-label="Story pages" className="mt-9 flex items-center justify-center gap-1.5">
          <Button
            aria-label="Previous page"
            className="size-9 rounded-full text-slate-500"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            size="icon"
            variant="ghost"
          >
            <ChevronLeft aria-hidden="true" />
          </Button>
          {pageItems(page, pageCount).map((pageNumber, index) =>
            pageNumber === null ? (
              <span aria-hidden="true" className="px-1 text-sm text-slate-400" key={`gap-${index}`}>
                …
              </span>
            ) : (
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
            ),
          )}
          <Button
            aria-label="Next page"
            className="size-9 rounded-full text-slate-500"
            disabled={page >= pageCount}
            onClick={() => onPageChange(page + 1)}
            size="icon"
            variant="ghost"
          >
            <ChevronRight aria-hidden="true" />
          </Button>
        </nav>
      )}
    </section>
  )
}
