import type { NextConfig } from "next"

const payloadUrl = new URL(process.env.PAYLOAD_API_URL ?? "http://localhost:3001")
const isLocalPayload = ["localhost", "127.0.0.1"].includes(payloadUrl.hostname)

const nextConfig: NextConfig = {
  images: {
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
