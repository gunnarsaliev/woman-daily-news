import type { NextConfig } from "next"

const payloadUrl = new URL(process.env.PAYLOAD_API_URL ?? "http://localhost:3001")
const isLocalPayload = ["localhost", "127.0.0.1"].includes(payloadUrl.hostname)

const nextConfig: NextConfig = {
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
  async rewrites() {
    return {
      // Checked before pages, so /<post>.md reaches the Markdown handler, not the article page.
      beforeFiles: [{ source: '/:path+.md', destination: '/api/md/:path+' }],
    }
  },
}

export default nextConfig
