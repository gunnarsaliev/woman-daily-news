import { Skeleton } from '@/components/ui/skeleton'

/**
 * Loading placeholders shown by loading.tsx while a page streams in.
 * Each mirrors the real page's layout so nothing jumps when the content arrives.
 */

const CATEGORY_PLACEHOLDERS = 6
const CARD_PLACEHOLDERS = 6
const PARAGRAPH_PLACEHOLDERS = 3

/** The light-blue page background and rounded white card every page sits in. */
function PageShell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <main aria-busy="true" className="min-h-screen bg-[#f0f6ff] px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
      {/* Announces the loading state to screen readers; the skeleton shapes are hidden from them. */}
      <p className="sr-only" role="status">
        {label}
      </p>
      <div
        aria-hidden="true"
        className="mx-auto max-w-[1440px] overflow-clip rounded-[28px] border border-white/80 bg-white shadow-[0_24px_80px_-48px_rgba(38,94,162,0.35)]"
      >
        {children}
      </div>
    </main>
  )
}

function BreadcrumbsSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="h-4 w-14" />
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-40" />
    </div>
  )
}

export function ArticleCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[20px] border border-slate-100 bg-white">
      <Skeleton className="aspect-[1.55] w-full rounded-none" />
      <div className="flex flex-col gap-3 p-4 sm:p-5">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-11/12" />
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="mt-1 h-4 w-full" />
        <Skeleton className="mt-2 h-3 w-28" />
      </div>
    </div>
  )
}

/** Home page: hero, topic bar, featured stories and the latest-stories grid. */
export function HomeSkeleton() {
  return (
    <PageShell label="Loading the latest stories…">
      <div className="px-5 pb-12 pt-10 sm:px-8 md:px-10 md:pt-12 lg:px-12">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4">
          <Skeleton className="h-7 w-64 rounded-full" />
          <Skeleton className="mt-1 h-9 w-full max-w-2xl md:h-12" />
          <Skeleton className="h-9 w-2/3 max-w-xl md:h-12" />
          <Skeleton className="mt-1 h-4 w-full max-w-xl" />
        </div>

        <div className="mt-9 flex gap-2 overflow-hidden rounded-full bg-slate-50/90 p-1.5">
          {Array.from({ length: CATEGORY_PLACEHOLDERS }, (_, index) => (
            <Skeleton className="h-10 w-28 shrink-0 rounded-full" key={index} />
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-[0.88fr_1.78fr_0.98fr]">
          <div className="hidden flex-col gap-5 lg:flex">
            {Array.from({ length: 4 }, (_, index) => (
              <div className="flex flex-col gap-2" key={index}>
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
          <Skeleton className="min-h-[360px] rounded-[22px] sm:min-h-[460px]" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:flex lg:flex-col">
            <Skeleton className="aspect-[1.75] rounded-[18px]" />
            <Skeleton className="aspect-[1.75] rounded-[18px]" />
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 px-5 py-12 sm:px-8 md:px-10 lg:px-12">
        <Skeleton className="h-8 w-64" />
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <ArticleCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </PageShell>
  )
}

/** Article page: breadcrumbs, centred title block, hero image, and body with the sidebar. */
export function ArticleSkeleton() {
  return (
    <PageShell label="Loading story…">
      <div className="px-5 pb-12 pt-8 sm:px-8 md:px-10 md:pt-10 lg:px-12">
        <BreadcrumbsSkeleton />

        <div className="mx-auto mt-8 flex max-w-5xl flex-col items-center gap-4">
          <Skeleton className="h-10 w-full max-w-3xl md:h-14" />
          <Skeleton className="h-10 w-2/3 max-w-2xl md:h-14" />
          <Skeleton className="mt-2 h-5 w-full max-w-2xl" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="mt-4 mb-8 aspect-video w-full rounded-lg" />
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-12">
          <div className="flex flex-col gap-8">
            {Array.from({ length: PARAGRAPH_PLACEHOLDERS }, (_, index) => (
              <div className="flex flex-col gap-3" key={index}>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            ))}
          </div>
          <div className="hidden flex-col gap-3 lg:flex">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-5/6" />
            <Skeleton className="h-3.5 w-4/6" />
          </div>
        </div>
      </div>
    </PageShell>
  )
}

/** Category page: breadcrumbs, title and a grid of article cards. */
export function CategorySkeleton() {
  return (
    <PageShell label="Loading stories…">
      <div className="px-5 pb-12 pt-8 sm:px-8 md:px-10 md:pt-10 lg:px-12">
        <BreadcrumbsSkeleton />
        <Skeleton className="mt-8 h-10 w-64 md:h-12" />
        <Skeleton className="mt-4 h-5 w-full max-w-xl" />
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: CARD_PLACEHOLDERS }, (_, index) => (
            <ArticleCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </PageShell>
  )
}
