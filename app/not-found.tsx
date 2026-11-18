import type { Metadata } from 'next'
import Link from 'next/link'
import type { BlogCategory } from '@/components/blog/blog-types'
import { getCategories } from '@/lib/payload'
import { SiteShell } from '@/components/site-shell'
import { categoryPath } from '@/lib/routes'

// Next.js sends a 404 status and adds `noindex` to this page automatically.
export const metadata: Metadata = { title: 'Page not found' }

async function getSafeCategories(): Promise<BlogCategory[]> {
  try {
    return await getCategories()
  } catch {
    // The page still helps the reader home while the CMS is unreachable.
    return []
  }
}

export default async function NotFound() {
  const categories = await getSafeCategories()

  return (
    <SiteShell>
      <section className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6">
        <p className="text-sm font-semibold text-sky-700">404</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.035em] text-slate-900 md:text-5xl">Page not found</h1>
        <p className="mt-4 text-lg text-slate-500">
          The story you were looking for has moved or no longer exists. Try one of our sections instead.
        </p>
        <Link
          className="mt-8 inline-flex h-10 items-center rounded-md bg-sky-600 px-5 text-sm font-medium text-white hover:bg-sky-700"
          href="/"
        >
          Back to the latest stories
        </Link>

        {categories.length > 0 && (
          <nav aria-label="Sections" className="mt-10">
            <ul className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    className="inline-flex rounded-full bg-slate-50 px-3 py-1.5 text-sm text-sky-700 hover:bg-sky-50"
                    href={categoryPath(category.id)}
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </section>
    </SiteShell>
  )
}
