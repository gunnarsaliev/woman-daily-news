'use client'

import { createContext, useContext } from 'react'

/**
 * Slugs of every category, provided by the root layout. Categories and posts share the [slug] route,
 * and loading.tsx receives no params, so this tells its skeleton which kind of page is loading.
 */
const CategoryIdsContext = createContext<readonly string[]>([])

export function CategoryIdsProvider({ ids, children }: { ids: readonly string[]; children: React.ReactNode }) {
  return <CategoryIdsContext.Provider value={ids}>{children}</CategoryIdsContext.Provider>
}

export function useCategoryIds() {
  return useContext(CategoryIdsContext)
}
