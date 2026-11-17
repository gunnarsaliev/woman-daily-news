import {
  Briefcase,
  HeartHandshake,
  HeartPulse,
  LayoutGrid,
  Newspaper,
  Search,
  Shirt,
  Sparkles,
  Tag,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'
import type { BlogCategory } from '@/components/blog/blog-types'

const categoryIcons: Record<string, LucideIcon> = {
  all: LayoutGrid,
  news: Newspaper,
  trends: TrendingUp,
  'health-wellness': HeartPulse,
  beauty: Sparkles,
  fashion: Shirt,
  'career-money': Briefcase,
  relationships: HeartHandshake,
}

type CategoryBarProps = {
  categories: BlogCategory[]
  activeCategory: string
  search: string
  onCategoryChange: (categoryId: string) => void
  onSearchChange: (value: string) => void
}

export function CategoryBar({
  categories,
  activeCategory,
  search,
  onCategoryChange,
  onSearchChange,
}: CategoryBarProps) {
  return (
    <nav aria-label="Filter stories by topic" className="mt-9 rounded-full border border-slate-100 bg-slate-50/90 p-1.5 shadow-sm">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <div className="flex min-w-0 gap-1 overflow-x-auto px-0.5 pb-1 lg:flex-1 lg:overflow-visible lg:pb-0">
          {categories.map((category) => {
            const Icon = categoryIcons[category.id] ?? Tag
            const isActive = activeCategory === category.id

            return (
              <button
                aria-pressed={isActive}
                className={`inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full px-3.5 py-2.5 text-xs font-medium transition-colors sm:px-4 ${isActive ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/20' : 'text-slate-500 hover:bg-white hover:text-slate-900'}`}
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                type="button"
              >
                <Icon aria-hidden="true" className="size-4" />
                {category.label}
              </button>
            )
          })}
        </div>
        <label className="flex h-10 items-center gap-2 rounded-full border border-slate-100 bg-white px-4 text-slate-400 shadow-sm lg:w-[270px] lg:shrink-0">
          <Search aria-hidden="true" className="size-4 shrink-0" />
          <span className="sr-only">Search stories</span>
          <input
            className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search stories"
            type="search"
            value={search}
          />
        </label>
      </div>
    </nav>
  )
}
