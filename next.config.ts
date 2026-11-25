import type { NextConfig } from "next"

const payloadUrl = new URL(process.env.PAYLOAD_API_URL ?? "http://localhost:3001")
const isLocalPayload = ["localhost", "127.0.0.1"].includes(payloadUrl.hostname)

// Canonical URLs, sitemaps and structured data are built from the public site URL. A production deploy without it
// would silently point all of them at the *.vercel.app domain, so the build warns.
if (process.env.VERCEL_ENV === 'production' && !process.env.NEXT_PUBLIC_SITE_URL?.trim()) {
  // Vercel's production domain (your custom domain once one is assigned) is used instead; see lib/site.ts.
  console.warn(
    `⚠ NEXT_PUBLIC_SITE_URL is not set; canonical URLs will use ${process.env.VERCEL_PROJECT_PRODUCTION_URL ?? 'localhost'}. Set it in Vercel to your real domain.`,
  )
}

/**
 * Security headers for every response. There is deliberately no `script-src`: a nonce-based policy would force
 * every page to render dynamically (losing static generation), and the inline JSON-LD and streaming scripts
 * need inline execution. This policy only covers framing, plugins, base URLs and form targets.
 */
const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
  { key: 'X-Frame-Options', value: 'DENY' },
  {
    key: 'Content-Security-Policy',
    value: [
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "object-src 'none'",
      "form-action 'self'",
      // Only on Vercel (always HTTPS); locally `next start` serves plain HTTP.
      ...(process.env.VERCEL ? ['upgrade-insecure-requests'] : []),
    ].join('; '),
  },
]

const nextConfig: NextConfig = {
  // Don't advertise the framework in an X-Powered-By header.
  poweredByHeader: false,
  images: {
    // AVIF is ~20% smaller than WebP; browsers without it get WebP.
    formats: ['image/avif', 'image/webp'],
    // CMS uploads and Unsplash photos don't change at a given URL, so optimized copies are kept for 30 days
    // instead of the 4-hour default, which saves re-optimizing them.
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // Allow next/image to optimize media served by Payload CMS and Unsplash.
    remotePatterns: [
      new URL("/api/media/**", payloadUrl),
      new URL("https://images.unsplash.com/**"),
    ],
    // Needed only while the CMS runs on this machine.
    dangerouslyAllowLocalIP: isLocalPayload,
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
  async rewrites() {
    return {
      // Checked before pages, so /<post>.md reaches the Markdown handler, not the article page.
      beforeFiles: [{ source: '/:path+.md', destination: '/api/md/:path+' }],
    }
  },
}

export default nextConfig
