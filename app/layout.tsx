import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import { CategoryIdsProvider } from '@/components/category-ids-provider'
import { JsonLd } from '@/components/json-ld'
import { getCategories } from '@/lib/payload'
import { IS_INDEXABLE, OPEN_GRAPH_DEFAULTS, SITE_DESCRIPTION, SITE_LANGUAGE, SITE_NAME, SITE_TAGLINE, SITE_URL } from '@/lib/site'
import { siteSchema } from '@/lib/structured-data'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  // Resolves relative canonical, Open Graph and Twitter URLs to absolute ones.
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  publisher: SITE_NAME,
  category: 'news',
  // Pages set their own canonical; this keeps the RSS feed discoverable on pages that don't.
  alternates: { types: { 'application/rss+xml': [{ url: '/feed.xml', title: `${SITE_NAME} RSS feed` }] } },
  openGraph: { ...OPEN_GRAPH_DEFAULTS, type: 'website' },
  twitter: { card: 'summary_large_image' },
  robots: IS_INDEXABLE
    ? {
        index: true,
        follow: true,
        // Large image previews are needed for Google Discover and Top Stories.
        googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
      }
    : { index: false, follow: false },
  formatDetection: { telephone: false, email: false, address: false },
  // Favicons come from app/icon.tsx and app/apple-icon.tsx.
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f0f6ff',
}

async function getCategoryIds(): Promise<string[]> {
  try {
    return (await getCategories()).map((category) => category.id)
  } catch (error) {
    // Pages still render while the CMS is unreachable; loading skeletons then default to the article layout.
    console.error(error)
    return []
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const categoryIds = await getCategoryIds()

  return (
    <html lang={SITE_LANGUAGE} data-scroll-behavior="smooth" className={`light ${geist.variable}`}>
      <body className="antialiased">
        <JsonLd data={siteSchema()} />
        <CategoryIdsProvider ids={categoryIds}>{children}</CategoryIdsProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
