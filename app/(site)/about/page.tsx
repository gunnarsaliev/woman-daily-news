import Link from 'next/link'
import type { BlogCategory } from '@/components/blog/blog-types'
import { StaticPage, staticPageMetadata } from '@/components/static-page'
import { getCategories } from '@/lib/payload'
import { categoryPath } from '@/lib/routes'
import { SITE_DESCRIPTION, SITE_NAME } from '@/lib/site'

// TEMPLATE: neutral starter copy. Add who runs the publication, its history and its editors before launch.
const page = {
  path: '/about',
  title: `About ${SITE_NAME}`,
  description: SITE_DESCRIPTION,
  type: 'AboutPage' as const,
}

export const metadata = staticPageMetadata(page)

async function getSafeCategories(): Promise<BlogCategory[]> {
  try {
    return await getCategories()
  } catch {
    return []
  }
}

export default async function AboutPage() {
  const categories = await getSafeCategories()

  return (
    <StaticPage {...page}>
      <p>
        {SITE_NAME} is an independent online publication. We publish clear, practical stories for readers who want to
        understand what is changing and what it means for them.
      </p>

      {categories.length > 0 && (
        <>
          <h2>What we cover</h2>
          <ul>
            {categories.map((category) => (
              <li key={category.id}>
                <Link href={categoryPath(category.id)}>{category.label}</Link>
                {category.description ? ` — ${category.description}` : null}
              </li>
            ))}
          </ul>
        </>
      )}

      <h2>How we work</h2>
      <p>
        Our <Link href="/editorial-policy">editorial policy</Link> explains how we choose, source, check and correct our
        stories. If you spot an error or want to get in touch, visit our <Link href="/contact">contact page</Link>.
      </p>
    </StaticPage>
  )
}
