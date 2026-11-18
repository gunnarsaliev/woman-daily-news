'use client'

import { usePathname } from 'next/navigation'
import { useCategoryIds } from '@/components/category-ids-provider'
import { ArticleSkeleton, CategorySkeleton } from '@/components/page-skeletons'

/** Shown instantly on navigation while a category or post page renders. */
export default function Loading() {
  const segments = usePathname().split('/').filter(Boolean)
  const categoryIds = useCategoryIds()
  const isCategory = segments.length === 1 && categoryIds.includes(segments[0])
  return isCategory ? <CategorySkeleton /> : <ArticleSkeleton />
}
