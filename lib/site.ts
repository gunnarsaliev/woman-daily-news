/**
 * Site-wide identity used by metadata, structured data, sitemaps and feeds.
 *
 * NEXT_PUBLIC_SITE_URL  public origin of the site, e.g. https://example.com (a bare domain is treated as https).
 *                       Falls back to Vercel's production domain, then to localhost.
 */
/** Origin of a configured URL; a bare domain like `example.com` is treated as https. */
function toOrigin(value: string, source: string) {
  const trimmed = value.trim()
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  try {
    return new URL(withProtocol).origin
  } catch {
    throw new Error(`${source} is not a valid URL: "${value}". Use a full origin such as https://example.com.`)
  }
}

/**
 * Each environment links to itself, so Open Graph images, sitemaps and feeds resolve wherever they are viewed:
 * - `next dev`: localhost (the production domain may not have the new routes yet)
 * - Vercel preview deployments: the preview's own URL (previews are noindex, so canonicals don't matter there)
 * - production and local `next start`: NEXT_PUBLIC_SITE_URL, else Vercel's production domain
 */
function resolveSiteUrl() {
  if (process.env.NODE_ENV === 'development') return `http://localhost:${process.env.PORT || 3000}`
  if (process.env.VERCEL_ENV === 'preview' && process.env.VERCEL_URL) return toOrigin(process.env.VERCEL_URL, 'VERCEL_URL')

  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  if (explicit?.trim()) return toOrigin(explicit, 'NEXT_PUBLIC_SITE_URL')
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (vercel?.trim()) return toOrigin(vercel, 'VERCEL_PROJECT_PRODUCTION_URL')
  return 'http://localhost:3000'
}

export const SITE_URL = resolveSiteUrl()
export const SITE_NAME = 'Woman Daily News'
export const SITE_TAGLINE = 'Health, life and style stories for women'
export const SITE_DESCRIPTION =
  'Daily reads on health, wellbeing, relationships, money and travel, written for women who want clear answers and good ideas.'
/** BCP 47 language of the content, for HTML, JSON-LD and feeds. */
export const SITE_LANGUAGE = 'en'
/** Open Graph locale. */
export const SITE_LOCALE = 'en_US'
/** Profiles of the publication on other sites (social networks, Wikipedia…), for Organization `sameAs`. */
export const SITE_SAME_AS: string[] = []

/**
 * Public contact address shown on /contact and in Organization structured data (NEXT_PUBLIC_CONTACT_EMAIL).
 * Nothing is shown while it is unset.
 */
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? ''

/** About, editorial and legal pages, linked from the footer and listed in the sitemap and llms.txt. */
export const TRUST_PAGES = [
  { path: '/about', label: 'About us' },
  { path: '/editorial-policy', label: 'Editorial policy' },
  { path: '/contact', label: 'Contact' },
  { path: '/privacy', label: 'Privacy policy' },
] as const

/** Only production deployments are indexed; previews and local builds tell crawlers to stay away. */
export const IS_INDEXABLE = process.env.VERCEL_ENV ? process.env.VERCEL_ENV === 'production' : process.env.NODE_ENV === 'production'

/** Absolute URL of a site path. */
export function absoluteUrl(path = '/') {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

export const ORGANIZATION_ID = absoluteUrl('/#organization')
export const WEBSITE_ID = absoluteUrl('/#website')
/** Square 512×512 logo served by app/logo.png/route.tsx, for Organization structured data. */
export const LOGO_URL = absoluteUrl('/logo.png')
export const LOGO_SIZE = 512
/** Brand colours shared by generated icons, logo and social images. */
export const BRAND = { background: '#0284c7', foreground: '#ffffff', accent: '#0c4a6e', initials: 'WD' }

/** Open Graph fields every page shares. Pages that set `openGraph` replace the layout's, so they spread this in. */
export const OPEN_GRAPH_DEFAULTS = { siteName: SITE_NAME, locale: SITE_LOCALE } as const

/**
 * Site-wide sharing card from app/opengraph-image.tsx. Pages that set their own `openGraph`/`twitter`
 * lose the file-based image, so they reference it explicitly.
 */
export const DEFAULT_SOCIAL_IMAGE = { url: '/opengraph-image', width: 1200, height: 630, alt: `${SITE_NAME} — ${SITE_TAGLINE}` }

/**
 * Image for Open Graph / Twitter cards. Unsplash images are cropped to the recommended 1200×630;
 * CMS images are used as they are (their size isn't known).
 */
export function socialImage(src: string, alt: string) {
  try {
    const url = new URL(src)
    if (url.hostname === 'images.unsplash.com') {
      url.searchParams.set('w', '1200')
      url.searchParams.set('h', '630')
      url.searchParams.set('fit', 'crop')
      return { url: url.toString(), width: 1200, height: 630, alt }
    }
  } catch {
    // Relative URLs are resolved against metadataBase by Next.js.
  }
  return { url: src, alt }
}
