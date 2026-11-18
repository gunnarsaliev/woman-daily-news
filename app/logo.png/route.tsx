import { brandMarkImage } from '@/lib/brand-image'
import { LOGO_SIZE } from '@/lib/site'

/** Stable logo URL for Organization structured data (Google requires at least 112×112). */
export const dynamic = 'force-static'

export function GET() {
  return brandMarkImage(LOGO_SIZE)
}
