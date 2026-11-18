import type { Metadata } from 'next'
import { type Breadcrumb as BreadcrumbItem, Breadcrumbs } from '@/components/blog/breadcrumbs'
import { JsonLd } from '@/components/json-ld'
import { SiteShell } from '@/components/site-shell'
import { DEFAULT_SOCIAL_IMAGE, OPEN_GRAPH_DEFAULTS } from '@/lib/site'
import { breadcrumbSchema, staticPageSchema } from '@/lib/structured-data'

type StaticPageInfo = {
  path: string
  title: string
  description: string
  /** schema.org type of the page. */
  type?: 'AboutPage' | 'ContactPage' | 'WebPage'
}

/** Metadata shared by About, Contact and policy pages: canonical URL and sharing cards. */
export function staticPageMetadata({ path, title, description }: StaticPageInfo): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { ...OPEN_GRAPH_DEFAULTS, type: 'website', url: path, title, description, images: [DEFAULT_SOCIAL_IMAGE] },
    twitter: { card: 'summary', title, description },
  }
}

/** Layout of standalone text pages: breadcrumbs, title, intro and a prose body. */
export function StaticPage({ path, title, description, type = 'WebPage', children }: StaticPageInfo & { children: React.ReactNode }) {
  const breadcrumbs: BreadcrumbItem[] = [{ label: 'Home', href: '/' }, { label: title }]

  return (
    <SiteShell>
      <JsonLd data={staticPageSchema(type, { path, name: title, description })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs, path)} />
      <article className="mx-auto max-w-3xl px-5 pb-16 pt-8 sm:px-8 md:pt-10">
        <Breadcrumbs items={breadcrumbs} />
        <header className="mt-8">
          <h1 className="text-4xl font-semibold tracking-[-0.035em] text-pretty text-slate-900 md:text-5xl">{title}</h1>
          <p className="mt-3 text-lg text-slate-500">{description}</p>
        </header>
        <div className="prose prose-slate mt-10 max-w-none">{children}</div>
      </article>
    </SiteShell>
  )
}
