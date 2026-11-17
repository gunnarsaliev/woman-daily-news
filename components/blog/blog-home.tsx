'use client'

import { useMemo, useState } from 'react'
import { BlogHero } from '@/components/blog/blog-hero'
import { CategoryBar } from '@/components/blog/category-bar'
import { FeaturedStories } from '@/components/blog/featured-stories'
import { LatestStories } from '@/components/blog/latest-stories'
import { SiteFooter } from '@/components/blog/site-footer'
import { TrustStrip } from '@/components/blog/trust-strip'
import type { BlogArticle, BlogHomeData } from '@/components/blog/blog-types'

const PAGE_SIZE = 6
const PAGE_NUMBERS = [1, 2, 3, 4, 10]

function getVisibleStories(stories: BlogArticle[], page: number) {
  if (stories.length <= PAGE_SIZE) return stories

  const start = ((page - 1) * PAGE_SIZE) % stories.length
  return Array.from({ length: Math.min(PAGE_SIZE, stories.length) }, (_, index) => {
    return stories[(start + index) % stories.length]
  })
}

export function BlogHome({ data }: { data: BlogHomeData }) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [activePage, setActivePage] = useState(4)

  const filteredArticles = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return data.articles.filter((article) => {
      const matchesCategory = activeCategory === 'all' || article.categoryId === activeCategory
      const searchableText = [article.title, article.summary, ...article.tags].join(' ').toLowerCase()
      return matchesCategory && (!normalizedSearch || searchableText.includes(normalizedSearch))
    })
  }, [activeCategory, data.articles, search])

  const spotlight = filteredArticles.find((article) => article.id === data.spotlightArticleId) ?? filteredArticles[0]
  const supportingStories = filteredArticles.filter((article) => article.id !== spotlight?.id)
  const latestStories = filteredArticles.filter((article) => article.id !== spotlight?.id)
  const visibleStories = getVisibleStories(latestStories, activePage)

  function changeCategory(categoryId: string) {
    setActiveCategory(categoryId)
    setActivePage(1)
  }

  function changeSearch(value: string) {
    setSearch(value)
    setActivePage(1)
  }

  return (
    <main className="min-h-screen bg-[#f0f6ff] px-3 py-4 sm:px-6 sm:py-8 lg:px-8" id="top">
      <div className="mx-auto max-w-[1440px] overflow-hidden rounded-[28px] border border-white/80 bg-white shadow-[0_24px_80px_-48px_rgba(38,94,162,0.35)]">
        <div className="px-5 pb-12 pt-10 sm:px-8 md:px-10 md:pt-12 lg:px-12">
          <BlogHero data={data.hero} />
          <CategoryBar
            categories={data.categories}
            activeCategory={activeCategory}
            search={search}
            onCategoryChange={changeCategory}
            onSearchChange={changeSearch}
          />
          {spotlight ? (
            <FeaturedStories
              spotlight={spotlight}
              trending={supportingStories.slice(0, 4)}
              supporting={supportingStories.slice(4, 6)}
            />
          ) : (
            <div className="mt-10 rounded-2xl border border-dashed border-slate-200 px-6 py-12 text-center text-sm text-slate-500">
              No stories match your search. Try another keyword or topic.
            </div>
          )}
        </div>

        <TrustStrip brands={data.trustedBy} />

        <div className="px-5 py-12 sm:px-8 md:px-10 lg:px-12">
          <LatestStories
            stories={visibleStories}
            page={activePage}
            pageNumbers={PAGE_NUMBERS}
            onPageChange={setActivePage}
          />
        </div>

        <SiteFooter />
      </div>
    </main>
  )
}
