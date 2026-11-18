import { timingSafeEqual } from 'node:crypto'
import { revalidateTag } from 'next/cache'
import type { NextRequest } from 'next/server'
import { CMS_CACHE_TAG } from '@/lib/payload'

/**
 * Refreshes every page and feed built from CMS content, right after an editor publishes.
 * Call it from a Payload `afterChange`/`afterDelete` hook (or a webhook):
 *
 *   POST /api/revalidate
 *   Authorization: Bearer <REVALIDATE_SECRET>
 *
 * Pages keep serving the cached version while the fresh one renders in the background.
 */
function isAuthorized(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET
  if (!secret) return false
  const header = request.headers.get('authorization') ?? ''
  const token = header.startsWith('Bearer ') ? header.slice('Bearer '.length) : ''
  const expected = Buffer.from(secret)
  const received = Buffer.from(token)
  // Constant-time comparison, so the secret can't be guessed from response timing.
  return expected.length === received.length && timingSafeEqual(expected, received)
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) return Response.json({ revalidated: false }, { status: 401 })

  revalidateTag(CMS_CACHE_TAG, 'max')
  return Response.json({ revalidated: true, now: Date.now() })
}
